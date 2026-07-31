import { BaseProvider } from "./base";
import type {
  Availability,
  NormalizedProduct,
  ProviderMeta,
  SearchOptions,
} from "./types";

export interface GenericConfig {
  priceFactor: number;
  /** Construye la URL de búsqueda del proveedor para un título de producto. */
  searchUrl: (query: string) => string;
  availability?: Availability; // para el fallback de referencia
}

/** Proveedor de sólo-referencia (catálogo). Sin scraping en vivo. */
export class CatalogProvider extends BaseProvider {
  meta: ProviderMeta;
  protected cfg: GenericConfig;

  constructor(meta: ProviderMeta, cfg: GenericConfig) {
    super();
    this.meta = meta;
    this.cfg = cfg;
  }

  protected fallback(options: SearchOptions): NormalizedProduct[] {
    return this.catalogFallback(options, {
      priceFactor: this.cfg.priceFactor,
      availability: () => this.cfg.availability ?? "unknown",
      urlFor: (item) => this.cfg.searchUrl(item.title),
    });
  }
}

// ---- WooCommerce (Store API pública) -----------------------------------
interface WooProduct {
  id: number;
  name: string;
  sku: string;
  permalink: string;
  is_in_stock: boolean;
  prices?: { price?: string; currency_minor_unit?: number };
  images?: { src?: string; thumbnail?: string }[];
}

export class WooStoreProvider extends CatalogProvider {
  protected async fetchLive(
    options: SearchOptions
  ): Promise<NormalizedProduct[] | null> {
    const url = `${this.meta.website}/wp-json/wc/store/v1/products?search=${encodeURIComponent(
      options.query
    )}&per_page=${options.limit ?? 12}`;
    const data = await this.fetchJson<WooProduct[]>(url, options.signal);
    if (!Array.isArray(data) || data.length === 0) return null;

    return data
      .map((p) => {
        const minor = p.prices?.currency_minor_unit ?? 2;
        const raw = p.prices?.price;
        const price =
          raw != null && raw !== "" ? Number(raw) / Math.pow(10, minor) : null;
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
}

// ---- VTEX (catalog system pública) -------------------------------------
interface VtexItem {
  productId: string;
  productName: string;
  brand?: string;
  link: string;
  items?: {
    images?: { imageUrl: string }[];
    sellers?: { commertialOffer?: { Price?: number; IsAvailable?: boolean } }[];
  }[];
}

export class VtexProvider extends CatalogProvider {
  protected async fetchLive(
    options: SearchOptions
  ): Promise<NormalizedProduct[] | null> {
    const url = `${this.meta.website}/api/catalog_system/pub/products/search/${encodeURIComponent(
      options.query
    )}?_from=0&_to=11`;
    const data = await this.fetchJson<VtexItem[]>(url, options.signal);
    if (!Array.isArray(data) || data.length === 0) return null;

    return data
      .map((p) => {
        const item = p.items?.[0];
        const offer = item?.sellers?.[0]?.commertialOffer;
        return this.buildProduct({
          sku: p.productId,
          title: p.productName,
          brand: p.brand ?? null,
          price: offer?.Price ?? null,
          availability: offer?.IsAvailable ? "in_stock" : "out_of_stock",
          url: `${this.meta.website}/${p.link}`.replace(/([^:]\/)\/+/g, "$1"),
          image: item?.images?.[0]?.imageUrl ?? null,
        });
      })
      .filter((p) => p.price != null);
  }
}
