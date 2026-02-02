"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../../../lib/api";

export default function DBPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/orders`)
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Extracted Orders (After)</h1>

      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(orders, null, 2)}
      </pre>
    </main>
  );
}
