export type SalesOrderHeader = {
  salesOrderNumber: string;
  purchaseOrderNumber?: string;
  orderDate?: string;
  dueDate?: string;
  shipDate?: string;
  customerName?: string;
  subTotal?: number;
  taxAmt?: number;
  freight?: number;
  totalDue?: number;
};

export type SalesOrderDetail = {
  lineNo: number;
  Description: string;
  OrderQty: number;
  UnitPrice: number;
  UnitPriceDiscount?: number;
  LineTotal: number;
};

export type ExtractionResult = {
  header: SalesOrderHeader;
  lines: SalesOrderDetail[];
};

export type JobStatus =
  | { status: "pending" }
  | { status: "done"; result: ExtractionResult }
  | { status: "error"; error: string };
