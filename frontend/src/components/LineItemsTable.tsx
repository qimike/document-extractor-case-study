"use client";

import { SalesOrderDetail } from "../../lib/types";

export default function LineItemsTable({
  lines,
  onChange,
}: {
  lines: SalesOrderDetail[];
  onChange: (lines: SalesOrderDetail[]) => void;
}) {
  return (
    <table className="w-full border mt-4">
      <thead className="bg-gray-100">
        <tr className="text-left">
          <th className="pl-4">Product</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((l, i) => (
          <tr key={i}>
            <td className="pl-4">
              <input
                value={l?.Description ?? ""}
                onChange={(e) => {
                  const copy = [...lines];
                  copy[i].Description = e.target.value;
                  onChange(copy);
                }}
              />
            </td>
            <td>
             <input
              type="number"
              min={1}
              step={1}
              value={l?.OrderQty > 0 ? l.OrderQty : ""}
              onChange={(e) => {
                const val = e.target.value.replace(/^0+/, ""); 
                let num = parseInt(val, 10);
                if (isNaN(num) || num < 1) num = 0; 
                const copy = [...lines];
                copy[i].OrderQty = num;
                copy[i].LineTotal = num * (copy[i].UnitPrice ?? 0);
                onChange(copy);
              }}
            />
            </td>
            <td>
              <input
                type="number"
                min={0}
                step={0.01}
                value={l?.UnitPrice >= 0 ? l.UnitPrice : 0}
                onChange={(e) => {
                  const val = e.target.value.replace(/^0+/, "");
                  let num = parseFloat(val);
                  if (isNaN(num) || num < 0) num = 0; 
                  const copy = [...lines];
                  copy[i].UnitPrice = num;
                  copy[i].LineTotal = (copy[i].OrderQty ?? 0) * num;
                  onChange(copy);
                }}
              />
            </td>
            <td>{l?.LineTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
