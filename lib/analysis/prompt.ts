import type { AppProfileInput } from "./types";

const JSON_SCHEMA = `{
  "growthScore": number,
  "confidence": number,
  "topPartners":[
    {
      "name":"",
      "match":0,
      "reason":"",
      "expectedInstalls":0,
      "audienceOverlap":""
    }
  ],
  "launchStrategy":[""],
  "bestLaunchDay":"",
  "projectedUsers":0,
  "recommendedBundle":[""],
  "communities":[""],
  "risks":[""],
  "opportunities":[""]
}`;

export function buildAnalysisUserPrompt(profile: AppProfileInput): string {
  return `Analyze this startup and return valid JSON only.

App Name: ${profile.appName}
Description: ${profile.description}
Category: ${profile.category}
Target Audience: ${profile.targetAudience}
Launch Date: ${profile.launchDate}
Platform: ${profile.platform}
Pricing: ${profile.pricing}

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):

${JSON_SCHEMA}`;
}
