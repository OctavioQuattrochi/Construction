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

// ---------------------------------------------------------------- MEMBRANE (roof)
export function calcMembrane(input: {
  length: number;
  width: number;
  overlap: number; // % de solape
}): CalcResult {
  const area = input.length * input.width;
  const withOverlap = area * (1 + input.overlap / 100);
  const rolls = Math.ceil(withOverlap / 10); // rollos de 10 m²
  const primerL = area * 0.3; // imprimación asfáltica ~0,3 L/m²

  return {
    rows: [
      { label: "Superficie de techo", value: `${nf(area, 2)} m²`, hint: `+ ${input.overlap}% de solape = ${nf(withOverlap, 2)} m²` },
      { label: "Membrana asfáltica", value: `${rolls} rollo(s)`, hint: "rollos de 10 m² (10 m x 1 m)" },
      { label: "Imprimación asfáltica", value: `${nf(primerL, 1)} L`, hint: "~0,3 L/m² · pintura asfáltica base" },
    ],
    note: "Estimación para membrana de 40 kg. Respetá el solape mínimo de 8–10 cm entre rollos.",
  };
}

// ---------------------------------------------------------------- DRYWALL (durlock)
export function calcDrywall(input: {
  length: number;
  height: number;
  sides: number; // 1 o 2 caras
  waste: number;
}): CalcResult {
  const area = input.length * input.height;
  const totalPlateArea = area * input.sides * (1 + input.waste / 100);
  const plates = Math.ceil(totalPlateArea / 2.88); // placa 1,20 x 2,40 = 2,88 m²
  const montantes = Math.ceil(input.length / 0.4) + 1; // montantes cada 40 cm
  const soleras = Math.ceil((input.length * 2) / 2.6); // solera sup + inf, perfiles de 2,60 m
  const screws = Math.ceil(area * input.sides * 30); // ~30 tornillos/m²
  const masilla = area * input.sides * 0.9; // ~0,9 kg/m²
  const cinta = area * input.sides * 1.4; // ~1,4 m de cinta/m²

  return {
    rows: [
      { label: "Placas de yeso", value: `${plates} placas`, hint: `${input.sides} cara(s) · 1,20 x 2,40 m` },
      { label: "Perfiles montante", value: `${montantes} u`, hint: "cada 40 cm" },
      { label: "Perfiles solera", value: `${soleras} u`, hint: "piso y techo" },
      { label: "Tornillos", value: `${nf(screws)} u`, hint: "~30 por m²" },
      { label: "Masilla", value: `${nf(masilla, 1)} kg` },
      { label: "Cinta de juntas", value: `${nf(cinta)} m` },
    ],
    note: "Tabique estándar con estructura de perfiles galvanizados. Sumá aislante si corresponde.",
  };
}

// ---------------------------------------------------------------- SKIRTING (zócalos)
export function calcSkirting(input: {
  perimeter: number; // metros lineales
  openings: number; // metros de aberturas a descontar
  pieceLength: number; // largo de cada zócalo (m)
  waste: number;
}): CalcResult {
  const net = Math.max(0, input.perimeter - input.openings);
  const withWaste = net * (1 + input.waste / 100);
  const pieces = Math.ceil(withWaste / input.pieceLength);
  const adhesive = Math.ceil((net * 0.15) / 3); // ~0,15 kg/m, pomos de 3 kg

  return {
    rows: [
      { label: "Metros lineales", value: `${nf(net, 2)} m`, hint: `+ ${input.waste}% = ${nf(withWaste, 2)} m` },
      { label: "Piezas de zócalo", value: `${pieces} u`, hint: `piezas de ${nf(input.pieceLength, 2)} m` },
      { label: "Adhesivo / cemento de contacto", value: `${adhesive} pomo(s)`, hint: "estimado" },
    ],
    note: "Medí el perímetro del ambiente y descontá el ancho de las puertas.",
  };
}

// ---------------------------------------------------------------- EXCAVATION (movimiento de suelos)
export function calcExcavation(input: {
  length: number;
  width: number;
  depth: number; // m
  bulking: number; // % de esponjamiento
}): CalcResult {
  const bank = input.length * input.width * input.depth;
  const loose = bank * (1 + input.bulking / 100);
  const skips = Math.ceil(loose / 5); // volquete estándar ~5 m³

  return {
    rows: [
      { label: "Volumen a excavar", value: `${nf(bank, 2)} m³`, hint: `${nf(input.length, 1)} × ${nf(input.width, 1)} × ${nf(input.depth, 1)} m` },
      { label: "Volumen esponjado", value: `${nf(loose, 2)} m³`, hint: `+ ${input.bulking}% al remover el suelo` },
      { label: "Volquetes a retirar", value: `${skips} u`, hint: "volquete de ~5 m³" },
    ],
    note: "El esponjamiento varía según el suelo (tierra 20–25%, arcilla ~30%). Estimación para retiro de material.",
  };
}

