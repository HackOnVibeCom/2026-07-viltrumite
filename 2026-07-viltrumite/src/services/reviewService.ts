import { loadCsv } from "@/lib/mock-db/csvLoader";
import { CURRENT_FOUNDER_APP_ID } from "@/lib/mock-db/constants";
import { getTopMatchForFounder } from "./matchService";
import { getAppByCsvId } from "./appService";

export async function getFounderRecommendations(appId: string = CURRENT_FOUNDER_APP_ID) {
  const [topMatch, app, bundles] = await Promise.all([
    getTopMatchForFounder(appId),
    getAppByCsvId(appId),
    import("./bundleService").then((m) => m.getBundles()),
  ]);

  const recs: Array<{ icon: string; text: string }> = [];

  if (topMatch) {
    recs.push({
      icon: "🤝",
      text: `Accept ${topMatch.name} pact — ${topMatch.match}% audience match`,
    });
  }

  if (app) {
    recs.push({
      icon: "📅",
      text: `Launch on ${new Date(app.launchDate).toLocaleDateString("en", { weekday: "long" })} — strong visibility window`,
    });
  }

  const bundle = bundles.find((b) => b.apps.some((a) => a.name === app?.name));
  if (bundle) {
    recs.push({
      icon: "📦",
      text: `Join ${bundle.name} — ${bundle.discount} bundle discount`,
    });
  }

  recs.push({
    icon: "📧",
    text: "Run newsletter campaign — 12k reach available",
  });

  return recs.slice(0, 4);
}

export async function getReviewsForApp(appId: string) {
  const reviews = await loadCsv("reviews");
  return reviews.filter((r) => r.app_id === appId);
}

export async function getUsers() {
  return loadCsv("users");
}
