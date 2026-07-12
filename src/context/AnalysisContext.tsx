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
import { getAllApps } from "@/services/appService";

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
  const { profile, hasProduct } = useAppProfile();
  
  const [result, setResult] = useState<AnalysisResult | null>(() => {
    const stored = localStorage.getItem("lm_analysis_result");
    return stored ? JSON.parse(stored) : null;
  });
  
  const [status, setStatus] = useState<AnalysisStatus>(() => {
    return localStorage.getItem("lm_analysis_result") ? "success" : "idle";
  });
  
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    if (!profile) {
      setError("No product launched yet.");
      setStatus("error");
      return null;
    }

    setStatus("loading");
    setError(null);

    try {
      // 1. Fetch all candidate apps in the system
      const allApps = await getAllApps();

      // 2. Filter non-competing candidate apps for AI matching
      const candidates = allApps
        .filter((app) => app.category.toLowerCase() !== profile.category.toLowerCase())
        .map((app) => ({
          id: app.id,
          name: app.name,
          tagline: app.tagline,
          description: app.description,
          category: app.category,
          launchDate: app.launchDate,
          platform: app.platforms?.join(", ") || "Web",
          pricing: app.pricing,
        }));

      // 3. Perform analysis
      const input = {
        ...toAppProfileInput(profile),
        candidateApps: candidates,
      };

      const analysis = await analyzeApp(input);
      const enriched = { ...analysis, appIcon: profile.appIcon };
      
      // Save to localStorage
      localStorage.setItem("lm_analysis_result", JSON.stringify(enriched));
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
    setResult(null);
    localStorage.removeItem("lm_analysis_result");
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
