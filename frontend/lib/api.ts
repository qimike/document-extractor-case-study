import { ExtractionResult, JobStatus } from "./types";

export const API_BASE = "http://127.0.0.1:5000";


export async function uploadDocument(file: File): Promise<{ jobId: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json(); 
}


export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${API_BASE}/api/jobs/${jobId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch job status");
  }

  return res.json();
}


export async function saveOrder(result: ExtractionResult) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  if (!res.ok) {
    throw new Error("Failed to save order");
  }

  return res.json();
}
