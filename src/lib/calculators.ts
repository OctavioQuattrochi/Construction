// Construction calculators — pure functions with sensible Argentine defaults.
// All results are estimates; a technical margin is included where appropriate.

export interface ResultRow {
  label: string;
  value: string;
  hint?: string;
}
export interface CalcResult {
  rows: ResultRow[];
  note?: string;
}

const nf = (n: number, d = 0) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: d,
  }).format(n);

// ---------------------------------------------------------------- CONCRETE
export type ConcreteGrade = "H17" | "H21" | "H30";

// kg cement, m³ sand, m³ gravel, L water per m³ of concrete.
const CONCRETE_MIX: Record<
  ConcreteGrade,
  { cement: number; sand: number; gravel: number; water: number; label: string }
> = {
  H17: { cement: 300, sand: 0.5, gravel: 0.8, water: 180, label: "H17 (1:3:3)" },
  H21: { cement: 350, sand: 0.5, gravel: 0.8, water: 175, label: "H21 (1:2:3)" },
  H30: { cement: 400, sand: 0.45, gravel: 0.8, water: 170, label: "H30 (1:1,5:2,5)" },
};

export function calcConcrete(input: {
  length: number;
  width: number;
  thickness: number; // cm
  grade: ConcreteGrade;
  waste: number; // %
}): CalcResult {
  const { length, width, thickness, grade, waste } = input;
  const volume = length * width * (thickness / 100);
  const total = volume * (1 + waste / 100);
  const mix = CONCRETE_MIX[grade];
  const cementKg = total * mix.cement;
  const bags = Math.ceil(cementKg / 50);

  return {
    rows: [
      { label: "Volumen de hormigón", value: `${nf(total, 2)} m³`, hint: `Neto ${nf(volume, 2)} m³ + ${waste}% desperdicio` },
      { label: "Cemento", value: `${bags} bolsas`, hint: `${nf(cementKg)} kg · bolsas de 50 kg` },
      { label: "Arena", value: `${nf(total * mix.sand, 2)} m³` },
      { label: "Piedra / grava", value: `${nf(total * mix.gravel, 2)} m³` },
      { label: "Agua", value: `${nf(total * mix.water)} L` },
    ],
    note: `Dosificación ${mix.label}. Valores orientativos para hormigón elaborado in situ.`,
  };
}

// ---------------------------------------------------------------- BRICKS
export type BrickType = "hueco12" | "hueco18" | "comun" | "bloque19";

const BRICKS: Record<
  BrickType,
  { perM2: number; label: string; mortarPerM2: number }
> = {
  hueco12: { perM2: 25, label: "Ladrillo hueco 8x18x33", mortarPerM2: 0.012 },
  hueco18: { perM2: 16, label: "Ladrillo hueco 12x18x33", mortarPerM2: 0.02 },
  comun: { perM2: 62, label: "Ladrillo común macizo", mortarPerM2: 0.03 },
  bloque19: { perM2: 12.5, label: "Bloque de hormigón 19x19x39", mortarPerM2: 0.018 },
};

export function calcBricks(input: {
  length: number;
  height: number;
  openings: number; // m² of doors/windows to subtract
  type: BrickType;
  waste: number;
}): CalcResult {
  const { length, height, openings, type, waste } = input;
  const area = Math.max(0, length * height - openings);
  const spec = BRICKS[type];
  const units = Math.ceil(area * spec.perM2 * (1 + waste / 100));
  const mortar = area * spec.mortarPerM2;
  // Mortar 1:4 → cement ~7.5 bags/m³, sand ~1.05 m³/m³
  const cementBags = Math.ceil(mortar * 7.5);
  const sand = mortar * 1.05;

  return {
    rows: [
      { label: "Superficie de muro", value: `${nf(area, 2)} m²`, hint: `Descontando ${nf(openings, 2)} m² de aberturas` },
      { label: spec.label, value: `${nf(units)} unidades`, hint: `${spec.perM2}/m² + ${waste}% desperdicio` },
      { label: "Mortero de asiento", value: `${nf(mortar, 2)} m³` },
      { label: "Cemento (mortero)", value: `${cementBags} bolsas`, hint: "bolsas de 50 kg" },
      { label: "Arena (mortero)", value: `${nf(sand, 2)} m³` },
    ],
    note: "Mortero de asiento 1:4. Estimación para muro de un ladrillo de espesor.",
  };
}