// ---------------------------------------------------------------- STEEL RATIOS
const STEEL_RATIO: Record<string, number> = {
  losa: 90,
  viga: 130,
  columna: 140,
  base: 85,
  platea: 75,
  encadenado: 110,
  pilotin: 100,
};

// ---------------------------------------------------------------- FOUNDATIONS (bases)
export function calcFoundation(input: {
  count: number;
  length: number; // m
  width: number; // m
  height: number; // m
  grade: ConcreteGrade;
}): CalcResult {
  const volEach = input.length * input.width * input.height;
  const vol = input.count * volEach;
  const mix = CONCRETE_MIX[input.grade];
  const bags = Math.ceil((vol * mix.cement) / 50);
  const steel = vol * STEEL_RATIO.base;

  return {
    rows: [
      { label: "Volumen por base", value: `${nf(volEach, 3)} m³` },
      { label: "Volumen total", value: `${nf(vol, 2)} m³`, hint: `${input.count} base(s)` },
      { label: "Cemento", value: `${bags} bolsas`, hint: `${nf(vol * mix.cement)} kg · bolsas de 50 kg` },
      { label: "Arena", value: `${nf(vol * mix.sand, 2)} m³` },
      { label: "Piedra", value: `${nf(vol * mix.gravel, 2)} m³` },
      { label: "Hierro estimado", value: `${nf(steel)} kg`, hint: "~85 kg/m³ · según cálculo estructural" },
    ],
    note: `Hormigón ${mix.label}. El armado de hierro depende del cálculo estructural; tomá el valor como referencia.`,
  };
}

// ---------------------------------------------------------------- PILES (pilotines)
export function calcPiles(input: {
  count: number;
  diameter: number; // cm
  depth: number; // m
  grade: ConcreteGrade;
}): CalcResult {
  const r = input.diameter / 2 / 100;
  const volEach = Math.PI * r * r * input.depth;
  const vol = input.count * volEach;
  const mix = CONCRETE_MIX[input.grade];
  const bags = Math.ceil((vol * mix.cement) / 50);
  const steel = vol * STEEL_RATIO.pilotin;

  return {
    rows: [
      { label: "Volumen por pilotín", value: `${nf(volEach, 3)} m³`, hint: `Ø${input.diameter} cm × ${nf(input.depth, 1)} m` },
      { label: "Volumen total", value: `${nf(vol, 2)} m³`, hint: `${input.count} pilotín(es)` },
      { label: "Cemento", value: `${bags} bolsas` },
      { label: "Arena", value: `${nf(vol * mix.sand, 2)} m³` },
      { label: "Piedra", value: `${nf(vol * mix.gravel, 2)} m³` },
      { label: "Hierro estimado", value: `${nf(steel)} kg`, hint: "~100 kg/m³" },
    ],
    note: `Pilotines de hormigón ${mix.label}. Estimación de material; el armado surge del cálculo estructural.`,
  };
}

// ---------------------------------------------------------------- STEEL (hierro / armadura)
export type StructElement = "losa" | "viga" | "columna" | "base" | "platea" | "encadenado";

export function calcSteel(input: {
  element: StructElement;
  volume: number; // m³ de hormigón
}): CalcResult {
  const ratio = STEEL_RATIO[input.element];
  const kg = input.volume * ratio;
  const wire = Math.ceil(kg * 0.01); // alambre de atar ~1%
  const barKgO10 = 0.617 * 12; // barra Ø10 de 12 m ≈ 7,4 kg
  const barsO10 = Math.ceil(kg / barKgO10);

  return {
    rows: [
      { label: "Hierro estimado", value: `${nf(kg)} kg`, hint: `${ratio} kg/m³ para ${input.element}` },
      { label: "Alambre de atar", value: `${nf(wire)} kg`, hint: "~1% del peso de acero" },
      { label: "Referencia en barras", value: `≈ ${barsO10} barras`, hint: "equivalente en Ø10 de 12 m" },
    ],
    note: "Cuantía orientativa por m³. El diámetro y la cantidad exacta de barras dependen del cálculo estructural.",
  };
}

