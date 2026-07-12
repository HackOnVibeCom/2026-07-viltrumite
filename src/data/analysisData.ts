// ─── AI Analysis Results ────────────────────────────────────────────────────
// Types are shared with the backend transform layer in lib/analysis/transform.ts

import type {
  PartnerMatch,
  AnalysisResult,
} from "../../lib/analysis/transform";

export type { PartnerMatch, AnalysisResult };

export const MOCK_ANALYSIS: AnalysisResult = {
  appName: "DesignVault",
  appIcon: "🎨",
  growthScore: 87,
  aiConfidence: 94,
  expectedInstalls: "+2,400",
  bestLaunchDay: "Friday",
  recommendedBundle: "Back to School 2026",
  topPartners: [
    {
      id: "studyflow",
      icon: "📚",
      name: "StudyFlow",
      match: 96,
      overlap: "92%",
      installs: "+720",
      trustScore: "A+",
      reason: "Both target engineering students — peak usage overlaps at 9–11pm study sessions. Newsletter swap could reach 24k combined subscribers.",
      gradient: "from-amber-500 to-orange-500",
      tags: ["Newsletter swap", "Bundle", "Joint launch"],
    },
    {
      id: "focusflow",
      icon: "⚡",
      name: "FocusFlow",
      match: 88,
      overlap: "76%",
      installs: "+540",
      trustScore: "A",
      reason: "Designers who care about deep work use both tools in the same session. In-app banner placement is low-friction.",
      gradient: "from-cyan-500 to-teal-500",
      tags: ["In-app banner", "Bundle"],
    },
    {
      id: "mindmap",
      icon: "🧠",
      name: "MindMap AI",
      match: 81,
      overlap: "69%",
      installs: "+410",
      trustScore: "B+",
      reason: "Visual thinkers who use MindMap AI naturally need a design system. Complementary not competing.",
      gradient: "from-violet-500 to-purple-600",
      tags: ["Bundle", "Newsletter"],
    },
    {
      id: "devpulse",
      icon: "🛠️",
      name: "DevPulse",
      match: 74,
      overlap: "61%",
      installs: "+310",
      trustScore: "A",
      reason: "Developers who build apps need design systems. DevPulse users are likely paying customers.",
      gradient: "from-slate-500 to-zinc-600",
      tags: ["Referral", "Blog"],
    },
    {
      id: "notemind",
      icon: "📝",
      name: "NoteMind",
      match: 68,
      overlap: "55%",
      installs: "+240",
      trustScore: "A+",
      reason: "Note-takers who care about visual presentation are ideal buyers for a design system generator.",
      gradient: "from-pink-500 to-rose-500",
      tags: ["Newsletter swap"],
    },
  ],
  audienceInsights: [
    { segment: "Students", pct: 92, color: "#6C5CE7" },
    { segment: "Developers", pct: 84, color: "#00D4B8" },
    { segment: "Founders", pct: 71, color: "#F59E0B" },
    { segment: "Designers", pct: 68, color: "#EC4899" },
    { segment: "Product Managers", pct: 54, color: "#8B5CF6" },
  ],
  launchStrategy: [
    "Launch on a **Friday** — 42% higher visibility on Product Hunt vs. Monday launches.",
    "Run a **newsletter swap** with StudyFlow first (Day 1-3) to build initial momentum before PH.",
    "Submit to Product Hunt at **12:01 AM PST** with a pre-warmed audience of at least 200 supporters.",
    "Activate **3 pacts simultaneously** on launch day — installs compound when multiple audiences see it.",
    "Publish a **founder story** on Indie Hackers 48h before launch. Drive 300–500 pre-signups.",
    "Follow up with a **bundle launch** in the Back to School collection for Week 2 retention boost.",
  ],
  topCommunities: [
    { name: "Product Hunt", size: "2.4M", fit: "98%" },
    { name: "Indie Hackers", size: "420k", fit: "91%" },
    { name: "Designer News", size: "180k", fit: "88%" },
    { name: "r/webdev", size: "1.2M", fit: "74%" },
    { name: "Figma Community", size: "380k", fit: "95%" },
    { name: "Buildspace", size: "90k", fit: "82%" },
  ],
  risks: [
    "3 direct competitors launching in the same week — differentiate messaging clearly.",
    "Design tool market is saturated — lead with the AI generation angle, not 'another Figma library'.",
    "Low newsletter open rates in July — consider delaying newsletter swap to post-launch Week 2.",
  ],
  opportunities: [
    "Figma's API changes are frustrating devs — position DesignVault as the stable alternative.",
    "Back to School season creates a natural bundle moment with 3 matched apps.",
    "AI-generated design systems are trending — capitalize on the narrative now.",
    "No competitor has a strong Product Hunt presence this week — clear lane.",
  ],
};

// ─── Step descriptions for the analysis modal ────────────────────────────────
export const ANALYSIS_STEPS = [
  {
    id: "profile",
    title: "Reading app profile...",
    checks: ["Description", "Category", "Audience", "Launch Date"],
    duration: 1200,
  },
  {
    id: "apps",
    title: "Finding complementary apps...",
    checks: [],
    duration: 1600,
  },
  {
    id: "overlap",
    title: "Analyzing audience overlap...",
    checks: [],
    duration: 1400,
  },
  {
    id: "strategy",
    title: "Generating launch strategy...",
    checks: [],
    duration: 1800,
  },
];
