/**
 * ⚠️ HACKATHON / DEMO ONLY ⚠️
 * This module calls the Oxlo AI API directly from the browser.
 * The API key is embedded in the client bundle via VITE_OXLO_API_KEY.
 * Before production, move this logic to a secure backend.
 */

// No external AI clients are needed here anymore, routed to local server API proxy.

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
    const response = await fetch("/api/copilot-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history: conversationHistory?.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to contact Copilot API");
    }

    const data = await response.json();
    return {
      response: data.reply,
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
