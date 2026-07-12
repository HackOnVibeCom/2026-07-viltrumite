import { loadCsv } from "@/lib/mock-db/csvLoader";
import {
  CURRENT_FOUNDER_APP_ID,
  PARTNER_GRADIENTS,
} from "@/lib/mock-db/constants";
import {
  buildAppContext,
  getPartnerAppId,
  mapMatchToPartner,
} from "@/lib/mock-db/mappers";
import type { CsvAiMatch, CsvApp } from "@/lib/mock-db/types";
import { getCsvApps } from "./appService";

export async function getMatchesForApp(appId: string = CURRENT_FOUNDER_APP_ID) {
  const [matches, csvApps, founders, categories, screenshots, reviews, analytics] =
    await Promise.all([
      loadCsv<CsvAiMatch>("ai_matches"),
      getCsvApps(),
      loadCsv("founders"),
      loadCsv("categories"),
      loadCsv("screenshots"),
      loadCsv("reviews"),
      loadCsv("analytics"),
    ]);

  const appsById = new Map<string, CsvApp>(csvApps.map((a) => [a.app_id, a]));
  const ctx = buildAppContext(founders, categories, screenshots, reviews, analytics);

  return matches
    .filter((m) => m.app_id_1 === appId || m.app_id_2 === appId)
    .filter((m) => m.status.toLowerCase() === "approved")
    .sort((a, b) => parsePercent(b.match_percentage) - parsePercent(a.match_percentage))
    .slice(0, 8)
    .map((match, i) => {
      const partnerId = getPartnerAppId(match, appId);
      const partnerApp = appsById.get(partnerId);
      if (!partnerApp) return null;
      return mapMatchToPartner(match, partnerApp, ctx, i, PARTNER_GRADIENTS);
    })
    .filter(Boolean) as NonNullable<Awaited<ReturnType<typeof mapMatchToPartner>>>[];
}

function parsePercent(value: string): number {
  return Number.parseFloat(value.replace("%", "")) || 0;
}

export async function getTopMatchForFounder(appId: string = CURRENT_FOUNDER_APP_ID) {
  const matches = await getMatchesForApp(appId);
  return matches[0] ?? null;
}
