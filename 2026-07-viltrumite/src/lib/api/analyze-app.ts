/**
 * ⚠️ HACKATHON / DEMO ONLY ⚠️
 * This module calls the Oxlo AI API directly from the browser.
 * The API key is embedded in the client bundle via VITE_OXLO_API_KEY.
 * Before production, move this logic to a secure backend.
 */

import { oxloChat, extractContent, OxloError } from "@/lib/oxlo";
import { buildAnalysisUserPrompt } from "../../../lib/analysis/prompt";
import { parseAnalysisJson } from "../../../lib/analysis/parse-response";
import { transformToAnalysisResult } from "../../../lib/analysis/transform";
import type { AppProfileInput } from "../../../lib/analysis/types";
import type { AnalysisResult } from "../../../lib/analysis/transform";

export type { AppProfileInput, AnalysisResult };

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

export class AnalyzeAppError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AnalyzeAppError";
  }
}

// ---------------------------------------------------------------------------
// Validation (moved from server/handle-analyze-app.ts)
// ---------------------------------------------------------------------------

const REQUIRED_FIELDS: (keyof AppProfileInput)[] = [
  "appName",
  "description",
  "category",
  "targetAudience",
  "launchDate",
  "platform",
  "pricing",
];

function validateProfile(profile: AppProfileInput): void {
  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = profile[field];
    return typeof value !== "string" || !(value as string).trim();
  });

  if (missing.length > 0) {
    throw new AnalyzeAppError(`Missing required fields: ${missing.join(", ")}`);
  }
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT =
  "You are LaunchMesh AI, an expert startup growth strategist specializing in mobile app launches, audience matching, cross-promotions, and growth partnerships.";

// ---------------------------------------------------------------------------
// Main export – calls Oxlo directly from the browser
// ---------------------------------------------------------------------------

/**
 * Analyze an app profile by calling the Oxlo AI API directly.
 *
 * Pipeline:
 * 1. Validate input
 * 2. Build the analysis prompt
 * 3. Call Oxlo via `oxloChat`
 * 4. Parse the JSON response
 * 5. Transform into `AnalysisResult`
 */
export async function analyzeApp(
  profile: AppProfileInput,
  appIcon?: string,
): Promise<AnalysisResult> {
  validateProfile(profile);

  try {
    const response = await oxloChat(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildAnalysisUserPrompt(profile) },
      ],
      { maxTokens: 1200, temperature: 0.6, silent: true },
    );

    const content = extractContent(response);
    const parsed = parseAnalysisJson(content);
    const result = transformToAnalysisResult(profile, parsed, appIcon);

    return result;
  } catch (err) {
    if (err instanceof OxloError) {
      throw new AnalyzeAppError(err.message, err.status);
    }
    throw err instanceof AnalyzeAppError
      ? err
      : new AnalyzeAppError(
          err instanceof Error ? err.message : "Failed to analyze app",
        );
  }
}
