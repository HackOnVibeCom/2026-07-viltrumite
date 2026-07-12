import type { AppProfileInput, OxloAnalysisResponse } from "./types";

export type PartnerMatch = {
  id: string;
  icon: string;
  name: string;
  match: number;
  overlap: string;
  installs: string;
  trustScore: string;
  reason: string;
  gradient: string;
  tags: string[];
};

export type AnalysisResult = {
  appName: string;
  appIcon: string;
  growthScore: number;
  aiConfidence: number;
  expectedInstalls: string;
  bestLaunchDay: string;
  recommendedBundle: string;
  topPartners: PartnerMatch[];
  audienceInsights: { segment: string; pct: number; color: string }[];
  launchStrategy: string[];
  topCommunities: { name: string; size: string; fit: string }[];
  risks: string[];
  opportunities: string[];
};

const PARTNER_GRADIENTS = [
  "from-amber-500 to-orange-500",
  "from-cyan-500 to-teal-500",
  "from-violet-500 to-purple-600",
  "from-slate-500 to-zinc-600",
  "from-pink-500 to-rose-500",
];

const PARTNER_ICONS = ["📚", "⚡", "🧠", "🛠️", "📝", "🚀", "💡", "🎯"];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatInstalls(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toLocaleString()}`;
}

function trustFromMatch(match: number): string {
  if (match >= 90) return "A+";
  if (match >= 80) return "A";
  if (match >= 70) return "B+";
  if (match >= 60) return "B";
  return "C";
}

function toPartner(partner: OxloAnalysisResponse["topPartners"][number], index: number): PartnerMatch {
  return {
    id: slugify(partner.name) || `partner-${index}`,
    icon: PARTNER_ICONS[index % PARTNER_ICONS.length],
    name: partner.name,
    match: Math.round(partner.match),
    overlap: partner.audienceOverlap,
    installs: formatInstalls(partner.expectedInstalls),
    trustScore: trustFromMatch(partner.match),
    reason: partner.reason,
    gradient: PARTNER_GRADIENTS[index % PARTNER_GRADIENTS.length],
    tags: ["Partnership", "Cross-promo"],
  };
}

function totalExpectedInstalls(partners: OxloAnalysisResponse["topPartners"]): string {
  const total = partners.reduce((sum, p) => sum + (p.expectedInstalls || 0), 0);
  if (total > 0) return formatInstalls(total);
  return "—";
}

function deriveAudienceInsights(
  profile: AppProfileInput,
  partners: OxloAnalysisResponse["topPartners"],
): AnalysisResult["audienceInsights"] {
  const segments = profile.targetAudience
    .split(/[,;/|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);

  const colors = ["#6C5CE7", "#00D4B8", "#F59E0B", "#EC4899", "#8B5CF6"];

  if (segments.length === 0) {
    return partners.slice(0, 4).map((p, i) => ({
      segment: p.name,
      pct: Math.min(95, Math.round(p.match)),
      color: colors[i % colors.length],
    }));
  }

  return segments.map((segment, i) => ({
    segment,
    pct: Math.max(45, Math.min(95, Math.round(partners[i]?.match ?? 70 - i * 5))),
    color: colors[i % colors.length],
  }));
}

export function transformToAnalysisResult(
  profile: AppProfileInput,
  response: OxloAnalysisResponse,
  appIcon = "🚀",
): AnalysisResult {
  const topPartners = response.topPartners.slice(0, 5).map(toPartner);
  const bundleLabel =
    response.recommendedBundle.length > 0
      ? response.recommendedBundle.join(" + ")
      : "Custom Growth Bundle";

  return {
    appName: profile.appName,
    appIcon,
    growthScore: Math.round(response.growthScore),
    aiConfidence: Math.round(response.confidence),
    expectedInstalls: totalExpectedInstalls(response.topPartners),
    bestLaunchDay: response.bestLaunchDay || "Friday",
    recommendedBundle: bundleLabel,
    topPartners,
    audienceInsights: deriveAudienceInsights(profile, response.topPartners),
    launchStrategy: response.launchStrategy,
    topCommunities: response.communities.map((name, i) => ({
      name,
      size: i === 0 ? `${Math.max(1, Math.round(response.projectedUsers / 1000))}k+` : "—",
      fit: i < 3 ? `${Math.max(70, 98 - i * 4)}%` : "—",
    })),
    risks: response.risks,
    opportunities: response.opportunities,
  };
}
