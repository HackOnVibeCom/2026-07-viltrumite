/** Founder app profile sent from the frontend to the analyze endpoint. */
export type AppProfileInput = {
  appName: string;
  description: string;
  category: string;
  targetAudience: string;
  launchDate: string;
  platform: string;
  pricing: string;
};

/** Raw JSON shape returned by the Oxlo model. */
export type OxloAnalysisResponse = {
  growthScore: number;
  confidence: number;
  topPartners: Array<{
    name: string;
    match: number;
    reason: string;
    expectedInstalls: number;
    audienceOverlap: string;
  }>;
  launchStrategy: string[];
  bestLaunchDay: string;
  projectedUsers: number;
  recommendedBundle: string[];
  communities: string[];
  risks: string[];
  opportunities: string[];
};

export type OxloConfig = {
  apiUrl: string;
  model: string;
  maxTokens: number;
  systemPrompt: string;
};

export const DEFAULT_OXLO_CONFIG: OxloConfig = {
  apiUrl: "https://api.oxlo.ai/v1/chat/completions",
  model: "deepseek-v4-pro",
  maxTokens: 1200,
  systemPrompt:
    "You are LaunchMesh AI, an expert startup growth strategist specializing in mobile app launches, audience matching, cross-promotions, and growth partnerships.",
};
