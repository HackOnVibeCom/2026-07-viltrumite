import type { AppProfileInput } from "../../lib/analysis/types";
import type { AnalysisResult } from "../../lib/analysis/transform";

export type { AppProfileInput, AnalysisResult };

export class AnalyzeAppError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AnalyzeAppError";
  }
}

export async function analyzeApp(profile: AppProfileInput): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze-app", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AnalyzeAppError(
      typeof data.error === "string" ? data.error : "Failed to analyze app",
      response.status,
    );
  }

  return data as AnalysisResult;
}
