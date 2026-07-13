import { handleLaunchKitRequest } from "../../server/handle-launch-kit";

interface Env {
  GROQ_API_KEY: string;
}

type PagesContext = {
  request: Request;
  env: Env;
};

export async function onRequestPost(context: PagesContext): Promise<Response> {
  let body: any;
  try {
    body = await context.request.json();
    const apiKey = context.env?.GROQ_API_KEY || context.env?.OXLO_API_KEY || "";
    const result = await handleLaunchKitRequest(body, apiKey);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Launch kit generation failed, falling back to mock data:", error);
    try {
      if (body) {
        const fallbackResult = await handleLaunchKitRequest(body, "");
        return new Response(JSON.stringify(fallbackResult), {
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (fallbackError) {
      console.error("Launch kit mock fallback failed:", fallbackError);
    }
    
    // Ultimate fallback if body is not parsed or request completely failed
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Generation failed",
      isFallback: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
