import { handleLaunchKitRequest } from "../../server/handle-launch-kit";

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
    const result = await handleLaunchKitRequest(body, context.env.GROQ_API_KEY);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    const status = message.includes("Missing required") ? 400 : 500;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
