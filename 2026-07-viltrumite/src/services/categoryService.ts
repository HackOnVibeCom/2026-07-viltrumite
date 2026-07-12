import { loadCsv } from "@/lib/mock-db/csvLoader";
import { CATEGORY_ICONS } from "@/lib/mock-db/constants";
import type { CsvCategory } from "@/lib/mock-db/types";
import { getAllApps } from "./appService";

export type CategoryItem = {
  id: string;
  label: string;
  icon: string;
  count: number;
};

let categoriesCache: CategoryItem[] | null = null;

export async function getCategories(): Promise<CategoryItem[]> {
  if (categoriesCache) return categoriesCache;

  const [csvCategories, apps] = await Promise.all([
    loadCsv<CsvCategory>("categories"),
    getAllApps(),
  ]);

  categoriesCache = csvCategories.map((cat) => ({
    id: cat.category_name.toLowerCase().replace(/\s+/g, ""),
    label: cat.category_name,
    icon: CATEGORY_ICONS[cat.category_name] ?? "📦",
    count: apps.filter((a) => a.category === cat.category_name).length,
  }));

  return categoriesCache;
}
