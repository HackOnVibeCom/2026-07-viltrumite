import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import type { IncomingMessage } from "node:http";

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function analyzeAppApiPlugin(apiKey: string): Plugin {
  return {
    name: "analyze-app-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const isAnalyze = req.url === "/api/analyze-app";
        const isGeneratePact = req.url === "/api/generate-pact";

        if (!isAnalyze && !isGeneratePact) {
          next();
          return;
        }

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        try {
          const rawBody = await readRequestBody(req);
          const body = rawBody ? JSON.parse(rawBody) : {};
          
          let result;
          if (isAnalyze) {
            const { handleAnalyzeAppRequest } = await import("./server/handle-analyze-app");
            result = await handleAnalyzeAppRequest(body, apiKey);
          } else if (isGeneratePact) {
            const { handleGeneratePactRequest } = await import("./server/handle-generate-pact");
            result = await handleGeneratePactRequest(body, apiKey);
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Request failed";
          const status = message.includes("Missing required") ? 400 : 500;
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.OXLO_API_KEY ?? process.env.OXLO_API_KEY ?? "";

  return {
    plugins: [
      TanStackRouterVite(),
      react(),
      tailwindcss(),
      tsconfigPaths(),
      analyzeAppApiPlugin(apiKey),
    ],
  };
});
