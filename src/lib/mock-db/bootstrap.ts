import { preloadTables } from "./csvLoader";

let bootstrapPromise: Promise<void> | null = null;

/** Warm critical tables once at app startup for zero-latency first render. */
export function ensureMockDbReady(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = preloadTables(["apps", "categories", "founders"]).then(() => undefined);
  }
  return bootstrapPromise;
}
