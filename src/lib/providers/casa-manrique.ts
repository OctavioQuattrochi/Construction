import { BaseProvider } from "./base";
import type { NormalizedProduct, ProviderMeta, SearchOptions } from "./types";

// WooCommerce Store API shape (only the fields we use).
interface WooProduct {
  id: number;
  name: string;
  sku: string;
  permalink: string;
  is_in_stock: boolean;
  prices?: {
    price?: string;
    currency_minor_unit?: number;
  };
  images?: { src?: string; thumbnail?: string }[];
}

export class CasaManriqueProvider extends BaseProvider {
  meta: ProviderMeta = {
    id: "casa-manrique",
    name: "Casa Manrique",
    website: "https://casamanriqueweb.com.ar",
    region: "Córdoba",
    logoColor: "#c0392b",
  };

  // Live: Casa Manrique runs WooCommerce and exposes the public Store API.
  protected async fetchLive(
    options: SearchOptions
  ): Promise<NormalizedProduct[] | null> {
    const url = `${this.meta.website}/wp-json/wc/store/v1/products?search=${encodeURIComponent(
      options.query
    )}&per_page=${options.limit ?? 12}`;

    const data = await this.fetchJson<WooProduct[]>(url, options.signal);
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    return data
      .map((p) => {
        const minor = p.prices?.currency_minor_unit ?? 2;
        const raw = p.prices?.price;
        const price =
          raw != null && raw !== ""
            ? Number(raw) / Math.pow(10, minor)
            : null;

        return this.buildProduct({
          sku: p.sku || String(p.id),
          title: this.decodeEntities(p.name),
          price,
          availability: p.is_in_stock ? "in_stock" : "out_of_stock",
          url: p.permalink,
          image: p.images?.[0]?.src ?? p.images?.[0]?.thumbnail ?? null,
        });
      })
      .filter((p) => p.price != null);
  }

  protected fallback(options: SearchOptions): NormalizedProduct[] {
    return this.catalogFallback(options, {
      priceFactor: 1.0,
      availability: (item) =>
        item.category === "Áridos" ? "unknown" : "in_stock",
      urlFor: (item) =>
        `${this.meta.website}/?s=${encodeURIComponent(item.title)}&post_type=product`,
    });
  }
}
