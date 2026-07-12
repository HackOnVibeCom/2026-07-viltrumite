import { loadCsv } from "@/lib/mock-db/csvLoader";
import {
  CURRENT_FOUNDER_APP_ID,
  PARTNER_GRADIENTS,
} from "@/lib/mock-db/constants";
import {
  buildAppContext,
  getPartnerAppId,
  mapPactToUi,
} from "@/lib/mock-db/mappers";
import type { CsvAiMatch, CsvApp, CsvGrowthPact } from "@/lib/mock-db/types";
import { getCsvApps } from "./appService";

export async function getPactsForFounderApp(appId: string = CURRENT_FOUNDER_APP_ID) {
  const [pacts, matches, csvApps, founders, categories, screenshots, reviews, analytics] =
    await Promise.all([
      loadCsv<CsvGrowthPact>("growth_pacts"),
      loadCsv<CsvAiMatch>("ai_matches"),
      getCsvApps(),
      loadCsv("founders"),
      loadCsv("categories"),
      loadCsv("screenshots"),
      loadCsv("reviews"),
      loadCsv("analytics"),
    ]);

  const matchesById = new Map(matches.map((m) => [m.match_id, m]));
  const appsById = new Map<string, CsvApp>(csvApps.map((a) => [a.app_id, a]));
  const ctx = buildAppContext(founders, categories, screenshots, reviews, analytics);

  const relevantMatchIds = new Set(
    matches
      .filter((m) => m.app_id_1 === appId || m.app_id_2 === appId)
      .map((m) => m.match_id),
  );

  return pacts
    .filter((p) => relevantMatchIds.has(p.match_id))
    .slice(0, 6)
    .map((pact, i) => {
      const match = matchesById.get(pact.match_id);
      if (!match) return null;
      const partnerId = getPartnerAppId(match, appId);
      const partnerApp = appsById.get(partnerId);
      if (!partnerApp) return null;
      return mapPactToUi(pact, match, partnerApp, ctx, PARTNER_GRADIENTS, i);
    })
    .filter(Boolean) as NonNullable<
    ReturnType<typeof mapPactToUi>
  >[];
}

export async function getActivePactCount(appId: string = CURRENT_FOUNDER_APP_ID): Promise<number> {
  const pacts = await getPactsForFounderApp(appId);
  return pacts.filter((p) => p.status === "active").length;
}
