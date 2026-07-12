import type { PactResult } from "../../../server/handle-generate-pact";

export type { PactResult };

export async function generatePact(
  myApp: { name: string; category: string; description: string; targetAudience: string },
  partnerApp: { name: string; category: string; description: string; targetAudience: string },
): Promise<PactResult> {
  const response = await fetch("/api/generate-pact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ myApp, partnerApp }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate growth pact");
  }

  return data as PactResult;
}
