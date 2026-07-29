import { getProviders } from "./registry";
import type { CompareResult, NormalizedProduct, SearchOptions } from "./types";

/**
 * The comparison engine. It only consumes normalized data returned by providers,
 * so adding suppliers never requires touching this file. Providers are queried
 * in parallel with a per-provider timeout; failures degrade gracefully.
 */
export async function compare(
  options: SearchOptions & { timeoutMs?: number }
): Promise<CompareResult> {
  const query = options.query.trim();
  const timeoutMs = options.timeoutMs ?? 6000;
  const providers = getProviders();

  const results = await Promise.all(
    providers.map(async (provider) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await provider.search({
          query,
          limit: options.limit ?? 12,
          signal: controller.signal,
        });
      } catch (error) {
        return {
          provider: provider.meta,
          products: [],
          ok: false,
          live: false,
          error: error instanceof Error ? error.message : "unknown",
          tookMs: 0,
        };
      } finally {
        clearTimeout(timer);
      }
    })
  );

  const products: NormalizedProduct[] = results
    .flatMap((r) => r.products)
    .sort(sortByPrice);

  const priced = products.filter((p) => typeof p.price === "number");
  const cheapest = priced.length ? priced[0] : null;

  return {
    query,
    retrievedAt: new Date().toISOString(),
    providersQueried: providers.length,
    providersOk: results.filter((r) => r.ok).length,
    totalProducts: products.length,
    cheapest,
    results,
    products,
  };
}

function sortByPrice(a: NormalizedProduct, b: NormalizedProduct): number {
  if (a.price == null && b.price == null) return 0;
  if (a.price == null) return 1;
  if (b.price == null) return -1;
  return a.price - b.price;
}

/** Group normalized products by the reference SKU so the UI can show a per-item comparison. */
export function groupBySku(products: NormalizedProduct[]) {
  const groups = new Map<string, NormalizedProduct[]>();
  for (const p of products) {
    const list = groups.get(p.sku) ?? [];
    list.push(p);
    groups.set(p.sku, list);
  }
  return Array.from(groups.entries())
    .map(([sku, items]) => {
      const sorted = [...items].sort(sortByPrice);
      const cheapest = sorted.find((i) => i.price != null) ?? null;
      const prices = sorted
        .map((i) => i.price)
        .filter((p): p is number => p != null);
      return {
        sku,
        title: sorted[0].title,
        brand: sorted[0].brand,
        image: sorted[0].image,
        category: sorted[0].category,
        packageSize: sorted[0].packageSize,
        unit: sorted[0].unit,
        offers: sorted,
        cheapest,
        min: prices.length ? Math.min(...prices) : null,
        max: prices.length ? Math.max(...prices) : null,
        savings:
          prices.length > 1 ? Math.max(...prices) - Math.min(...prices) : 0,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}