// ---------------------------------------------------------------- MORTAR
export type MortarUse = "asiento" | "revoque_grueso" | "revoque_fino" | "carpeta";

const MORTAR: Record<
  MortarUse,
  { thickness: number; cementBags: number; sand: number; lime: number; label: string }
> = {
  asiento: { thickness: 1.5, cementBags: 7.5, sand: 1.05, lime: 0, label: "Mortero de asiento 1:4" },
  revoque_grueso: { thickness: 2, cementBags: 6, sand: 1.0, lime: 90, label: "Revoque grueso 1:1:5" },
  revoque_fino: { thickness: 0.5, cementBags: 5, sand: 1.0, lime: 130, label: "Revoque fino a la cal" },
  carpeta: { thickness: 3, cementBags: 8, sand: 1.05, lime: 0, label: "Carpeta 1:3" },
};

export function calcMortar(input: {
  area: number;
  thickness?: number; // cm, optional override
  use: MortarUse;
  waste: number;
}): CalcResult {
  const spec = MORTAR[input.use];
  const thickness = input.thickness ?? spec.thickness;
  const volume = input.area * (thickness / 100) * (1 + input.waste / 100);
  const cementBags = Math.ceil(volume * spec.cementBags);
  const sand = volume * spec.sand;
  const limeKg = volume * spec.lime;

  const rows: ResultRow[] = [
    { label: "Volumen de mortero", value: `${nf(volume, 2)} m³`, hint: `${nf(input.area, 2)} m² × ${nf(thickness, 1)} cm` },
    { label: "Cemento", value: `${cementBags} bolsas`, hint: "bolsas de 50 kg" },
    { label: "Arena", value: `${nf(sand, 2)} m³` },
  ];
  if (limeKg > 0) {
    rows.push({ label: "Cal", value: `${Math.ceil(limeKg / 25)} bolsas`, hint: `${nf(limeKg)} kg · bolsas de 25 kg` });
  }
  return { rows, note: `${spec.label}. Espesor sugerido ${spec.thickness} cm.` };
}

// ---------------------------------------------------------------- PAINT
export function calcPaint(input: {
  area: number; // wall area
  openings: number;
  coats: number;
  yield: number; // m²/L per coat
  waste: number;
}): CalcResult {
  const net = Math.max(0, input.area - input.openings);
  const liters = (net * input.coats) / input.yield * (1 + input.waste / 100);
  const buckets20 = Math.ceil(liters / 20);
  const cans4 = Math.ceil(liters / 4);

  return {
    rows: [
      { label: "Superficie a pintar", value: `${nf(net, 2)} m²`, hint: `${input.coats} manos` },
      { label: "Pintura necesaria", value: `${nf(liters, 1)} L`, hint: `Rendimiento ${input.yield} m²/L` },
      { label: "Equivale a", value: `${buckets20} balde(s) de 20 L`, hint: `o ${cans4} lata(s) de 4 L` },
    ],
    note: "Incluye desperdicio. El rendimiento real varía según la absorción de la superficie.",
  };
}

// ---------------------------------------------------------------- FLOORING
export function calcFlooring(input: {
  length: number;
  width: number;
  pieceW: number; // cm
  pieceH: number; // cm
  perBox: number;
  waste: number;
}): CalcResult {
  const area = input.length * input.width;
  const pieceArea = (input.pieceW / 100) * (input.pieceH / 100);
  const areaWithWaste = area * (1 + input.waste / 100);
  const pieces = Math.ceil(areaWithWaste / pieceArea);
  const boxes = Math.ceil(pieces / input.perBox);
  const m2PerBox = pieceArea * input.perBox;

  return {
    rows: [
      { label: "Superficie", value: `${nf(area, 2)} m²`, hint: `+ ${input.waste}% desperdicio = ${nf(areaWithWaste, 2)} m²` },
      { label: "Piezas necesarias", value: `${nf(pieces)} unidades`, hint: `${input.pieceW}×${input.pieceH} cm` },
      { label: "Cajas", value: `${boxes} caja(s)`, hint: `${input.perBox} piezas/caja · ${nf(m2PerBox, 2)} m²/caja` },
      { label: "Adhesivo estimado", value: `${Math.ceil((areaWithWaste * 4.5) / 30)} bolsas`, hint: "~4,5 kg/m² · bolsas de 30 kg" },
    ],
    note: "Se recomienda comprar todas las cajas del mismo lote para evitar diferencias de tono.",
  };
}
