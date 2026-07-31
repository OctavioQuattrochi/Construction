// Matching de productos entre tiendas. El comparador agrupa por SKU del proveedor,
// así que el mismo producto en distintas tiendas queda separado. Esta heurística
// deriva una CLAVE común a partir del tipo de material + la medida, para unificar
// (ej: "Cemento ... 50 kg" de Easy, Sodimac y catálogo → un solo grupo).
//
// Conservador a propósito: sólo fusiona cuando detecta con confianza keyword + medida.
// Si no, cae a la SKU (no fusiona) para no mezclar productos distintos.

// Commodities donde tipo + medida identifican el producto (la marca no cambia la
// comparación). NO incluye pisos/pinturas: ahí el modelo/color importa y se
// mezclarían productos distintos, así que esos NO se fusionan (quedan por SKU).
const KEYWORDS = [
  "cemento",
  "cal hidraulica",
  "cal",
  "hidrofugo",
  "membrana",
  "ladrillo hueco",
  "ladrillo comun",
  "ladrillo",
  "bloque",
  "arena",
  "piedra",
  "malla sima",
  "malla",
  "hierro",
  "adhesivo",
  "pegamento",
  "placa de yeso",
  "durlock",
  "perfil",
  "chapa",
  "yeso",
  "aislante",
];

// Si el título contiene alguno de estos, NO fusionar (aunque comparta keyword):
// evita que cerámicos "cemento", selladores o cámaras sépticas se agrupen mal.
const EXCLUDE = [
  "porcelanato",
  "ceramico",
  "ceramica",
  "sellador",
  "septic",
  "revestimiento",
  "simil",
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatSize(size: string): string {
  const u = size.match(/^(\d+(?:[.,]\d+)?)(kg|mm|cm|l)$/i);
  if (u) return `${u[1]} ${u[2].toLowerCase() === "l" ? "L" : u[2].toLowerCase()}`;
  const x = size.match(/^(\d+)x(\d+)$/i);
  if (x) return `${x[1]}x${x[2]} cm`;
  return size;
}

export interface ProductMatch {
  key: string; // clave de agrupación
  label: string | null; // título genérico cuando se fusionan varias marcas/tiendas
}

export function productMatch(p: {
  title: string;
  packageSize?: string | null;
  sku: string;
}): ProductMatch {
  const text = norm(`${p.title} ${p.packageSize ?? ""}`);

  // Productos donde el matching por tipo+medida no aplica → no fusionar.
  if (EXCLUDE.some((e) => text.includes(e))) {
    return { key: `s:${p.sku}`, label: null };
  }

  // Keyword como palabra completa (evita "fibrocemento" → "cemento").
  const kw = KEYWORDS.find((k) => new RegExp(`\\b${k}\\b`).test(text));

  const sizeMatch =
    text.match(/(\d+(?:[.,]\d+)?)\s?(kg|kilos?|lts?|litros?|mm|cm)\b/) ||
    text.match(/(\d+(?:[.,]\d+)?)\s?l\b/) ||
    text.match(/(\d{1,3})\s?x\s?(\d{1,3})/);

  let size: string | null = null;
  if (sizeMatch) {
    size = sizeMatch[0]
      .replace(/\s+/g, "")
      .replace(/kilos?/, "kg")
      .replace(/lts?|litros?/, "l");
  }

  if (kw && size) {
    return { key: `m:${kw}|${size}`, label: `${cap(kw)} · ${formatSize(size)}` };
  }
  // Sin señal confiable → no fusionar.
  return { key: `s:${p.sku}`, label: null };
}
