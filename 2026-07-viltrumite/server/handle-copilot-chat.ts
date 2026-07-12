import { buildCopilotSystemPrompt, buildCopilotUserMessage } from "../lib/analysis/copilotPrompt";
import {
  DEFAULT_OXLO_CONFIG,
  type OxloConfig,
} from "../lib/analysis/types";

interface CopilotChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

async function callOxloCopilotAPI(
  message: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> | undefined,
  apiKey: string,
  config: OxloConfig = DEFAULT_OXLO_CONFIG,
): Promise<string> {
  if (!apiKey) {
    throw new Error("Server is missing OXLO_API_KEY configuration");
  }

  const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
    { role: "system", content: buildCopilotSystemPrompt() },
  ];

  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory);
  }

  messages.push({ role: "user", content: buildCopilotUserMessage(message) });

  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: 0.7,
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

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid response format from AI service");
  }

  return data.choices[0].message.content || "";
}

export interface CopilotAPIResponse {
  reply: string;
  success: boolean;
  error?: string;
}

export async function handleCopilotChatRequest(
  body: unknown,
  apiKey: string | undefined,
): Promise<CopilotAPIResponse> {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  const request = body as Record<string, unknown>;
  const message = request.message as string;
  
  // Support both conversationHistory and history for compatibility
  const conversationHistory = (request.conversationHistory || request.history) as Array<{
    role: "user" | "assistant" | string;
    content?: string;
    text?: string;
  }> | undefined;

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("Missing required field: message");
  }

  try {
    // Transform history format to match expected API format
    const apiHistory = conversationHistory?.map(msg => ({
      role: msg.role === "user" ? "user" : msg.role === "ai" ? "assistant" : "assistant",
      content: msg.content || msg.text || "",
    }));

    const response = await callOxloCopilotAPI(
      message,
      apiHistory,
      apiKey ?? "",
    );
    return {
      reply: response,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Copilot chat failed";
    return {
      reply: "",
      success: false,
      error: errorMessage,
    };
  }
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
