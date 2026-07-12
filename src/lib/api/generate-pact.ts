/**
 * ⚠️ HACKATHON / DEMO ONLY ⚠️
 * This module calls the Oxlo AI API directly from the browser.
 * The API key is embedded in the client bundle via VITE_OXLO_API_KEY.
 * Before production, move this logic to a secure backend.
 */

import { oxloChat, extractContent, OxloError } from "@/lib/oxlo";
import { buildPactUserPrompt } from "../../../lib/analysis/pactPrompt";

// ---------------------------------------------------------------------------
// Types (previously in server/handle-generate-pact.ts)
// ---------------------------------------------------------------------------

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

type AppInput = {
  name: string;
  category: string;
  description: string;
  targetAudience: string;
};

// ---------------------------------------------------------------------------
// Context-aware fallback (moved from server/handle-generate-pact.ts)
// ---------------------------------------------------------------------------

function buildFallback(myApp: AppInput, partnerApp: AppInput): PactResult {
  const pName = partnerApp.name || "Partner App";
  const mName = myApp.name || "My App";

  const fallback: PactResult = {
    compatibility: 85,
    whyMatch: `${mName} and ${pName} share a strong audience affinity in the ${myApp.category} and ${partnerApp.category} spaces, serving complementary user intents without competing features.`,
    campaignSuggestions: [
      "Cross-promotion newsletter insert (combined reach: 15k)",
      "Dedicated in-app integration placement",
      "Co-promoted launch-day tweet swap",
    ],
    timeline: [
      "Milestone 1: Launch Day - Set up co-promotional campaign redirects",
      "Milestone 2: Week 1 - Launch newsletter cross-swap to subscribers",
      "Milestone 3: Week 2 - In-app banner integration swap live",
    ],
    promotionPlan:
      "Newsletter placements on launch day followed by cross-linking banner slots.",
    expectedInstalls: 350,
    expectedCtr: "4.1%",
    successProbability: "85%",
    outreachMessage: `Hi,\n\nLaunchMesh AI found that ${mName} and ${pName} have an 85% audience overlap while solving different problems.\n\nA collaboration through newsletter mentions, referral links, and launch-day promotion is predicted to generate around 350 additional installs.\n\nWould you like to partner for launch?\n\nThanks,\nAlex`,
  };

  // Check specific partner combinations for richer fallbacks
  if (pName.toLowerCase().includes("notemind")) {
    fallback.compatibility = 94;
    fallback.whyMatch = `${mName} and NoteMind both target productivity-focused students who switch between deep learning syllabus planning and structured note-taking in the same session.`;
    fallback.campaignSuggestions = [
      "Newsletter swap (12k reach each)",
      "Co-authored founder email blast",
      "Referral link placement in sidebar",
    ];
    fallback.expectedInstalls = 1250;
    fallback.expectedCtr = "4.7%";
    fallback.successProbability = "94%";
    fallback.outreachMessage = `Hi Sarah,\n\nLaunchMesh AI found that ${mName} and NoteMind have a 94% audience overlap while solving different problems.\n\nA collaboration through newsletter mentions, referral links and launch-day promotion is predicted to generate around 1,250 additional installs.\n\nWould you like to partner for launch?\n\nThanks,\nAlex`;
  } else if (pName.toLowerCase().includes("focusflow")) {
    fallback.compatibility = 88;
    fallback.whyMatch = `${mName} and FocusFlow target active learners needing deep focus timers. Pomodoro intervals naturally pair with study sessions.`;
    fallback.campaignSuggestions = [
      "In-app banner placement for 30 days",
      "Joint bundle package offer",
    ];
    fallback.expectedInstalls = 540;
    fallback.expectedCtr = "3.9%";
    fallback.successProbability = "88%";
    fallback.outreachMessage = `Hi Ryan,\n\nLaunchMesh AI found that ${mName} and FocusFlow have an 88% audience overlap.\n\nAn integration featuring a 30-day banner swap and shared launch day mentions is projected to drive 540 installs. Let's grow together!\n\nBest,\nAlex`;
  } else if (
    pName.toLowerCase().includes("resumepilot") ||
    pName.toLowerCase().includes("resumerise")
  ) {
    fallback.compatibility = 92;
    fallback.whyMatch = `Career builders using ${pName} to draft resumes naturally align with ${mName}'s educational organization toolkit.`;
    fallback.campaignSuggestions = [
      "Newsletter placement reaching 18k users",
      "Welcome email recommendation widget",
    ];
    fallback.expectedInstalls = 720;
    fallback.expectedCtr = "4.5%";
    fallback.successProbability = "92%";
    fallback.outreachMessage = `Hi Jessica,\n\nLaunchMesh AI analyzed ${mName} against ResumePilot and identified a 92% audience overlap.\n\nPartnering on a welcome email widget and newsletter announcement is estimated to generate 720 installs. Let me know if you are open to collaborating!\n\nBest,\nAlex`;
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Main export – calls Oxlo directly from the browser
// ---------------------------------------------------------------------------

/**
 * Generate a Growth Pact by calling the Oxlo AI API directly.
 * Falls back to context-aware defaults if the API key is missing or the
 * call fails.
 */
export async function generatePact(
  myApp: AppInput,
  partnerApp: AppInput,
): Promise<PactResult> {
  if (!myApp || !partnerApp) {
    throw new Error(
      "Missing required fields: myApp and partnerApp details are required.",
    );
  }

  const defaultFallback = buildFallback(myApp, partnerApp);

  try {
    const response = await fetch("/api/generate-pact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ myApp, partnerApp }),
    });

    if (!response.ok) {
      return defaultFallback;
    }

    const data = await response.json();
    return data;
  } catch {
    // On any failure, fall back to context-aware defaults
    return defaultFallback;
  }
}
