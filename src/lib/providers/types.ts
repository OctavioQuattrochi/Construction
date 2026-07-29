// Price comparison — shared contracts.
// The comparison engine ONLY ever consumes NormalizedProduct[]; providers are
// fully isolated and responsible for producing normalized data.

export type Availability = "in_stock" | "out_of_stock" | "unknown";

export interface ProviderMeta {
  id: string;
  name: string;
  website: string;
  region: string;
  logoColor: string; // brand accent used in the UI badge
}

export interface NormalizedProduct {
  id: string; // stable: `${providerId}:${sku}`
  sku: string;
  title: string;
  brand: string | null;
  price: number | null; // in ARS
  currency: string;
  unit: string | null; // e.g. "bolsa", "unidad", "litro", "m²"
  packageSize: string | null; // e.g. "50 kg", "20 L", "20x20 cm"
  availability: Availability;
  url: string; // purchase / product link
  image: string | null;
  category: string | null;
  provider: ProviderMeta;
  retrievedAt: string; // ISO timestamp
}

export interface SearchOptions {
  query: string;
  limit?: number;
  signal?: AbortSignal;
}

export interface ProviderSearchResult {
  provider: ProviderMeta;
  products: NormalizedProduct[];
  ok: boolean;
  live: boolean; // true if fetched live, false if served from fallback catalog
  error?: string;
  tookMs: number;
}

export interface Provider {
  meta: ProviderMeta;
  enabled: boolean;
  /** Returns normalized products for a query. Never throws — errors are absorbed. */
  search(options: SearchOptions): Promise<ProviderSearchResult>;
}

export interface CompareResult {
  query: string;
  retrievedAt: string;
  providersQueried: number;
  providersOk: number;
  totalProducts: number;
  cheapest: NormalizedProduct | null;
  results: ProviderSearchResult[];
  products: NormalizedProduct[]; // flat, sorted ascending by price
}
