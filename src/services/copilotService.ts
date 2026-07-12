/**
 * ⚠️ HACKATHON / DEMO ONLY ⚠️
 * This module calls the Oxlo AI API directly from the browser.
 * The API key is embedded in the client bundle via VITE_OXLO_API_KEY.
 * Before production, move this logic to a secure backend.
 */

import { oxloChat, extractContent } from "@/lib/oxlo";
import {
  buildCopilotSystemPrompt,
  buildCopilotUserMessage,
} from "../../lib/analysis/copilotPrompt";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CopilotMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CopilotChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Main export – calls Oxlo directly from the browser
// ---------------------------------------------------------------------------

/**
 * Send a message to the AI Copilot by calling the Oxlo API directly.
 *
 * @param message             The user's message.
 * @param conversationHistory Previous messages for context continuity.
 * @returns                   `CopilotChatResponse` with the AI reply.
 */
export async function sendCopilotMessage(
  message: string,
  conversationHistory?: CopilotMessage[],
): Promise<CopilotChatResponse> {
  try {
    // Build the messages array: system prompt → history → user message
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: buildCopilotSystemPrompt() },
    ];

    // Append conversation history for multi-turn context
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      }
    }

    // Append the current user message
    messages.push({
      role: "user",
      content: buildCopilotUserMessage(message),
    });

    const response = await oxloChat(messages, {
      maxTokens: 1200,
      temperature: 0.7,
      silent: true, // AICopilot handles its own error display
    });

    const reply = extractContent(response);

    return {
      response: reply,
      success: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send message";
    return {
      response: "",
      success: false,
      error: errorMessage,
    };
  }
}
