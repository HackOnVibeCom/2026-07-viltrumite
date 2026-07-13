import { handleSlackPostRequest } from "../../server/handle-slack-post";

interface Env {
  SLACK_BOT_TOKEN?: string;
  SLACK_ACCESS_TOKEN?: string;
}

type PagesContext = {
  request: Request;
  env: Env;
};

export async function onRequestPost(context: PagesContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const slackToken = context.env?.SLACK_BOT_TOKEN || context.env?.SLACK_ACCESS_TOKEN || "";
    const result = await handleSlackPostRequest(body, slackToken);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Slack post failed";
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
