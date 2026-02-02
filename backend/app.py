import os, uuid, threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from jobs import JOBS
from extractor_llm import extract_invoice_to_json, normalize_line_fields
from dotenv import load_dotenv
from csv_db import append_row_to_csv
import pandas as pd

load_dotenv()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app)

@app.get("/health")
def health():
    return {"status": "ok"}

# ---- Upload & start extraction job ----
@app.post("/api/upload")
def upload():
    f = request.files["file"]
    job_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{f.filename}")
    f.save(file_path)

    JOBS[job_id] = {"status": "pending"}

    def worker():
        try:
            result = extract_invoice_to_json(file_path)
            if "lines" in result:
                result["lines"] = [normalize_line_fields(l) for l in result["lines"]]
            JOBS[job_id] = {"status": "done", "result": result}
        except Exception as e:
            JOBS[job_id] = {"status": "error", "error": str(e)}

    threading.Thread(target=worker, daemon=True).start()
    return {"jobId": job_id}

@app.get("/api/jobs/<job_id>")
def job_status(job_id):
    return jsonify(JOBS.get(job_id, {"status": "error", "error": "job not found"}))

# ---- Save extracted result to CSV (“after” state) ----
SALES_ORDER_HEADER_COLUMNS = [
    "SalesOrderNumber",
    "RevisionNumber",
    "OrderDate",
    "DueDate",
    "ShipDate",
    "Status",
    "OnlineOrderFlag",
    "SalesOrderNumber",
    "PurchaseOrderNumber",
    "AccountNumber",
    "CustomerName",
    "SalesPersonID",
    "TerritoryID",
    "BillToAddressID",
    "ShipToAddressID",
    "ShipMethodID",
    "CreditCardID",
    "CreditCardApprovalCode",
    "CurrencyRateID",
    "SubTotal",
    "TaxAmt",
    "Freight",
    "TotalDue"
]

@app.post("/api/orders")
def save_order():
    data = request.json
    header = data["header"]
    lines = data["lines"]

   # Map header to correct columns
    mapped_header = {col: header.get(col, "") for col in SALES_ORDER_HEADER_COLUMNS}
    append_row_to_csv("./csv_db/SalesOrderHeader.csv", mapped_header)

    for idx, line in enumerate(lines, start=1):
        mapped_line = {
            "SalesOrderID": header.get("SalesOrderNumber", ""),  
            "SalesOrderDetailID": idx,  
            "CarrierTrackingNumber": "",
            "OrderQty": line.get("OrderQty", ""),
            "ProductID": line.get("Description", ""),
            "SpecialOfferID": "",
            "UnitPrice": line.get("UnitPrice", ""),
            "UnitPriceDiscount": "",
            "LineTotal": line.get("LineTotal", "")
        }
        append_row_to_csv("./csv_db/SalesOrderDetail.csv", mapped_line)

    return {"status": "success"}

@app.get("/api/orders")
def list_orders():
    try:
        df = pd.read_csv("./csv_db/SalesOrderHeader.csv")
        rows = df.to_dict(orient="records")
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)})

if __name__ == "__main__":
    app.run(port=5000, debug=True)