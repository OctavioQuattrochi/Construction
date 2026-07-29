import type {
  NormalizedProduct,
  Provider,
  ProviderMeta,
  ProviderSearchResult,
  SearchOptions,
  Availability,
} from "./types";
import { CATALOG, type CatalogItem } from "./catalog";

export interface FallbackTransform {
  /** Multiplier applied to each item's reference price. */
  priceFactor: number;
  availability?: (item: CatalogItem) => Availability;
  urlFor: (item: CatalogItem) => string;
  round?: number; // round prices to nearest N (default 10)
}

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

/**
 * Base class every supplier extends. Provides fetch + normalization helpers and
 * wraps `fetchLive()` with error handling + a fallback catalog so the engine
 * always receives a well-formed ProviderSearchResult.
 */
export abstract class BaseProvider implements Provider {
  abstract meta: ProviderMeta;
  enabled = true;

  /** Attempt to fetch + parse live results. Return null to signal "use fallback". */
  protected async fetchLive(
    _options: SearchOptions
  ): Promise<NormalizedProduct[] | null> {
    return null;
  }

  /** Deterministic fallback so the comparator is always functional (MVP). */
  protected abstract fallback(options: SearchOptions): NormalizedProduct[];

  async search(options: SearchOptions): Promise<ProviderSearchResult> {
    const started = Date.now();
    if (!this.enabled) {
      return {
        provider: this.meta,
        products: [],
        ok: false,
        live: false,
        error: "disabled",
        tookMs: 0,
      };
    }

    let products: NormalizedProduct[] | null = null;
    let live = false;
    let error: string | undefined;

    try {
      products = await this.fetchLive(options);
      live = Array.isArray(products) && products.length > 0;
    } catch (e) {
      error = e instanceof Error ? e.message : "fetch_failed";
    }

    if (!products || products.length === 0) {
      products = this.fallback(options);
      live = false;
    }

    const limit = options.limit ?? 12;
    return {
      provider: this.meta,
      products: products.slice(0, limit),
      ok: true,
      live,
      error,
      tookMs: Date.now() - started,
    };
  }

  // ---- shared helpers ----------------------------------------------------

  protected async fetchHtml(
    url: string,
    signal?: AbortSignal
  ): Promise<string | null> {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "es-AR,es;q=0.9",
        },
        signal,
        // Cache live scrapes for 30 min to be a good citizen.
        next: { revalidate: 1800 },
      });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }

  protected async fetchJson<T>(
    url: string,
    signal?: AbortSignal
  ): Promise<T | null> {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal,
        next: { revalidate: 1800 },
      });
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      return null;
    }
  }

  /** Parse an Argentine price string like "$ 12.500,50" → 12500.5 */
  protected parsePrice(raw: string | null | undefined): number | null {
    if (!raw) return null;
    const cleaned = raw
      .replace(/[^\d.,]/g, "")
      .replace(/\.(?=\d{3}(\D|$))/g, "") // remove thousands separators
      .replace(",", ".");
    const value = parseFloat(cleaned);
    return Number.isFinite(value) ? value : null;
  }

  /** Decode HTML entities (numeric + common named) found in scraped titles. */
  protected decodeEntities(text: string): string {
    return text
      .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_m, n) => String.fromCharCode(parseInt(n, 16)))
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;|&apos;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Extract and parse a Next.js __NEXT_DATA__ blob from an HTML page. */
  protected parseNextData<T = unknown>(html: string): T | null {
    const m = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
    );
    if (!m) return null;
    try {
      return JSON.parse(m[1]) as T;
    } catch {
      return null;
    }
  }

  protected buildProduct(
    input: Partial<NormalizedProduct> & {
      sku: string;
      title: string;
      url: string;
    }
  ): NormalizedProduct {
    return {
      id: `${this.meta.id}:${input.sku}`,
      sku: input.sku,
      title: input.title,
      brand: input.brand ?? null,
      price: input.price ?? null,
      currency: input.currency ?? "ARS",
      unit: input.unit ?? null,
      packageSize: input.packageSize ?? null,
      availability: (input.availability ?? "unknown") as Availability,
      url: input.url,
      image: input.image ?? null,
      category: input.category ?? null,
      provider: this.meta,
      retrievedAt: new Date().toISOString(),
    };
  }

  /** Build fallback results from the shared catalog with provider-specific pricing. */
  protected catalogFallback(
    options: SearchOptions,
    t: FallbackTransform
  ): NormalizedProduct[] {
    const round = t.round ?? 10;
    return CATALOG.filter((item) =>
      matchesQuery(
        [item.title, item.brand, item.category, ...item.keywords].join(" "),
        options.query
      )
    ).map((item) =>
      this.buildProduct({
        sku: item.sku,
        title: item.title,
        brand: item.brand,
        price: Math.round((item.basePrice * t.priceFactor) / round) * round,
        unit: item.unit,
        packageSize: item.packageSize,
        availability: t.availability ? t.availability(item) : "in_stock",
        url: t.urlFor(item),
        image: item.image,
        category: item.category,
      })
    );
  }
}

export function matchesQuery(text: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = text.toLowerCase();
  return q
    .split(/\s+/)
    .every((token) => haystack.includes(token.replace(/s$/, "")));
}
