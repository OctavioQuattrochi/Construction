import { BaseProvider } from "./base";
import type { NormalizedProduct, ProviderMeta, SearchOptions } from "./types";

export class FerroconsProvider extends BaseProvider {
  meta: ProviderMeta = {
    id: "ferrocons",
    name: "Ferrocons",
    website: "https://www.ferrocons.com.ar",
    region: "Córdoba",
    logoColor: "#e67e22",
  };

  protected fallback(options: SearchOptions): NormalizedProduct[] {
    return this.catalogFallback(options, {
      // Corralón mayorista — suele ser algo más competitivo.
      priceFactor: 0.965,
      availability: () => "in_stock",
      urlFor: (item) =>
        `${this.meta.website}/busqueda?q=${encodeURIComponent(item.title)}`,
    });
  }
}
