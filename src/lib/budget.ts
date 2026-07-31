// Motor de presupuesto: resuelve el costo estimado de una lista de materiales
// usando los precios de referencia del catálogo del comparador (o precios
// internos para lo que el catálogo no cubre). Precios ARS orientativos.

import { CATALOG } from "@/lib/providers/catalog";
import type { BudgetItem } from "@/lib/calculators";

interface PriceRef {
  sku?: string; // precio tomado del catálogo del comparador
  price?: number; // o precio interno de referencia
  unit: string;
  label: string;
}

// Material canónico → precio de referencia.
const PRICE_MAP: Record<string, PriceRef> = {
  cemento: { sku: "cemento-holcim-50", unit: "bolsa", label: "Cemento (bolsa 50 kg)" },
  cal: { sku: "cal-hidraulica-milagro-25", unit: "bolsa", label: "Cal (bolsa 25 kg)" },
  arena: { sku: "arena-fina-m3", unit: "m³", label: "Arena" },
  piedra: { sku: "piedra-partida-6-20", unit: "m³", label: "Piedra / grava" },
  cascote: { price: 16000, unit: "m³", label: "Cascote" },
  ladrillo_hueco12: { price: 520, unit: "u", label: "Ladrillo hueco 8×18×33" },
  ladrillo_hueco18: { sku: "ladrillo-hueco-12x18x33", unit: "u", label: "Ladrillo hueco 12×18×33" },
  ladrillo_comun: { sku: "ladrillo-comun-macizo", unit: "u", label: "Ladrillo común" },
  bloque: { sku: "bloque-hormigon-19x19x39", unit: "u", label: "Bloque de hormigón" },
  hierro: { sku: "hierro-aletado-10mm", unit: "barra", label: "Hierro Ø10 (barra 12 m)" },
  pintura: { sku: "pintura-latex-interior-20l", unit: "balde", label: "Pintura látex (balde 20 L)" },
  membrana: { sku: "membrana-40-10m", unit: "rollo", label: "Membrana asfáltica (rollo)" },
  placa_yeso: { sku: "placa-yeso-durlock-12mm", unit: "placa", label: "Placa de yeso" },
  perfil: { sku: "perfil-montante-70", unit: "perfil", label: "Perfiles (montante/solera)" },
  chapa: { sku: "chapa-sinusoidal-c25", unit: "m", label: "Chapa sinusoidal" },
  ceramico: { sku: "ceramica-esmaltada-36x36", unit: "m²", label: "Cerámica / porcelanato" },
  adhesivo: { sku: "adhesivo-klaukol-30kg", unit: "bolsa", label: "Adhesivo (bolsa 30 kg)" },
  monocapa: { price: 9800, unit: "bolsa", label: "Revoque monocapa (bolsa 30 kg)" },
  zocalo: { price: 3200, unit: "u", label: "Zócalo (pieza)" },
};

function resolvePrice(key: string): { label: string; unit: string; price: number } | null {
  const ref = PRICE_MAP[key];
  if (!ref) return null;
  let price = ref.price;
  if (ref.sku) {
    const item = CATALOG.find((c) => c.sku === ref.sku);
    if (item) price = item.basePrice;
  }
  if (price == null) return null;
  return { label: ref.label, unit: ref.unit, price };
}

export interface BudgetLine {
  key: string;
  label: string;
  qty: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}
export interface BudgetEstimate {
  lines: BudgetLine[];
  total: number;
}

export function estimateBudget(items: BudgetItem[]): BudgetEstimate {
  const lines: BudgetLine[] = [];
  for (const it of items) {
    const p = resolvePrice(it.key);
    if (!p) continue;
    const qty = Math.max(0, Math.ceil(it.qty * 100) / 100);
    lines.push({
      key: it.key,
      label: p.label,
      qty,
      unit: p.unit,
      unitPrice: p.price,
      subtotal: qty * p.price,
    });
  }
  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  return { lines, total };
}
