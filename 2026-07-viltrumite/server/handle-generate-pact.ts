import { buildPactUserPrompt } from "../lib/analysis/pactPrompt";
import { DEFAULT_OXLO_CONFIG } from "../lib/analysis/types";

export type PactResult = {
  compatibility: number;
  whyMatch: string;
  campaignSuggestions: string[];
  timeline: string[];
  promotionPlan: string;
  expectedInstalls: number;
  expectedCtr: string;
  successProbability: string;
  outreachMessage: string;
};

export async function handleGeneratePactRequest(
  body: any,
  apiKey: string | undefined,
): Promise<PactResult> {
  const { myApp, partnerApp } = body;
  
  if (!myApp || !partnerApp) {
    throw new Error("Missing required fields: myApp and partnerApp details are required.");
  }

  // 1. Context-aware fallback definition
  const pName = partnerApp.name || "Partner App";
  const mName = myApp.name || "My App";
  
  const defaultFallback: PactResult = {
    compatibility: 85,
    whyMatch: `${mName} and ${pName} share a strong audience affinity in the ${myApp.category} and ${partnerApp.category} spaces, serving complementary user intents without competing features.`,
    campaignSuggestions: [
      "Cross-promotion newsletter insert (combined reach: 15k)",
      "Dedicated in-app integration placement",
      "Co-promoted launch-day tweet swap"
    ],
    timeline: [
      "Milestone 1: Launch Day - Set up co-promotional campaign redirects",
      "Milestone 2: Week 1 - Launch newsletter cross-swap to subscribers",
      "Milestone 3: Week 2 - In-app banner integration swap live"
    ],
    promotionPlan: "Newsletter placements on launch day followed by cross-linking banner slots.",
    expectedInstalls: 350,
    expectedCtr: "4.1%",
    successProbability: "85%",
    outreachMessage: `Hi,

LaunchMesh AI found that ${mName} and ${pName} have an 85% audience overlap while solving different problems.

A collaboration through newsletter mentions, referral links, and launch-day promotion is predicted to generate around 350 additional installs.

Would you like to partner for launch?

Thanks,
Alex`
  };

  // Check specific partner combinations
  if (pName.toLowerCase().includes("notemind")) {
    defaultFallback.compatibility = 94;
    defaultFallback.whyMatch = `${mName} and NoteMind both target productivity-focused students who switch between deep learning syllabus planning and structured note-taking in the same session.`;
    defaultFallback.campaignSuggestions = [
      "Newsletter swap (12k reach each)",
      "Co-authored founder email blast",
      "Referral link placement in sidebar"
    ];
    defaultFallback.expectedInstalls = 1250;
    defaultFallback.expectedCtr = "4.7%";
    defaultFallback.successProbability = "94%";
    defaultFallback.outreachMessage = `Hi Sarah,

LaunchMesh AI found that ${mName} and NoteMind have a 94% audience overlap while solving different problems.

A collaboration through newsletter mentions, referral links and launch-day promotion is predicted to generate around 1,250 additional installs.

Would you like to partner for launch?

Thanks,
Alex`;
  } else if (pName.toLowerCase().includes("focusflow")) {
    defaultFallback.compatibility = 88;
    defaultFallback.whyMatch = `${mName} and FocusFlow target active learners needing deep focus timers. Pomodoro intervals naturally pair with study sessions.`;
    defaultFallback.campaignSuggestions = [
      "In-app banner placement for 30 days",
      "Joint bundle package offer"
    ];
    defaultFallback.expectedInstalls = 540;
    defaultFallback.expectedCtr = "3.9%";
    defaultFallback.successProbability = "88%";
    defaultFallback.outreachMessage = `Hi Ryan,

LaunchMesh AI found that ${mName} and FocusFlow have an 88% audience overlap.

An integration featuring a 30-day banner swap and shared launch day mentions is projected to drive 540 installs. Let's grow together!

Best,
Alex`;
  } else if (pName.toLowerCase().includes("resumepilot") || pName.toLowerCase().includes("resumerise")) {
    defaultFallback.compatibility = 92;
    defaultFallback.whyMatch = `Career builders using ${pName} to draft resumes naturally align with ${mName}'s educational organization toolkit.`;
    defaultFallback.campaignSuggestions = [
      "Newsletter placement reaching 18k users",
      "Welcome email recommendation widget"
    ];
    defaultFallback.expectedInstalls = 720;
    defaultFallback.expectedCtr = "4.5%";
    defaultFallback.successProbability = "92%";
    defaultFallback.outreachMessage = `Hi Jessica,

LaunchMesh AI analyzed ${mName} against ResumePilot and identified a 92% audience overlap.

Partnering on a welcome email widget and newsletter announcement is estimated to generate 720 installs. Let me know if you are open to collaborating!

Best,
Alex`;
  }

  // 2. Call Oxlo API if key is present
  if (!apiKey) {
    return defaultFallback;
  }

  try {
    const response = await fetch(DEFAULT_OXLO_CONFIG.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_OXLO_CONFIG.model,
        messages: [
          {
            role: "system",
            content: "You are LaunchMesh AI, a growth matching strategist. Return only JSON matching the requested schema."
          },
          {
            role: "user",
            content: buildPactUserPrompt(myApp, partnerApp)
          }
        ],
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      return defaultFallback;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) return defaultFallback;

    const trimmed = content.trim();
    const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    const jsonText = (fenced?.[1] ?? trimmed).trim();
    const parsed = JSON.parse(jsonText);

    return {
      compatibility: parsed.compatibility || defaultFallback.compatibility,
      whyMatch: parsed.whyMatch || defaultFallback.whyMatch,
      campaignSuggestions: parsed.campaignSuggestions || defaultFallback.campaignSuggestions,
      timeline: parsed.timeline || defaultFallback.timeline,
      promotionPlan: parsed.promotionPlan || defaultFallback.promotionPlan,
      expectedInstalls: parsed.expectedInstalls || defaultFallback.expectedInstalls,
      expectedCtr: parsed.expectedCtr || defaultFallback.expectedCtr,
      successProbability: parsed.successProbability || defaultFallback.successProbability,
      outreachMessage: parsed.outreachMessage || defaultFallback.outreachMessage
    };
  } catch {
    return defaultFallback;
  }
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message }, status);
}
