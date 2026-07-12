import {
  errorResponse,
  handleGeneratePactRequest,
  jsonResponse,
} from "../../server/handle-generate-pact";

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
    const result = await handleGeneratePactRequest(body, context.env.OXLO_API_KEY);
    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pact generation failed";
    const status = message.includes("Missing required") ? 400 : 500;
    return errorResponse(message, status);
  }
}
