import {
  errorResponse,
  handleCopilotChatRequest,
  jsonResponse,
} from "../../server/handle-copilot-chat";

interface Env {
  OXLO_API_KEY: string;
}

type PagesContext = {
  request: Request;
  env: Env;
};

export async function onRequestPost(context: PagesContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const result = await handleCopilotChatRequest(body, context.env.OXLO_API_KEY);
    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Copilot chat failed";
    const status = message.includes("Missing required") ? 400 : 500;
    return errorResponse(message, status);
  }
}
