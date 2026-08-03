import { BaseProvider } from "./base";
import type { NormalizedProduct, ProviderMeta, SearchOptions } from "./types";

export class EasyProvider extends BaseProvider {
  meta: ProviderMeta = {
    id: "easy",
    name: "Easy Argentina",
    website: "https://www.easy.com.ar",
    region: "Nacional",
    logoColor: "#0a7d3e",
  };

  // Demonstrates the live-scrape hook. Easy runs on VTEX; if reachable we could
  // hit its public search API. Any failure falls back to the catalog transparently.
  protected async fetchLive(
    options: SearchOptions
  ): Promise<NormalizedProduct[] | null> {
    const url = `${this.meta.website}/api/catalog_system/pub/products/search/${encodeURIComponent(
      options.query
    )}?_from=0&_to=11`;

    type VtexItem = {
      productId: string;
      productName: string;
      brand?: string;
      link: string;
      items?: {
        images?: { imageUrl: string }[];
        sellers?: {
          commertialOffer?: { Price?: number; IsAvailable?: boolean };
        }[];
      }[];
    };

    const data = await this.fetchJson<VtexItem[]>(url, options.signal);
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    return data.map((p) => {
      const item = p.items?.[0];
      const offer = item?.sellers?.[0]?.commertialOffer;
      return this.buildProduct({
        sku: p.productId,
        title: p.productName,
        brand: p.brand ?? null,
        price: offer?.Price ?? null,
        availability: offer?.IsAvailable ? "in_stock" : "out_of_stock",
        // VTEX `link` ya es la URL completa; no anteponer el dominio (evita duplicar).
        url: p.link?.startsWith("http")
          ? p.link
          : `${this.meta.website}/${(p.link ?? "").replace(/^\//, "")}`,
        image: item?.images?.[0]?.imageUrl ?? null,
        category: null,
      });
    });
  }

  protected fallback(options: SearchOptions): NormalizedProduct[] {
    return this.catalogFallback(options, {
      // Retail — precios de góndola algo más altos.
      priceFactor: 1.085,
      availability: (item) =>
        item.category === "Áridos" ? "out_of_stock" : "in_stock",
      urlFor: (item) =>
        `${this.meta.website}/search?text=${encodeURIComponent(item.keywords[0] ?? item.title)}`,
    });
  }
}
