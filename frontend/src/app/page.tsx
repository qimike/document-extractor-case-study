"use client";

import { useEffect, useState } from "react";
import UploadPanel from "../components/UploadPanel";
import ExtractionEditor from "../components/ExtractionEditor";
import LineItemsTable from "../components/LineItemsTable";
import { uploadDocument, getJobStatus, saveOrder } from "../../lib/api";
import { ExtractionResult } from "../../lib/types";

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const [result, setResult] = useState<ExtractionResult | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await getJobStatus(jobId);

      if (res.status === "done") {
        setResult(res.result);
        setStatus("done");
        clearInterval(interval);
      }

      if (res.status === "error") {
        setStatus("error");
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [jobId]);


  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Document Extraction</h1>

      <UploadPanel
        onUpload={async (file) => {
          setStatus("processing");
          const { jobId } = await uploadDocument(file);
          setJobId(jobId);
        }}
      />

      {status === "processing" && <p>Extracting document…</p>}

     

      {result && (
        <>
          <ExtractionEditor
            header={result.header}
            onChange={(h) => setResult({ ...result, header: h })}
          />

          <LineItemsTable
            lines={result.lines}
            onChange={(l) => setResult({ ...result, lines: l })}
          />

          <button
            onClick={() => result && saveOrder(result)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save to Database
          </button>
        </>
      )}
    </main>
  );
}
