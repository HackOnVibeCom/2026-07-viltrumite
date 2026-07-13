/**
 * ⚠️ HACKATHON / DEMO ONLY ⚠️
 * This module calls the Slack Web API directly from the browser using an
 * OAuth access token stored in a Vite environment variable
 * (VITE_SLACK_ACCESS_TOKEN). The token is embedded in the client bundle and
 * is therefore **visible to anyone** who inspects the page source or network
 * traffic.
 *
 * Before shipping to production, move all Slack API calls to a secure backend
 * or serverless function so the access token is never exposed to the client.
 *
 * Required Slack Bot Token Scopes: `chat:write`, `channels:read`
 */

import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SLACK_POST_MESSAGE_URL = "/slack-api/chat.postMessage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Slack API `chat.postMessage` response shape. */
export type SlackPostMessageResponse = {
  ok: boolean;
  channel?: string;
  ts?: string;
  message?: {
    text: string;
    ts: string;
  };
  error?: string;
};

/** Options for `sendSlackMessage`. */
export type SlackMessageOptions = {
  /** If true, suppress toast notifications. */
  silent?: boolean;
};

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

/** Structured error for Slack API failures. */
export class SlackError extends Error {
  constructor(
    message: string,
    public readonly slackErrorCode?: string,
  ) {
    super(message);
    this.name = "SlackError";
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Send a message to a Slack channel securely via the server-side API.
 *
 * @param channelId  The Slack channel ID (e.g. `C0123456789`) or name (e.g. `general`).
 * @param text       The message text to send.
 * @param options    Optional settings.
 * @returns          The parsed Slack API response.
 * @throws           `SlackError` on authentication or API failures.
 *
 * @example
 * ```ts
 * await sendSlackMessage("C0123456789", "🚀 New partnership request!");
 * ```
 */
export async function sendSlackMessage(
  channelId: string,
  text: string,
  options: SlackMessageOptions = {},
): Promise<SlackPostMessageResponse> {
  const { silent = false } = options;

  try {
    const response = await fetch("/api/slack-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        channel: channelId,
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorMsg = `Slack HTTP error (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorMsg = errorJson.error;
        }
      } catch {}
      
      const error = new SlackError(errorMsg);
      if (!silent) {
        toast.error("Slack request failed", {
          description: error.message.slice(0, 120),
        });
      }
      throw error;
    }

    const data = await response.json();
    if (!data.ok) {
      const error = new SlackError(data.error || "Slack request failed", data.error);
      if (!silent) {
        toast.error("Slack request failed", {
          description: error.message.slice(0, 120),
        });
      }
      throw error;
    }

    if (!silent) {
      toast.success("Partnership request sent to Slack", {
        description: `Message posted to channel ${data.channel || channelId}`,
      });
    }

    return data;
  } catch (err) {
    if (err instanceof SlackError) throw err;
    const message = err instanceof Error ? err.message : "Slack request failed";
    if (!silent) {
      toast.error("Slack request failed", {
        description: message.slice(0, 120),
      });
    }
    throw new SlackError(message);
  }
}
