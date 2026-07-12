import { loadCsv } from "@/lib/mock-db/csvLoader";
import { CURRENT_FOUNDER_APP_ID } from "@/lib/mock-db/constants";
import type { CsvFounder } from "@/lib/mock-db/types";
import { getAppByCsvId } from "./appService";

export async function getFounderByAppId(appId: string = CURRENT_FOUNDER_APP_ID) {
  const [founders, app] = await Promise.all([
    loadCsv<CsvFounder>("founders"),
    getAppByCsvId(appId),
  ]);
  if (!app) return null;
  const csvApps = await import("./appService").then((m) => m.getCsvApps());
  const csvApp = csvApps.find((a) => a.app_id === appId);
  if (!csvApp) return null;
  const founder = founders.find((f) => f.founder_id === csvApp.founder_id);
  return founder ? { ...founder, app } : null;
}

export async function getCurrentFounderApp() {
  return getAppByCsvId(CURRENT_FOUNDER_APP_ID);
}
