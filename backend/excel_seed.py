import pandas as pd
from db import engine
from models import Base

EXCEL_PATH = "Case Study Data.xlsx"  # put file in backend folder

def seed_excel():
    Base.metadata.create_all(bind=engine)

    hdr = pd.read_excel(EXCEL_PATH, sheet_name="SalesOrderHeader")
    dtl = pd.read_excel(EXCEL_PATH, sheet_name="SalesOrderDetail")

    hdr = hdr[[
        "SalesOrderID","OrderDate","DueDate","ShipDate",
        "SalesOrderNumber","PurchaseOrderNumber","CustomerName",
        "SubTotal","TaxAmt","Freight","TotalDue"
    ]]

    dtl = dtl[[
        "SalesOrderDetailID","SalesOrderID","OrderQty","ProductID",
        "UnitPrice","UnitPriceDiscount","LineTotal"
    ]]


    hdr.to_sql("excel_sales_order_header", con=engine, if_exists="replace", index=False)
    dtl.to_sql("excel_sales_order_detail", con=engine, if_exists="replace", index=False)

if __name__ == "__main__":
    seed_excel()
