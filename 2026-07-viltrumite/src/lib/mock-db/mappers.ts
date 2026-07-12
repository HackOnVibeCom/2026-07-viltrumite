import type { App } from "@/data/mock";
import type {
  CsvAiMatch,
  CsvAnalytics,
  CsvApp,
  CsvBundle,
  CsvCategory,
  CsvFounder,
  CsvGrowthPact,
  CsvReview,
  CsvScreenshot,
} from "./types";
import {
  CATEGORY_ACCENTS,
  CATEGORY_GRADIENTS,
  CATEGORY_ICONS,
  REFERENCE_DATE,
  formatPricing,
  founderInitials,
  parsePercent,
  platformsFromStack,
  toAppSlug,
  trustFromMatch,
} from "./constants";

type AppContext = {
  founders: Map<string, CsvFounder>;
  categories: Map<string, CsvCategory>;
  screenshots: Map<string, CsvScreenshot[]>;
  reviewCounts: Map<string, number>;
  analytics: Map<string, CsvAnalytics>;
};

export function buildAppContext(
  founders: CsvFounder[],
  categories: CsvCategory[],
  screenshots: CsvScreenshot[] = [],
  reviews: CsvReview[] = [],
  analytics: CsvAnalytics[] = [],
): AppContext {
  const screenshotMap = new Map<string, CsvScreenshot[]>();
  for (const shot of screenshots) {
    const list = screenshotMap.get(shot.app_id) ?? [];
    list.push(shot);
    screenshotMap.set(shot.app_id, list);
  }

  const reviewCounts = new Map<string, number>();
  for (const review of reviews) {
    reviewCounts.set(review.app_id, (reviewCounts.get(review.app_id) ?? 0) + 1);
  }

  return {
    founders: new Map(founders.map((f) => [f.founder_id, f])),
    categories: new Map(categories.map((c) => [c.category_id, c])),
    screenshots: screenshotMap,
    reviewCounts,
    analytics: new Map(analytics.map((a) => [a.app_id, a])),
  };
}

export function mapCsvAppToApp(row: CsvApp, ctx: AppContext): App {
  const founder = ctx.founders.get(row.founder_id);
  const category = ctx.categories.get(row.category_id);
  const categoryName = category?.category_name ?? "Productivity";
  const launchDate = row.launch_date;
  const launch = new Date(launchDate);
  const growthScore = Number.parseInt(row.growth_score, 10) || 0;
  const followers = Number.parseInt(row.followers_count, 10) || 0;
  const reviewCount = ctx.reviewCounts.get(row.app_id) ?? 0;
  const shots = ctx.screenshots.get(row.app_id) ?? [];

  let status: App["status"] = "upcoming";
  if (growthScore >= 85) status = "trending";
  else if (launch <= REFERENCE_DATE) status = "live";

  const tagline = row.tagline;
  const shortDesc = row.description.split(".")[0] ?? row.description;

  return {
    id: toAppSlug(row.app_name),
    name: row.app_name,
    tagline,
    description: row.description,
    icon: CATEGORY_ICONS[categoryName] ?? "🚀",
    category: categoryName,
    followers,
    launchDate,
    status,
    founder: {
      name: founder?.name ?? "Founder",
      avatar: founderInitials(founder?.name ?? "F"),
      bio: founder?.bio ?? "",
    },
    platforms: platformsFromStack(row.primary_tech_stack),
    pricing: formatPricing(row.pricing_model),
    gradient: CATEGORY_GRADIENTS[categoryName] ?? "from-violet-600 to-purple-700",
    accent: CATEGORY_ACCENTS[categoryName] ?? "#6C5CE7",
    images: shots.map((s) => s.image_url),
    features: row.primary_tech_stack.split(",").map((s) => s.trim()).slice(0, 5),
    upvotes: Math.max(reviewCount * 42, Math.round(followers * 0.05)),
    problem: `${shortDesc} — but existing tools fall short.`,
    solution: tagline,
  };
}

export function mapMatchToPartner(
  match: CsvAiMatch,
  partnerApp: CsvApp,
  ctx: AppContext,
  index: number,
  gradients: string[],
): {
  icon: string;
  name: string;
  match: number;
  overlap: string;
  installs: string;
  reason: string;
  gradient: string;
  tags: string[];
  trustScore: string;
  followers: number;
} {
  const category = ctx.categories.get(partnerApp.category_id);
  const categoryName = category?.category_name ?? "Productivity";
  const matchPct = parsePercent(match.match_percentage);

  return {
    icon: CATEGORY_ICONS[categoryName] ?? "🚀",
    name: partnerApp.app_name,
    match: matchPct,
    overlap: `${Math.max(55, matchPct - 4)}%`,
    installs: `+${Math.round(matchPct * 8)}`,
    reason: match.reasoning,
    gradient: gradients[index % gradients.length],
    tags: [match.status, "Cross-promo"],
    trustScore: trustFromMatch(matchPct),
    followers: Number.parseInt(partnerApp.followers_count, 10) || 0,
  };
}

export function mapBundleApps(
  bundle: CsvBundle,
  appsById: Map<string, CsvApp>,
  ctx: AppContext,
): Array<{ icon: string; name: string }> {
  const ids = bundle.app_ids.replace(/"/g, "").split(",").map((s) => s.trim());
  return ids.map((id) => {
    const app = appsById.get(id);
    if (!app) return { icon: "🚀", name: id };
    const category = ctx.categories.get(app.category_id);
    return {
      icon: CATEGORY_ICONS[category?.category_name ?? ""] ?? "🚀",
      name: app.app_name,
    };
  });
}

export function mapPactToUi(
  pact: CsvGrowthPact,
  match: CsvAiMatch,
  partnerApp: CsvApp,
  ctx: AppContext,
  gradients: string[],
  index: number,
) {
  const category = ctx.categories.get(partnerApp.category_id);
  const categoryName = category?.category_name ?? "Productivity";

  return {
    partner: partnerApp.app_name,
    icon: CATEGORY_ICONS[categoryName] ?? "🚀",
    status: pact.status.toLowerCase() === "completed"
      ? "active"
      : pact.status.toLowerCase() === "active"
        ? "active"
        : pact.status.toLowerCase() === "proposed"
          ? "pending"
          : "draft",
    type: pact.campaign_type,
    reach: `${Math.round(Number.parseInt(partnerApp.followers_count, 10) * 0.15).toLocaleString()}`,
    installs: `+${pact.shared_conversions}`,
    started: new Date(pact.start_date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    ends: "—",
    gradient: gradients[index % gradients.length],
  };
}

export function getCsvAppIdBySlug(apps: CsvApp[], slug: string): string | undefined {
  return apps.find((a) => toAppSlug(a.app_name) === slug)?.app_id;
}

export function getPartnerAppId(match: CsvAiMatch, currentAppId: string): string {
  return match.app_id_1 === currentAppId ? match.app_id_2 : match.app_id_1;
}
