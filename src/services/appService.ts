import type { App } from "@/data/mock";
import { loadCsv } from "@/lib/mock-db/csvLoader";
import { buildAppContext, getCsvAppIdBySlug, mapCsvAppToApp } from "@/lib/mock-db/mappers";
import type { CsvApp, CsvFounder, CsvCategory } from "@/lib/mock-db/types";

let appsCache: App[] | null = null;
let csvAppsCache: CsvApp[] | null = null;
let contextPromise: ReturnType<typeof buildAppContextFromCsv> | null = null;

async function buildAppContextFromCsv() {
  const [apps, founders, categories] = await Promise.all([
    loadCsv<CsvApp>("apps"),
    loadCsv<CsvFounder>("founders"),
    loadCsv<CsvCategory>("categories"),
  ]);
  return {
    csvApps: apps,
    ctx: buildAppContext(founders, categories),
  };
}

async function getContext() {
  if (!contextPromise) contextPromise = buildAppContextFromCsv();
  return contextPromise;
}

export async function getAllApps(): Promise<App[]> {
  if (appsCache) return appsCache;
  const { csvApps, ctx } = await getContext();
  csvAppsCache = csvApps;
  appsCache = csvApps.map((row) => mapCsvAppToApp(row, ctx));
  return appsCache;
}

export async function getCsvApps(): Promise<CsvApp[]> {
  if (csvAppsCache) return csvAppsCache;
  const { csvApps } = await getContext();
  csvAppsCache = csvApps;
  return csvApps;
}

export async function getAppBySlug(slug: string): Promise<App | undefined> {
  const apps = await getAllApps();
  return apps.find((a) => a.id === slug);
}

export async function getAppByCsvId(csvId: string): Promise<App | undefined> {
  const { csvApps, ctx } = await getContext();
  const row = csvApps.find((a) => a.app_id === csvId);
  return row ? mapCsvAppToApp(row, ctx) : undefined;
}

export async function getAppsByCategory(categoryName: string): Promise<App[]> {
  const apps = await getAllApps();
  const normalized = categoryName.toLowerCase().replace(/\s+/g, "");
  return apps.filter((a) => a.category.toLowerCase().replace(/\s+/g, "") === normalized);
}

export async function getRelatedApps(slug: string, limit = 3): Promise<App[]> {
  const app = await getAppBySlug(slug);
  if (!app) return [];
  const apps = await getAllApps();
  return apps.filter((a) => a.id !== app.id && a.category === app.category).slice(0, limit);
}

export async function resolveCsvId(slug: string): Promise<string | undefined> {
  const csvApps = await getCsvApps();
  return getCsvAppIdBySlug(csvApps, slug);
}

export async function getTrendingApps(): Promise<App[]> {
  const apps = await getAllApps();
  return [...apps].sort((a, b) => b.upvotes - a.upvotes);
}

export async function getUpcomingApps(): Promise<App[]> {
  const apps = await getAllApps();
  return apps.filter((a) => a.status === "upcoming");
}

export async function getLiveApps(): Promise<App[]> {
  const apps = await getAllApps();
  return apps.filter((a) => a.status === "live" || a.status === "trending");
}

export async function getFeaturedApp(): Promise<App> {
  const apps = await getAllApps();
  return apps.find((a) => a.id === "colorwave") ?? apps[0];
}
