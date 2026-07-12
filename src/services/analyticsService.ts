import { loadCsv } from "@/lib/mock-db/csvLoader";
import { CURRENT_FOUNDER_APP_ID } from "@/lib/mock-db/constants";
import type { CsvAnalytics } from "@/lib/mock-db/types";
import { getAppByCsvId } from "./appService";

export type AnalyticsSummary = {
  totalFollowers: string;
  profileViews: string;
  weeklyGrowth: string;
  pactInstalls: string;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  churnRate: string;
  conversionRate: string;
  revenueMrr: number;
  weekData: number[];
};

export async function getAnalyticsForApp(
  appId: string = CURRENT_FOUNDER_APP_ID,
): Promise<AnalyticsSummary> {
  const [analyticsRows, app, pactsModule] = await Promise.all([
    loadCsv<CsvAnalytics>("analytics"),
    getAppByCsvId(appId),
    import("./pactService").then((m) => m.getPactsForFounderApp(appId)),
  ]);

  const row = analyticsRows.find((a) => a.app_id === appId);
  const dau = Number.parseInt(row?.daily_active_users ?? "0", 10);
  const mau = Number.parseInt(row?.monthly_active_users ?? "0", 10);
  const mrr = Number.parseInt(row?.revenue_mrr_usd ?? "0", 10);
  const followers = app?.followers ?? 0;

  const pactInstalls = pactsModule.reduce(
    (sum, p) => sum + Number.parseInt(p.installs.replace(/\D/g, ""), 10),
    0,
  );

  const weekData = [
    Math.round(dau * 0.55),
    Math.round(dau * 0.62),
    Math.round(dau * 0.58),
    Math.round(dau * 0.71),
    Math.round(dau * 0.68),
    Math.round(dau * 0.85),
    Math.round(dau * 0.92),
  ];

  return {
    totalFollowers: followers.toLocaleString(),
    profileViews: Math.round(mau * 0.38).toLocaleString(),
    weeklyGrowth: `+${Math.round(dau * 0.07)}`,
    pactInstalls: `+${pactInstalls.toLocaleString()}`,
    dailyActiveUsers: dau,
    monthlyActiveUsers: mau,
    churnRate: row?.churn_rate ?? "—",
    conversionRate: row?.conversion_rate ?? "—",
    revenueMrr: mrr,
    weekData,
  };
}
