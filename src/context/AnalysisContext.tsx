import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { analyzeApp, AnalyzeAppError } from "@/lib/api/analyze-app";
import type { AnalysisResult } from "@/lib/api/analyze-app";
import { toAppProfileInput, useAppProfile } from "@/context/AppProfileContext";

type AnalysisStatus = "idle" | "loading" | "success" | "error";

type AnalysisContextValue = {
  result: AnalysisResult | null;
  status: AnalysisStatus;
  error: string | null;
  analyze: () => Promise<AnalysisResult | null>;
  reset: () => void;
};

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const { profile } = useAppProfile();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const input = toAppProfileInput(profile);
      const analysis = await analyzeApp(input);
      const enriched = { ...analysis, appIcon: profile.appIcon };
      setResult(enriched);
      setStatus("success");
      return enriched;
    } catch (err) {
      const message =
        err instanceof AnalyzeAppError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong during analysis";
      setError(message);
      setStatus("error");
      return null;
    }
  }, [profile]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ result, status, error, analyze, reset }),
    [result, status, error, analyze, reset],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within AnalysisProvider");
  }
  return context;
}

export type { AnalysisResult };
