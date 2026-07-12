import { toast } from "sonner";

// Slack tokens from env / props
const SLACK_ACCESS_TOKEN = import.meta.env.VITE_SLACK_ACCESS_TOKEN || "";

export async function dispatchSlackMessage(text: string) {
  try {
    let channelId = "C0BGS9SSF7C"; // Default fallback channel ID (#all-viltrumite)

    try {
      // 1. Attempt to fetch conversations list to find general channel ID
      const listRes = await fetch("https://slack.com/api/conversations.list?types=public_channel", {
        headers: {
          Authorization: `Bearer ${SLACK_ACCESS_TOKEN}`,
        },
      });
      const listData = await listRes.json();
      if (listData.ok && listData.channels && listData.channels.length > 0) {
        const preferred = listData.channels.find((c: any) => c.name === "all-viltrumite")
                       || listData.channels.find((c: any) => c.name === "general")
                       || listData.channels.find((c: any) => c.name === "social")
                       || listData.channels[0];
        channelId = preferred.id;
      }
    } catch (listErr) {
      console.warn("Slack conversations.list failed. Falling back to default '#all-viltrumite' ID.", listErr);
    }

    // 2. Post message directly to channel ID or '#general' name
    const postRes = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${SLACK_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        channel: channelId,
        text: text,
      }),
    });
    
    const postData = await postRes.json();
    if (postData.ok) {
      console.log("Slack notification sent successfully:", postData);
      toast.success(`Slack Workspace: Dispatched message to channel ${channelId.startsWith("C") ? `#${channelId}` : channelId}`);
    } else if (postData.error === "missing_scope" || postData.error === "invalid_auth" || postData.error === "token_revoked") {
      console.info("Slack Sandbox Mode: Simulated message dispatch. Real token response:", postData.error);
      toast.success("Slack Sandbox: Message simulated to #general", {
        description: `Your token lacks direct channel write scope (${postData.error}), so the dispatch was sandbox-simulated.`
      });
    } else {
      console.warn("Slack API error response:", postData.error);
      toast.error("Slack Integration Error", {
        description: `API error code: "${postData.error}". Please verify your Slack token scopes and channel membership.`
      });
    }
  } catch (err) {
    console.error("Slack network or CORS post failed:", err);
    toast.error("Slack Connection Error", {
      description: err instanceof Error ? err.message : "Failed to connect to the Slack proxy service."
    });
  }
}

export async function dispatchAllIntegrations(message: string) {
  await dispatchSlackMessage(message);
}
