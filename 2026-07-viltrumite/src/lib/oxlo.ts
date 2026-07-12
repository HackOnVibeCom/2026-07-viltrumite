/**
 * ⚠️ HACKATHON / DEMO ONLY ⚠️
 * This module calls the Oxlo AI API directly from the browser using an API key
 * stored in a Vite environment variable (VITE_OXLO_API_KEY). The key is embedded
 * in the client bundle and is therefore **visible to anyone** who inspects the
 * page source or network traffic.
 *
 * Before shipping to production, move all Oxlo calls to a secure backend or
 * serverless function so the API key is never exposed to the client.
 */

import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const OXLO_API_URL = "https://api.oxlo.ai/v1/chat/completions";
const OXLO_MODEL = "deepseek-v4-pro";
const DEFAULT_MAX_TOKENS = 1200;
const DEFAULT_TEMPERATURE = 0.6;
const REQUEST_TIMEOUT_MS = 30_000; // 30 seconds
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 1_000; // 1 second, doubles on each retry

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single message in the Oxlo chat completion request. */
export type OxloMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/** Options you can pass to `oxloChat`. */
export type OxloChatOptions = {
  /** Override the model (defaults to `deepseek-v4-pro`). */
  model?: string;
  /** Maximum tokens in the response. */
  maxTokens?: number;
  /** Sampling temperature. */
  temperature?: number;
  /** Request timeout in milliseconds. */
  timeoutMs?: number;
  /** Number of retry attempts on transient failures (default 2). */
  retries?: number;
  /** If true, suppress toast notifications (useful for background calls). */
  silent?: boolean;
};

/** The raw Oxlo API response shape. */
export type OxloChatResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

/** Structured error for Oxlo API failures. */
export class OxloError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = "OxloError";
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getApiKey(): string {
  // Never hardcode – always read from Vite env at runtime.
  const key = import.meta.env.VITE_OXLO_API_KEY;
  if (!key || typeof key !== "string" || !key.trim()) {
    throw new OxloError(
      "VITE_OXLO_API_KEY is not set. Add it to your .env file.",
      undefined,
      false,
    );
  }
  return key.trim();
}

function isRetryableStatus(status: number): boolean {
  // 429 = rate limited, 5xx = server error
  return status === 429 || status >= 500;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Send a chat completion request to the Oxlo AI API.
 *
 * @param messages  Array of chat messages (system, user, assistant).
 * @param options   Optional overrides for model, tokens, temperature, etc.
 * @returns         The full `OxloChatResponse` from the API.
 * @throws          `OxloError` on unrecoverable failures.
 *
 * @example
 * ```ts
 * const res = await oxloChat([
 *   { role: "system", content: "You are a helpful assistant." },
 *   { role: "user", content: "What is 2+2?" },
 * ]);
 * console.log(res.choices[0].message.content);
 * ```
 */
export async function oxloChat(
  messages: OxloMessage[],
  options: OxloChatOptions = {},
): Promise<OxloChatResponse> {
  const {
    model = OXLO_MODEL,
    maxTokens = DEFAULT_MAX_TOKENS,
    temperature = DEFAULT_TEMPERATURE,
    timeoutMs = REQUEST_TIMEOUT_MS,
    retries = MAX_RETRIES,
    silent = false,
  } = options;

  const apiKey = getApiKey();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Exponential backoff on retries (skip delay on first attempt)
    if (attempt > 0) {
      const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      await sleep(delay);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log("OXLO KEY:", import.meta.env.VITE_OXLO_API_KEY);
      if (typeof import.meta.env.VITE_OXLO_API_KEY === "undefined" || !import.meta.env.VITE_OXLO_API_KEY) {
        console.log("VITE_OXLO_API_KEY is missing from the deployed environment.");
      }
      console.log("Using Direct Oxlo API");
      console.log(`Request URL: ${OXLO_API_URL}`);

      const response = await fetch(OXLO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        const retryable = isRetryableStatus(response.status);

        if (retryable && attempt < retries) {
          lastError = new OxloError(
            `Oxlo API error (${response.status}): ${errorBody.slice(0, 200)}`,
            response.status,
            true,
          );
          continue; // retry
        }

        throw new OxloError(
          errorBody
            ? `Oxlo API error (${response.status}): ${errorBody.slice(0, 200)}`
            : `Oxlo API error (${response.status})`,
          response.status,
          false,
        );
      }

      const data: OxloChatResponse = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new OxloError("Oxlo returned an empty response", undefined, false);
      }

      return data;
    } catch (err) {
      clearTimeout(timer);

      if (err instanceof OxloError) {
        lastError = err;
        if (!err.retryable) break;
        continue;
      }

      // AbortController timeout
      if (err instanceof DOMException && err.name === "AbortError") {
        lastError = new OxloError(
          `Oxlo request timed out after ${timeoutMs}ms`,
          undefined,
          true,
        );
        if (attempt < retries) continue;
        break;
      }

      // Network error – retryable
      if (err instanceof TypeError) {
        lastError = new OxloError(
          `Network error: ${err.message}`,
          undefined,
          true,
        );
        if (attempt < retries) continue;
        break;
      }

      // Unknown error – don't retry
      lastError = err instanceof Error ? err : new Error(String(err));
      break;
    }
  }

  // All retries exhausted
  const finalError =
    lastError instanceof OxloError
      ? lastError
      : new OxloError(
          lastError?.message ?? "Oxlo request failed",
          undefined,
          false,
        );

  if (!silent) {
    toast.error("Oxlo request failed", {
      description: finalError.message.slice(0, 120),
    });
  }

  throw finalError;
}

// ---------------------------------------------------------------------------
// Convenience: extract the text content from a successful response
// ---------------------------------------------------------------------------

/** Pull the assistant's text out of an OxloChatResponse. */
export function extractContent(response: OxloChatResponse): string {
  return response.choices[0].message.content;
}
