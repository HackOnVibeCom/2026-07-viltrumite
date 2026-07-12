import { loadCsv } from "@/lib/mock-db/csvLoader";
import { COLLECTION_GRADIENTS } from "@/lib/mock-db/constants";
import { mapBundleApps } from "@/lib/mock-db/mappers";
import type { CsvApp, CsvBundle, CsvFounder, CsvCategory, CsvScreenshot, CsvReview, CsvAnalytics } from "@/lib/mock-db/types";
import { buildAppContext } from "@/lib/mock-db/mappers";
import { getCsvApps } from "./appService";

export type CollectionItem = {
  id: string;
  label: string;
  icon: string;
  count: number;
  gradient: string;
};

export type BundleItem = {
  id: string;
  name: string;
  apps: Array<{ icon: string; name: string }>;
  discount: string;
  purchases: number;
  createdAt: string;
};

let collectionsCache: CollectionItem[] | null = null;

export async function getCollections(): Promise<CollectionItem[]> {
  if (collectionsCache) return collectionsCache;

  const bundles = await loadCsv<CsvBundle>("bundles");
  collectionsCache = bundles.map((b, i) => ({
    id: b.bundle_id.toLowerCase(),
    label: b.bundle_name.replace(" Ultimate Starter Pack", ""),
    icon: "📦",
    count: b.app_ids.replace(/"/g, "").split(",").length,
    gradient: COLLECTION_GRADIENTS[i % COLLECTION_GRADIENTS.length],
  }));

  return collectionsCache;
}

export async function getBundles(): Promise<BundleItem[]> {
  const [bundles, csvApps, founders, categories, screenshots, reviews, analytics] =
    await Promise.all([
      loadCsv<CsvBundle>("bundles"),
      getCsvApps(),
      loadCsv<CsvFounder>("founders"),
      loadCsv<CsvCategory>("categories"),
      loadCsv<CsvScreenshot>("screenshots"),
      loadCsv<CsvReview>("reviews"),
      loadCsv<CsvAnalytics>("analytics"),
    ]);

  const appsById = new Map(csvApps.map((a) => [a.app_id, a]));
  const ctx = buildAppContext(founders, categories, screenshots, reviews, analytics);

  return bundles.map((b) => ({
    id: b.bundle_id,
    name: b.bundle_name,
    apps: mapBundleApps(b, appsById, ctx),
    discount: b.discount_percentage,
    purchases: Number.parseInt(b.total_purchases, 10) || 0,
    createdAt: b.created_at,
  }));
}
