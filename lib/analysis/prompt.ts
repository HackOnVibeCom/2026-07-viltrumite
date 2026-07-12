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
  const candidateList = profile.candidateApps
    ? profile.candidateApps.map((a) => `- ${a.name}: ${a.tagline} (Category: ${a.category}, Launched/Launch Date: ${a.launchDate}, Platforms: ${a.platform}, Pricing: ${a.pricing})`).join("\n")
    : "[]";

  return `You are LaunchMesh AI, a growth matching strategist.
Analyze the user's new app and select exactly 5 growth partners from the Candidate Apps list below.

User's New App:
- App Name: ${profile.appName}
- Description: ${profile.description}
- Category: ${profile.category}
- Target Audience: ${profile.targetAudience}
- Launch Date: ${profile.launchDate}
- Platform: ${profile.platform}
- Pricing: ${profile.pricing}

Candidate Apps List (select from these only):
${candidateList}

AI RECOMMENDATION RULES:
1. DO NOT recommend competing apps.
2. The recommended app must target the SAME or overlapping audience (e.g. students, developers, founders, designers).
3. The recommended app must have a similar launch window:
   - Already launched recently (e.g. within past 90 days of user's launch date) OR
   - Launching soon (e.g. within next 30 days of user's launch date)
4. Select apps with high audience overlap and complementary value (e.g. StudyPal matches with FocusFlow or ResumePilot).
5. For each match, generate:
   - match: compatibility percentage (60 to 98)
   - reason: brief explanation of why they match and how they can cross-promote
   - expectedInstalls: predicted downloads generated from the partnership (e.g. 200 to 1500)
   - audienceOverlap: percentage overlap (e.g. "85%")

Return ONLY valid JSON matching this exact schema (no markdown, no backticks, no explanation):
${JSON_SCHEMA}`;
}
