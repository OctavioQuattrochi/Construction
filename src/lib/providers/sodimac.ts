import { BaseProvider } from "./base";
import type { NormalizedProduct, ProviderMeta, SearchOptions } from "./types";

interface SodimacPrice {
  type?: string; // "NORMAL" | "PRECIOS_PRO" | ...
  priceWithoutFormatting?: number;
}
interface SodimacResult {
  productId: string;
  skuId?: string;
  displayName: string;
  brand?: string;
  prices?: SodimacPrice[];
  availability?: {
    homeDelivery?: boolean;
    clickAndCollect?: boolean;
  };
}
interface SodimacNextData {
  props?: {
    pageProps?: {
      searchProps?: {
        searchData?: { results?: SodimacResult[] };
      };
    };
  };
}

export class SodimacProvider extends BaseProvider {
  meta: ProviderMeta = {
    id: "sodimac",
    name: "Sodimac Argentina",
    website: "https://www.sodimac.com.ar",
    region: "Nacional",
    logoColor: "#0b5cab",
  };

  // Live: Sodimac (Next.js) ships search results inside __NEXT_DATA__.
  protected async fetchLive(
    options: SearchOptions
  ): Promise<NormalizedProduct[] | null> {
    const url = `${this.meta.website}/sodimac-ar/search?Ntt=${encodeURIComponent(
      options.query
    )}`;

    const html = await this.fetchHtml(url, options.signal);
    if (!html) return null;

    const next = this.parseNextData<SodimacNextData>(html);
    const results = next?.props?.pageProps?.searchProps?.searchData?.results;
    if (!results || results.length === 0) return null;

    return results
      .map((r) => {
        const normal =
          r.prices?.find((p) => p.type === "NORMAL") ?? r.prices?.[0];
        const price = normal?.priceWithoutFormatting ?? null;
        const inStock =
          r.availability?.homeDelivery || r.availability?.clickAndCollect;

        return this.buildProduct({
          sku: r.skuId || r.productId,
          title: r.displayName,
          brand: r.brand ?? null,
          price: typeof price === "number" ? price : null,
          availability: inStock ? "in_stock" : "unknown",
          url: `${this.meta.website}/sodimac-ar/product/${r.productId}`,
        });
      })
      .filter((p) => p.price != null);
  }

  protected fallback(options: SearchOptions): NormalizedProduct[] {
    return this.catalogFallback(options, {
      priceFactor: 1.05,
      availability: (item) =>
        item.category === "Áridos" || item.category === "Techos"
          ? "unknown"
          : "in_stock",
      urlFor: (item) =>
        `${this.meta.website}/sodimac-ar/search?Ntt=${encodeURIComponent(
          item.keywords[0] ?? item.title
        )}`,
    });
  }
}
