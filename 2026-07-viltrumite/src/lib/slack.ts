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

const SLACK_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";

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

function getSlackToken(): string {
  // Never hardcode – always read from Vite env at runtime.
  const token = import.meta.env.VITE_SLACK_ACCESS_TOKEN;
  if (!token || typeof token !== "string" || !token.trim()) {
    throw new SlackError(
      "VITE_SLACK_ACCESS_TOKEN is not set. Add it to your .env file.",
      "missing_token",
    );
  }
  return token.trim();
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Send a message to a Slack channel using `chat.postMessage`.
 *
 * @param channelId  The Slack channel ID (e.g. `C0123456789`).
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

  let token: string;
  try {
    token = getSlackToken();
  } catch (err) {
    if (!silent) {
      toast.error("Slack authentication failed", {
        description: "VITE_SLACK_ACCESS_TOKEN is not configured.",
      });
    }
    throw err;
  }

  try {
    const response = await fetch(SLACK_POST_MESSAGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        channel: channelId,
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      const error = new SlackError(
        `Slack HTTP error (${response.status}): ${errorText.slice(0, 200)}`,
      );
      if (!silent) {
        toast.error("Slack request failed", {
          description: error.message.slice(0, 120),
        });
      }
      throw error;
    }

    const data: SlackPostMessageResponse = await response.json();

    if (!data.ok) {
      const errorCode = data.error || "unknown_error";

      // Provide user-friendly messages for common errors
      const friendlyMessages: Record<string, string> = {
        invalid_auth: "Slack authentication failed. Check your token.",
        token_revoked: "Slack token has been revoked.",
        not_in_channel: "Bot is not in the target channel.",
        channel_not_found: "Slack channel not found.",
        no_text: "Message text is required.",
      };

      const message =
        friendlyMessages[errorCode] ?? `Slack API error: ${errorCode}`;
      const error = new SlackError(message, errorCode);

      if (!silent) {
        const isAuthError = ["invalid_auth", "token_revoked", "account_inactive"].includes(errorCode);
        toast.error(
          isAuthError ? "Slack authentication failed" : "Slack request failed",
          { description: message },
        );
      }

      throw error;
    }

    if (!silent) {
      toast.success("Partnership request sent to Slack", {
        description: `Message posted to channel ${data.channel}`,
      });
    }

    return data;
  } catch (err) {
    // Re-throw SlackError as-is; wrap anything else
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
