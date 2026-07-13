import {
  errorResponse,
  handleAnalyzeAppRequest,
  jsonResponse,
} from "../../server/handle-analyze-app";

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
    const apiKey = context.env?.OXLO_API_KEY || context.env?.GROQ_API_KEY || "";
    const result = await handleAnalyzeAppRequest(body, apiKey);
    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    const status = message.includes("Missing required") ? 400 : 500;
    return errorResponse(message, status);
  }
}
