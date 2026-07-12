import { callOxloAnalysis } from "../lib/analysis/oxlo-client";
import { transformToAnalysisResult } from "../lib/analysis/transform";
import type { AppProfileInput } from "../lib/analysis/types";

const REQUIRED_FIELDS: (keyof AppProfileInput)[] = [
  "appName",
  "description",
  "category",
  "targetAudience",
  "launchDate",
  "platform",
  "pricing",
];

function validateProfile(body: unknown): AppProfileInput {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  const profile = body as Record<string, unknown>;
  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = profile[field];
    return typeof value !== "string" || !value.trim();
  });

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }

  return {
    appName: String(profile.appName).trim(),
    description: String(profile.description).trim(),
    category: String(profile.category).trim(),
    targetAudience: String(profile.targetAudience).trim(),
    launchDate: String(profile.launchDate).trim(),
    platform: String(profile.platform).trim(),
    pricing: String(profile.pricing).trim(),
  };
}

export async function handleAnalyzeAppRequest(
  body: unknown,
  apiKey: string | undefined,
  appIcon?: string,
) {
  const profile = validateProfile(body);
  const oxloResponse = await callOxloAnalysis(profile, apiKey ?? "");
  const result = transformToAnalysisResult(profile, oxloResponse, appIcon);
  return result;
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message }, status);
}
