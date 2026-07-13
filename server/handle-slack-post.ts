export async function handleSlackPostRequest(
  body: unknown,
  token: string | undefined
) {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  const { channel, text } = body as Record<string, unknown>;

  if (typeof channel !== "string" || !channel.trim()) {
    throw new Error("Missing required field: channel");
  }

  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Missing required field: text");
  }

  if (!token || typeof token !== "string" || !token.trim()) {
    throw new Error("Slack token is not configured on the server");
  }

  const cleanToken = token.trim();
  let resolvedChannelId = channel.trim();

  // If it's a name (doesn't start with 'C', 'G', 'U', or 'D' followed by 8-11 alpha-numeric chars)
  if (!/^[CGUD][A-Z0-9]{8,11}$/.test(resolvedChannelId)) {
    try {
      const listResponse = await fetch("https://slack.com/api/conversations.list?types=public_channel", {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });
      const listData = (await listResponse.json()) as any;
      if (listData.ok && listData.channels) {
        const found = listData.channels.find(
          (c: any) => c.name === resolvedChannelId || c.name === resolvedChannelId.replace(/^#/, "")
        );
        if (found) {
          resolvedChannelId = found.id;
        } else {
          // Fall back to preferred channel names or the first available channel in list
          const fallback = listData.channels.find((c: any) => c.name === "all-viltrumite")
                        || listData.channels.find((c: any) => c.name === "general")
                        || listData.channels.find((c: any) => c.name === "social")
                        || listData.channels[0];
          if (fallback) {
            resolvedChannelId = fallback.id;
          }
        }
      }
    } catch (err) {
      console.warn("Failed to resolve Slack channel name server-side:", err);
    }
  }

  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${cleanToken}`,
    },
    body: JSON.stringify({
      channel: resolvedChannelId,
      text: text.trim(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Slack API HTTP error (${response.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await response.json()) as any;
  if (!data.ok) {
    throw new Error(data.error || "Slack API returned an error");
  }

  return {
    ok: true,
    channel: data.channel || resolvedChannelId,
    ts: data.ts,
    message: data.message,
  };
}
