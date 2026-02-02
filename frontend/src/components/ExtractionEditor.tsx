"use client";

import { SalesOrderHeader } from "../../lib/types";

export default function ExtractionEditor({
  header,
  onChange,
}: {
  header: SalesOrderHeader;
  onChange: (h: SalesOrderHeader) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(header).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium">{key}</label>
          <input
            className="border p-2 w-full"
            value={value ?? ""}
            onChange={(e) =>
              onChange({ ...header, [key]: e.target.value })
            }
          />
        </div>
      ))}
    </div>
  );
}
