import Papa from "papaparse";
import type { MockDbTable } from "./types";

const cache = new Map<string, unknown[]>();
const inflight = new Map<string, Promise<unknown[]>>();

export async function loadCsv<T extends Record<string, string>>(
  table: MockDbTable,
): Promise<T[]> {
  const key = table;
  const cached = cache.get(key);
  if (cached) return cached as T[];

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T[]>;

  const promise = fetch(`/mock-db/${table}.csv`)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${table}.csv`);
      return res.text();
    })
    .then(
      (text) =>
        new Promise<T[]>((resolve, reject) => {
          Papa.parse<T>(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim(),
            complete: (results) => {
              if (results.errors.length > 0) {
                reject(new Error(`CSV parse error in ${table}: ${results.errors[0]?.message}`));
                return;
              }
              const rows = results.data.filter((row) =>
                Object.values(row).some((v) => v?.trim()),
              );
              cache.set(key, rows);
              inflight.delete(key);
              resolve(rows);
            },
            error: (error: Error) => reject(error),
          });
        }),
    )
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });

  inflight.set(key, promise);
  return promise;
}

export function clearCsvCache(): void {
  cache.clear();
  inflight.clear();
}

export async function preloadTables(tables: MockDbTable[]): Promise<void> {
  await Promise.all(tables.map((t) => loadCsv(t)));
}
