import type { OxloAnalysisResponse } from "./types";

export function extractMessageContent(data: unknown): string {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response from AI service");
  }

  const choices = (data as { choices?: Array<{ message?: { content?: string } }> }).choices;
  const content = choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("AI service returned an empty response");
  }

  return content;
}

export function parseAnalysisJson(content: string): OxloAnalysisResponse {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = (fenced?.[1] ?? trimmed).trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  return validateAnalysisResponse(parsed);
}

function validateAnalysisResponse(data: unknown): OxloAnalysisResponse {
  if (!data || typeof data !== "object") {
    throw new Error("AI response missing required fields");
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.growthScore !== "number" || typeof obj.confidence !== "number") {
    throw new Error("AI response missing score fields");
  }

  if (!Array.isArray(obj.topPartners) || !Array.isArray(obj.launchStrategy)) {
    throw new Error("AI response missing partner or strategy data");
  }

  return obj as OxloAnalysisResponse;
}
