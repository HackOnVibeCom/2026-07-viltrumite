export interface CopilotMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CopilotChatRequest {
  message: string;
  conversationHistory?: CopilotMessage[];
}

export interface CopilotChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

const API_ENDPOINT = "/api/copilot-chat";

export async function sendCopilotMessage(
  message: string,
  conversationHistory?: CopilotMessage[],
): Promise<CopilotChatResponse> {
  try {
    const payload: CopilotChatRequest = {
      message,
      conversationHistory,
    };

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `API error: ${response.status}`;
      return {
        response: "",
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json();
    return {
      response: data.response || "",
      success: data.success !== false,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send message";
    return {
      response: "",
      success: false,
      error: errorMessage,
    };
  }
}
