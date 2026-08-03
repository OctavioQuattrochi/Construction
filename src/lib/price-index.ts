import { compare } from "./providers/engine";
import type { NormalizedProduct } from "./providers/types";

// Índice de precios REALES: para cada material canónico busca el precio más barato
// EN VIVO en el comparador (nunca inventa: si no hay precio en vivo, devuelve null).
// Cachea por query en memoria para no re-scrapear en cada request.

export interface MaterialPrice {
  key: string;
  price: number; // ARS
  unit: string;
  storeId: string;
  storeName: string;
  url: string;
  title: string;
  capturedAt: string;
}

interface Spec {
  query: string;
  unit: string;
  kw: string; // palabra clave que debe estar en el título
  size?: string; // token de medida sin espacios (ej "10mm", "12")
  requireBag?: boolean; // exigir que el producto tenga kg (evita pegamentos/accesorios)
  bagKg?: number; // normalizar el precio a este tamaño de bolsa (kg)
  minPrice: number; // piso: por debajo es un accesorio/producto equivocado → descartar
  maxPrice?: number; // techo: por encima es otra cosa (ej camionada) → descartar
}

// Material del presupuesto → cómo buscar su precio real. Sólo prician los que se
// matchean con CERTEZA (el grueso de obra); el resto queda "consultar" — no
// inventamos precios. El piso/techo y la exigencia de bolsa filtran accesorios.
const SPECS: Record<string, Spec> = {
  cemento: { query: "cemento portland", unit: "bolsa 50 kg", kw: "cemento", bagKg: 50, requireBag: true, minPrice: 6000, maxPrice: 40000 },
  cal: { query: "cal hidratada", unit: "bolsa 25 kg", kw: "cal", bagKg: 25, requireBag: true, minPrice: 3000, maxPrice: 20000 },
  ladrillo_hueco18: { query: "ladrillo hueco", unit: "u", kw: "ladrillo", minPrice: 150, maxPrice: 3000 },
  ladrillo_hueco12: { query: "ladrillo hueco", unit: "u", kw: "ladrillo", minPrice: 150, maxPrice: 3000 },
  ladrillo_comun: { query: "ladrillo comun", unit: "u", kw: "ladrillo", minPrice: 100, maxPrice: 2000 },
  bloque: { query: "bloque hormigon", unit: "u", kw: "bloque", minPrice: 400, maxPrice: 6000 },
  hierro: { query: "hierro 10", unit: "barra Ø10 · 12 m", kw: "hierro", size: "10mm", minPrice: 8000, maxPrice: 60000 },
};

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// ---- caché por query (en memoria, TTL) ----------------------------------
const TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { products: NormalizedProduct[]; at: number }>();

async function liveProductsFor(query: string): Promise<NormalizedProduct[]> {
  const hit = cache.get(query);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.products;
  try {
    const res = await compare({ query, timeoutMs: 8000 });
    const liveIds = new Set(res.results.filter((r) => r.live).map((r) => r.provider.id));
    const products = res.products.filter(
      (p) => liveIds.has(p.provider.id) && p.price != null
    );
    cache.set(query, { products, at: Date.now() });
    return products;
  } catch {
    return [];
  }
}

function detectKg(text: string): number | null {
  const m = text.replace(/\s/g, "").match(/(\d+(?:[.,]\d+)?)kg/);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

// Devuelve el producto más barato que matchea + su precio (normalizado por bolsa).
function pickCheapest(
  products: NormalizedProduct[],
  spec: Spec
): { product: NormalizedProduct; price: number } | null {
  const scored = products
    .filter((p) => {
      const t = norm(`${p.title} ${p.packageSize ?? ""}`);
      if (!t.includes(spec.kw)) return false;
      if (spec.size && !t.replace(/\s/g, "").includes(spec.size)) return false;
      if (spec.requireBag && detectKg(t) == null) return false; // debe ser bolsa con kg
      return true;
    })
    .map((p) => {
      let price = p.price!;
      if (spec.bagKg) {
        const kg = detectKg(norm(`${p.title} ${p.packageSize ?? ""}`));
        if (kg && kg >= 5 && kg !== spec.bagKg) price = (price * spec.bagKg) / kg;
      }
      return { product: p, price: Math.round(price) };
    })
    // Descartar accesorios/errores por debajo del piso o por encima del techo.
    .filter((s) => s.price >= spec.minPrice && (!spec.maxPrice || s.price <= spec.maxPrice));
  if (scored.length === 0) return null;
  return scored.reduce((a, b) => (b.price < a.price ? b : a));
}

/** Devuelve el precio real (más barato en vivo) para cada material pedido. */
export async function getMaterialPrices(
  keys: string[]
): Promise<Record<string, MaterialPrice | null>> {
  const unique = Array.from(new Set(keys)).filter((k) => SPECS[k]);
  // Buscar en paralelo las queries necesarias (deduplicadas por query).
  const queries = Array.from(new Set(unique.map((k) => SPECS[k].query)));
  await Promise.all(queries.map((q) => liveProductsFor(q)));

  const out: Record<string, MaterialPrice | null> = {};
  for (const key of keys) {
    const spec = SPECS[key];
    if (!spec) {
      out[key] = null;
      continue;
    }
    const products = cache.get(spec.query)?.products ?? [];
    const best = pickCheapest(products, spec);
    out[key] = best
      ? {
          key,
          price: best.price,
          unit: spec.unit,
          storeId: best.product.provider.id,
          storeName: best.product.provider.name,
          url: best.product.url,
          title: best.product.title,
          capturedAt: new Date().toISOString(),
        }
      : null;
  }
  return out;
}

export function priceableKeys(): string[] {
  return Object.keys(SPECS);
}
