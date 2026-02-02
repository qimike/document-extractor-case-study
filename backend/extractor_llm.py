import os
import json
import re
import hashlib
import google.generativeai as genai
import pytesseract
from PIL import Image
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use a free-tier friendly model
model = genai.GenerativeModel(
    model_name="models/gemini-flash-lite-latest"  # Switch to this for potentially better free limits
)

def ocr_invoice(file_path: str) -> str:
    image = Image.open(file_path)
    text = pytesseract.image_to_string(image)
    print("OCR result:\n", text)
    return text

# Simple file-based cache to avoid re-processing
CACHE_DIR = "cache"
os.makedirs(CACHE_DIR, exist_ok=True)

def get_cache_key(file_path: str) -> str:
    with open(file_path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()

def load_from_cache(cache_key: str) -> dict | None:
    cache_file = os.path.join(CACHE_DIR, f"{cache_key}.json")
    if os.path.exists(cache_file):
        with open(cache_file, "r") as f:
            return json.load(f)
    return None

def save_to_cache(cache_key: str, data: dict):
    cache_file = os.path.join(CACHE_DIR, f"{cache_key}.json")
    with open(cache_file, "w") as f:
        json.dump(data, f)

def normalize_line_fields(line):
    return {
        "Description": line.get("description") or line.get("Description") or "",
        "OrderQty": line.get("orderQty") or line.get("OrderQty") or 0,
        "UnitPrice": line.get("unitPrice") or line.get("UnitPrice") or 0,
        "LineTotal": line.get("lineTotal") or line.get("LineTotal") or 0,
        "LineNo": line.get("line_no") or line.get("LineNo") or 0,
    }

@retry(
    stop=stop_after_attempt(5),  # Retry up to 5 times
    wait=wait_exponential(multiplier=1, min=1, max=60),  # Exponential backoff
    retry=retry_if_exception_type(Exception),  # Retry on exceptions
    reraise=True
)
def extract_invoice_to_json(file_path: str) -> dict:
    cache_key = get_cache_key(file_path)
    cached_result = load_from_cache(cache_key)
    if cached_result:
        return cached_result  # Return cached result to save API calls

    invoice_text = ocr_invoice(file_path)

    prompt = f"""
    You are given OCR text from a sales invoice.

    OCR TEXT:
    ----------------
    {invoice_text}
    ----------------

    Extract STRICT JSON:

    {{
      "header": {{
        "SalesOrderNumber": "",
        "OrderDate": "",
        "DueDate": "",
        "CustomerName": "",
        "SubTotal": 0,
        "TaxAmt": 0,
        "Freight": 0,
        "TotalDue": 0
      }},
      "lines": [
        {{
          "line_no": 1,
          "description": "",
          "orderQty": 0,
          "unitPrice": 0,
          "lineTotal": 0
        }}
      ]
    }}

    Rules:
    - Dates yyyy-mm-dd
    - Numbers only
    - Missing → null or 0
    - Output JSON ONLY
    """

    response = model.generate_content(
        prompt,
        generation_config={"temperature": 0}
    )

    print("Gemini raw response:", repr(response.text))
    raw = response.text.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

    if not raw.startswith("{"):
        raise ValueError(f"Gemini API did not return valid JSON. Raw response: {response.text}")

    result = json.loads(raw)

    result["lines"] = [normalize_line_fields(l) for l in result.get("lines", [])]

    save_to_cache(cache_key, result)  # Cache the result
    return result




