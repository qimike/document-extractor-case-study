# Document Extractor (Next.js + Flask)

Simple full-stack document extraction demo that processes invoice images (via OCR), extracts key information, and stores/synchronizes data with CSV files.

- **Frontend**: Next.js (React)  
- **Backend**: Flask (Python) + Tesseract OCR  
- **Storage**: CSV files (lightweight database replacement)

## Features

- Upload invoice images (PNG, JPG, etc.)
- OCR-based text extraction using Tesseract
- Structured data parsing (invoice number, date, total, line items, etc.)
- Display extracted data in a clean editable table
- Save edited results back to CSV files
- Sample sales order header & detail structure

## Prerequisites

Make sure these tools are installed:

- **Node.js** 20.19.4 (strongly recommended — use `nvm`)
- **Python**  3.14.2
- **pip** 25.3 (bundled with python 3.14)
- **Tesseract OCR** (required for text extraction from images)

### Install Tesseract

**macOS**

```bash
brew install tesseract

doc-extractor/
├── frontend/              # Next.js application
├── backend/               # Flask API + OCR logic
├── invoices/              # Sample invoice images for testing
├── csv_db/                # CSV "database"
│   ├── SalesOrderHeader.csv
│   └── SalesOrderDetail.csv
└── README.md

cd frontend

# Use correct Node version
nvm use 20.19.4

npm install
npm run dev

Open: http://localhost:3000

cd backend

# Create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python app.py
Backend runs on: http://127.0.0.1:5000


### extract data stores in csv_db folders
SalesOrderHeader.csv stores headers 
SalesOrderDetail.csv stores order details

###test invoices from invoices folder 
invoice.png, invoice1.jpg

