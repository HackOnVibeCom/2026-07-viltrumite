import { sendSlackMessage } from "@/lib/slack";

export async function dispatchSlackMessage(text: string) {
  try {
    const channelId = "C0BGS9SSF7C"; // Default fallback channel ID (#all-viltrumite)
    
    // Call the central Slack utility which handles secure server-side dispatching.
    const data = await sendSlackMessage(channelId, text);
    console.log("Slack notification sent successfully:", data);
  } catch (err) {
    console.error("Slack post failed:", err);
  }
}

export async function dispatchAllIntegrations(message: string) {
  await dispatchSlackMessage(message);
}
