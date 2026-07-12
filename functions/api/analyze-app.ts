import {
  errorResponse,
  handleAnalyzeAppRequest,
  jsonResponse,
} from "../../server/handle-analyze-app";

interface Env {
  GROQ_API_KEY: string;
}

type PagesContext = {
  request: Request;
  env: Env;
};

export async function onRequestPost(context: PagesContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const result = await handleAnalyzeAppRequest(body, context.env.GROQ_API_KEY);
    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    const status = message.includes("Missing required") ? 400 : 500;
    return errorResponse(message, status);
  }
}
