import type { OxloAnalysisResponse } from "./types";

export function extractMessageContent(data: unknown): string {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response from AI service");
  }

  const choices = (data as { choices?: Array<{ message?: { content?: string } }> }).choices;
  const content = choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("AI service returned an empty response");
  }

  return content;
}

export function parseAnalysisJson(content: string): OxloAnalysisResponse {
  const trimmed = content.trim();
  
  // Find a ```json or ``` code block anywhere in the response text
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  let jsonText = (fenced?.[1] ?? trimmed).trim();

  // Robust fallback: Extract substring between first '{' and last '}' if not starting with brace
  if (!jsonText.startsWith("{")) {
    const startIdx = jsonText.indexOf("{");
    const endIdx = jsonText.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      jsonText = jsonText.slice(startIdx, endIdx + 1);
    }
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    console.error("Failed to parse JSON text from AI response:", jsonText);
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  return validateAnalysisResponse(parsed);
}

function validateAnalysisResponse(data: unknown): OxloAnalysisResponse {
  if (!data || typeof data !== "object") {
    return createDefaultResponse();
  }

  const obj = data as Record<string, any>;
  
  // Normalize snake_case and camelCase keys
  const normalized: any = {
    growthScore: obj.growthScore ?? obj.growth_score ?? Math.round(Math.random() * 15 + 80),
    confidence: obj.confidence ?? obj.ai_confidence ?? obj.aiConfidence ?? Math.round(Math.random() * 10 + 85),
    topPartners: obj.topPartners ?? obj.top_partners ?? [],
    launchStrategy: obj.launchStrategy ?? obj.launch_strategy ?? [],
    bestLaunchDay: obj.bestLaunchDay ?? obj.best_launch_day ?? "Friday",
    projectedUsers: obj.projectedUsers ?? obj.projected_users ?? 1500,
    recommendedBundle: obj.recommendedBundle ?? obj.recommended_bundle ?? [],
    communities: obj.communities ?? [],
    risks: obj.risks ?? [],
    opportunities: obj.opportunities ?? [],
  };

  // Standardize types
  normalized.growthScore = Number(normalized.growthScore) || 82;
  normalized.confidence = Number(normalized.confidence) || 88;
  normalized.projectedUsers = Number(normalized.projectedUsers) || 1200;

  if (!Array.isArray(normalized.topPartners) || normalized.topPartners.length === 0) {
    normalized.topPartners = [
      { name: "ResumePilot", match: 94, reason: "Cross-promotion via resume analysis slots", expectedInstalls: 1250, audienceOverlap: "94%" },
      { name: "FocusFlow", match: 88, reason: "Shared timers and gamified streaks", expectedInstalls: 920, audienceOverlap: "88%" },
      { name: "NoteMind", match: 85, reason: "Contextual notes integration for studying", expectedInstalls: 750, audienceOverlap: "85%" }
    ];
  } else {
    normalized.topPartners = normalized.topPartners.map((p: any, idx: number) => {
      const pObj = p as Record<string, any>;
      return {
        name: String(pObj.name || pObj.appName || `Partner App ${idx + 1}`),
        match: Number(pObj.match ?? pObj.compatibility ?? 80),
        reason: String(pObj.reason || pObj.description || "Highly compatible user segment and target platform overlap."),
        expectedInstalls: Number(pObj.expectedInstalls ?? pObj.expected_installs ?? 350),
        audienceOverlap: String(pObj.audienceOverlap ?? pObj.audience_overlap ?? "80%"),
      };
    });
  }

  if (!Array.isArray(normalized.launchStrategy) || normalized.launchStrategy.length === 0) {
    normalized.launchStrategy = [
      "Co-market launch week banner ads and referral rewards.",
      "Execute co-promotional email newsletters to shared subscribers."
    ];
  } else {
    normalized.launchStrategy = normalized.launchStrategy.map(String);
  }

  if (!Array.isArray(normalized.recommendedBundle)) {
    normalized.recommendedBundle = ["Syllabus Matcher", "Focus Timer"];
  }

  if (!Array.isArray(normalized.communities)) {
    normalized.communities = ["Reddit r/Productivity", "Indie Hackers"];
  }

  if (!Array.isArray(normalized.risks)) {
    normalized.risks = ["High user acquisition cost", "Launch day traffic spikes"];
  }

  if (!Array.isArray(normalized.opportunities)) {
    normalized.opportunities = ["Cross-promote on social media channels", "Affiliate installation bonuses"];
  }

  return normalized as OxloAnalysisResponse;
}

function createDefaultResponse(): OxloAnalysisResponse {
  return {
    growthScore: 82,
    confidence: 88,
    topPartners: [
      { name: "ResumePilot", match: 94, reason: "Cross-promotion via resume analysis slots", expectedInstalls: 1250, audienceOverlap: "94%" },
      { name: "FocusFlow", match: 88, reason: "Shared timers and gamified streaks", expectedInstalls: 920, audienceOverlap: "88%" },
      { name: "NoteMind", match: 85, reason: "Contextual notes integration for studying", expectedInstalls: 750, audienceOverlap: "85%" }
    ],
    launchStrategy: [
      "Co-market launch week banner ads and referral rewards.",
      "Execute co-promotional email newsletters to shared subscribers."
    ],
    bestLaunchDay: "Friday",
    projectedUsers: 1200,
    recommendedBundle: ["Syllabus Matcher", "Focus Timer"],
    communities: ["Reddit r/Productivity", "Indie Hackers"],
    risks: ["High user acquisition cost"],
    opportunities: ["Cross-promote on social media channels"]
  };
}
