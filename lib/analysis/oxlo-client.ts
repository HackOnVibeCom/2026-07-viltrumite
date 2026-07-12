import { buildAnalysisUserPrompt } from "./prompt";
import { extractMessageContent, parseAnalysisJson } from "./parse-response";
import {
  DEFAULT_OXLO_CONFIG,
  type AppProfileInput,
  type OxloAnalysisResponse,
  type OxloConfig,
} from "./types";

export async function callOxloAnalysis(
  profile: AppProfileInput,
  apiKey: string,
  config: OxloConfig = DEFAULT_OXLO_CONFIG,
): Promise<OxloAnalysisResponse> {
  if (!apiKey) {
    throw new Error("Server is missing GROQ_API_KEY configuration");
  }

  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: config.systemPrompt },
        { role: "user", content: buildAnalysisUserPrompt(profile) },
      ],
      response_format: { type: "json_object" },
      max_tokens: config.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      errorBody
        ? `AI service error (${response.status}): ${errorBody.slice(0, 200)}`
        : `AI service error (${response.status})`,
    );
  }

  const data = await response.json();
  const content = extractMessageContent(data);
  return parseAnalysisJson(content);
}