// ---------------------------------------------------------------- PLASTER (revoque)
export type PlasterType = "grueso" | "fino" | "completo" | "monocapa";

export function calcPlaster(input: {
  area: number;
  type: PlasterType;
  waste: number;
}): CalcResult {
  const f = 1 + input.waste / 100;
  const rows: ResultRow[] = [
    { label: "Superficie a revocar", value: `${nf(input.area, 2)} m²` },
  ];
  let note: string;

  if (input.type === "monocapa") {
    const kg = input.area * 20 * f; // ~20 kg/m² a 1,5 cm
    rows.push({ label: "Revoque monocapa", value: `${Math.ceil(kg / 30)} bolsas`, hint: `${nf(kg)} kg · bolsas de 30 kg` });
    note = "Revoque monocapa aplicado a ~1,5 cm. Reemplaza grueso y fino en una sola capa.";
  } else {
    const doGrueso = input.type === "grueso" || input.type === "completo";
    const doFino = input.type === "fino" || input.type === "completo";
    if (doGrueso) {
      const vol = input.area * 0.02 * f; // 2 cm
      rows.push({ label: "Cemento (grueso)", value: `${Math.ceil(vol * 6)} bolsas`, hint: "revoque grueso 2 cm" });
      rows.push({ label: "Cal (grueso)", value: `${Math.ceil((vol * 90) / 25)} bolsas`, hint: "cal hidratada" });
      rows.push({ label: "Arena (grueso)", value: `${nf(vol * 1.0, 2)} m³` });
    }
    if (doFino) {
      const vol = input.area * 0.005 * f; // 0,5 cm
      rows.push({ label: "Cal fina (fino)", value: `${Math.ceil((vol * 200) / 25)} bolsas`, hint: "revoque fino a la cal 0,5 cm" });
      rows.push({ label: "Arena fina (fino)", value: `${nf(vol * 1.0, 2)} m³` });
    }
    note = "Revoque tradicional. 'Completo' incluye grueso + fino. Ajustá el espesor según la pared.";
  }

  return { rows, note };
}

// ---------------------------------------------------------------- ROOF SHEET (chapa)
export function calcRoofSheet(input: {
  slope: number; // largo del faldón (m)
  width: number; // ancho a cubrir (m)
  usefulWidth: number; // ancho útil de la chapa (m)
  screwsPerM2: number;
}): CalcResult {
  const area = input.slope * input.width;
  const sheets = Math.ceil(input.width / input.usefulWidth);
  const linearM = sheets * input.slope;
  const screws = Math.ceil(area * input.screwsPerM2);
  const purlins = Math.ceil(input.slope / 1.2) + 1;
  const purlinM = purlins * input.width;

  return {
    rows: [
      { label: "Superficie de techo", value: `${nf(area, 2)} m²` },
      { label: "Chapas", value: `${sheets} u`, hint: `de ${nf(input.slope, 1)} m de largo` },
      { label: "Metros lineales de chapa", value: `${nf(linearM, 1)} m` },
      { label: "Tornillos autoperforantes", value: `${nf(screws)} u`, hint: `~${input.screwsPerM2}/m²` },
      { label: "Correas / clavaderas", value: `${nf(purlinM, 1)} m`, hint: `${purlins} líneas cada ~1,2 m` },
    ],
    note: "Ancho útil típico: sinusoidal ~0,98 m, trapezoidal ~1,00 m. Respetá el solape lateral y longitudinal.",
  };
}

// ---------------------------------------------------------------- CONTRAPISO
export function calcContrapiso(input: {
  area: number;
  thickness: number; // cm
  waste: number;
}): CalcResult {
  const vol = input.area * (input.thickness / 100) * (1 + input.waste / 100);

  return {
    rows: [
      { label: "Volumen de contrapiso", value: `${nf(vol, 2)} m³`, hint: `${nf(input.area, 2)} m² × ${nf(input.thickness, 0)} cm` },
      { label: "Cemento", value: `${Math.ceil(vol * 5)} bolsas`, hint: "bolsas de 50 kg" },
      { label: "Cal", value: `${Math.ceil(vol * 1)} bolsas`, hint: "cal hidratada 25 kg" },
      { label: "Arena", value: `${nf(vol * 0.45, 2)} m³` },
      { label: "Cascote / piedra", value: `${nf(vol * 0.9, 2)} m³` },
    ],
    note: "Contrapiso de cascote. Para contrapiso alivianado o bajo cerámica ajustá la dosificación.",
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
