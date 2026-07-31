"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  BrickWall,
  PaintRoller,
  LayoutGrid,
  Layers,
  Layers2,
  RotateCcw,
  ShieldPlus,
  Frame,
  Rows3,
  Shovel,
  Boxes,
  Cylinder,
  Grip,
  Warehouse,
  Grid3x3,
} from "lucide-react";
import { Input, Label, Select } from "@/components/ui/field";
import { SaveCalculationButton } from "@/components/calculators/save-calculation-button";
import { BudgetPanel } from "@/components/calculators/budget-panel";
import { cn } from "@/lib/utils";
import {
  calcConcrete,
  calcBricks,
  calcMortar,
  calcPaint,
  calcFlooring,
  calcMembrane,
  calcDrywall,
  calcSkirting,
  calcExcavation,
  calcFoundation,
  calcPiles,
  calcSteel,
  calcPlaster,
  calcRoofSheet,
  calcContrapiso,
  type CalcResult,
  type StructElement,
} from "@/lib/calculators";

type FieldType = "number" | "select";
interface Field {
  key: string;
  label: string;
  type: FieldType;
  default: number | string;
  min?: number;
  step?: number;
  suffix?: string;
  options?: { value: string; label: string }[];
  full?: boolean;
}
interface CalcDef {
  id: string;
  name: string;
  category: string;
  icon: typeof Box;
  blurb: string;
  fields: Field[];
  compute: (v: Record<string, number | string>) => CalcResult;
}

// Orden de las etapas de obra.
const CATEGORIES = [
  "Movimiento de suelos",
  "Fundaciones",
  "Estructura",
  "Mampostería",
  "Revoques",
  "Techos",
  "Pisos y revestimientos",
  "Cielorrasos y tabiques",
  "Terminaciones",
] as const;

const num = (v: Record<string, number | string>, k: string) => Number(v[k]);

const CALCS: CalcDef[] = [
  {
    id: "hormigon",
    name: "Hormigón",
    category: "Estructura",
    icon: Box,
    blurb: "Losas, platea, contrapiso y bases.",
    fields: [
      { key: "length", label: "Largo", type: "number", default: 4, min: 0, step: 0.1, suffix: "m" },
      { key: "width", label: "Ancho", type: "number", default: 3, min: 0, step: 0.1, suffix: "m" },
      { key: "thickness", label: "Espesor", type: "number", default: 10, min: 1, step: 1, suffix: "cm" },
      {
        key: "grade",
        label: "Resistencia",
        type: "select",
        default: "H21",
        options: [
          { value: "H17", label: "H17 · contrapisos" },
          { value: "H21", label: "H21 · uso general" },
          { value: "H30", label: "H30 · estructural" },
        ],
      },
      { key: "waste", label: "Desperdicio", type: "number", default: 8, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcConcrete({
        length: num(v, "length"),
        width: num(v, "width"),
        thickness: num(v, "thickness"),
        grade: v.grade as "H17" | "H21" | "H30",
        waste: num(v, "waste"),
      }),
  },
  {
    id: "ladrillos",
    name: "Ladrillos",
    category: "Mampostería",
    icon: BrickWall,
    blurb: "Cantidad de piezas y mortero de asiento.",
    fields: [
      { key: "length", label: "Largo del muro", type: "number", default: 5, min: 0, step: 0.1, suffix: "m" },
      { key: "height", label: "Alto del muro", type: "number", default: 2.6, min: 0, step: 0.1, suffix: "m" },
      { key: "openings", label: "Aberturas", type: "number", default: 0, min: 0, step: 0.1, suffix: "m²" },
      {
        key: "type",
        label: "Tipo de pieza",
        type: "select",
        default: "hueco18",
        full: true,
        options: [
          { value: "hueco12", label: "Hueco 8×18×33" },
          { value: "hueco18", label: "Hueco 12×18×33" },
          { value: "comun", label: "Común macizo" },
          { value: "bloque19", label: "Bloque hormigón 19×19×39" },
        ],
      },
      { key: "waste", label: "Desperdicio", type: "number", default: 5, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcBricks({
        length: num(v, "length"),
        height: num(v, "height"),
        openings: num(v, "openings"),
        type: v.type as "hueco12" | "hueco18" | "comun" | "bloque19",
        waste: num(v, "waste"),
      }),
  },
  {
    id: "mortero",
    name: "Mortero",
    category: "Mampostería",
    icon: Layers,
    blurb: "Revoques, carpetas y asiento.",
    fields: [
      { key: "area", label: "Superficie", type: "number", default: 20, min: 0, step: 0.5, suffix: "m²" },
      {
        key: "use",
        label: "Uso",
        type: "select",
        default: "revoque_grueso",
        full: true,
        options: [
          { value: "asiento", label: "Mortero de asiento" },
          { value: "revoque_grueso", label: "Revoque grueso" },
          { value: "revoque_fino", label: "Revoque fino a la cal" },
          { value: "carpeta", label: "Carpeta de piso" },
        ],
      },
      { key: "thickness", label: "Espesor", type: "number", default: 2, min: 0.5, step: 0.5, suffix: "cm" },
      { key: "waste", label: "Desperdicio", type: "number", default: 10, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcMortar({
        area: num(v, "area"),
        use: v.use as "asiento" | "revoque_grueso" | "revoque_fino" | "carpeta",
        thickness: num(v, "thickness"),
        waste: num(v, "waste"),
      }),
  },
  {
    id: "pintura",
    name: "Pintura",
    category: "Terminaciones",
    icon: PaintRoller,
    blurb: "Litros y baldes según rendimiento.",
    fields: [
      { key: "area", label: "Superficie a pintar", type: "number", default: 40, min: 0, step: 1, suffix: "m²" },
      { key: "openings", label: "Descuento aberturas", type: "number", default: 4, min: 0, step: 0.5, suffix: "m²" },
      { key: "coats", label: "Manos", type: "number", default: 2, min: 1, step: 1, suffix: "" },
      { key: "yield", label: "Rendimiento", type: "number", default: 10, min: 1, step: 0.5, suffix: "m²/L" },
      { key: "waste", label: "Desperdicio", type: "number", default: 5, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcPaint({
        area: num(v, "area"),
        openings: num(v, "openings"),
        coats: num(v, "coats"),
        yield: num(v, "yield"),
        waste: num(v, "waste"),
      }),
  },
  {
    id: "pisos",
    name: "Pisos",
    category: "Pisos y revestimientos",
    icon: LayoutGrid,
    blurb: "Piezas, cajas y adhesivo.",
    fields: [
      { key: "length", label: "Largo del ambiente", type: "number", default: 4, min: 0, step: 0.1, suffix: "m" },
      { key: "width", label: "Ancho del ambiente", type: "number", default: 3, min: 0, step: 0.1, suffix: "m" },
      { key: "pieceW", label: "Ancho pieza", type: "number", default: 60, min: 1, step: 1, suffix: "cm" },
      { key: "pieceH", label: "Alto pieza", type: "number", default: 60, min: 1, step: 1, suffix: "cm" },
      { key: "perBox", label: "Piezas por caja", type: "number", default: 3, min: 1, step: 1, suffix: "" },
      { key: "waste", label: "Desperdicio", type: "number", default: 10, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcFlooring({
        length: num(v, "length"),
        width: num(v, "width"),
        pieceW: num(v, "pieceW"),
        pieceH: num(v, "pieceH"),
        perBox: num(v, "perBox"),
        waste: num(v, "waste"),
      }),
  },
  {
    id: "membrana",
    name: "Membrana",
    category: "Techos",
    icon: ShieldPlus,
    blurb: "Impermeabilización de techos.",
    fields: [
      { key: "length", label: "Largo del techo", type: "number", default: 6, min: 0, step: 0.1, suffix: "m" },
      { key: "width", label: "Ancho del techo", type: "number", default: 4, min: 0, step: 0.1, suffix: "m" },
      { key: "overlap", label: "Solape", type: "number", default: 12, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcMembrane({
        length: num(v, "length"),
        width: num(v, "width"),
        overlap: num(v, "overlap"),
      }),
  },
  {
    id: "durlock",
    name: "Durlock",
    category: "Cielorrasos y tabiques",
    icon: Frame,
    blurb: "Tabiques de construcción en seco.",
    fields: [
      { key: "length", label: "Largo del tabique", type: "number", default: 4, min: 0, step: 0.1, suffix: "m" },
      { key: "height", label: "Alto del tabique", type: "number", default: 2.6, min: 0, step: 0.1, suffix: "m" },
      {
        key: "sides",
        label: "Caras a placar",
        type: "select",
        default: "2",
        options: [
          { value: "1", label: "1 cara" },
          { value: "2", label: "2 caras" },
        ],
      },
      { key: "waste", label: "Desperdicio", type: "number", default: 10, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcDrywall({
        length: num(v, "length"),
        height: num(v, "height"),
        sides: num(v, "sides"),
        waste: num(v, "waste"),
      }),
  },
  {
    id: "zocalos",
    name: "Zócalos",
    category: "Terminaciones",
    icon: Rows3,
    blurb: "Metros lineales de zócalo.",
    fields: [
      { key: "perimeter", label: "Perímetro del ambiente", type: "number", default: 14, min: 0, step: 0.1, suffix: "m" },
      { key: "openings", label: "Ancho de puertas", type: "number", default: 0.9, min: 0, step: 0.1, suffix: "m" },
      { key: "pieceLength", label: "Largo por pieza", type: "number", default: 2.4, min: 0.1, step: 0.1, suffix: "m" },
      { key: "waste", label: "Desperdicio", type: "number", default: 8, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcSkirting({
        perimeter: num(v, "perimeter"),
        openings: num(v, "openings"),
        pieceLength: num(v, "pieceLength"),
        waste: num(v, "waste"),
      }),
  },
  {
    id: "excavacion",
    name: "Excavación",
    category: "Movimiento de suelos",
    icon: Shovel,
    blurb: "Volumen de suelo y volquetes a retirar.",
    fields: [
      { key: "length", label: "Largo", type: "number", default: 10, min: 0, step: 0.1, suffix: "m" },
      { key: "width", label: "Ancho", type: "number", default: 8, min: 0, step: 0.1, suffix: "m" },
      { key: "depth", label: "Profundidad", type: "number", default: 0.5, min: 0, step: 0.1, suffix: "m" },
      { key: "bulking", label: "Esponjamiento", type: "number", default: 25, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcExcavation({
        length: num(v, "length"),
        width: num(v, "width"),
        depth: num(v, "depth"),
        bulking: num(v, "bulking"),
      }),
  },
  {
    id: "bases",
    name: "Bases",
    category: "Fundaciones",
    icon: Boxes,
    blurb: "Hormigón y hierro para bases aisladas.",
    fields: [
      { key: "count", label: "Cantidad de bases", type: "number", default: 6, min: 1, step: 1, suffix: "u" },
      { key: "length", label: "Largo", type: "number", default: 1, min: 0, step: 0.1, suffix: "m" },
      { key: "width", label: "Ancho", type: "number", default: 1, min: 0, step: 0.1, suffix: "m" },
      { key: "height", label: "Alto", type: "number", default: 0.4, min: 0, step: 0.05, suffix: "m" },
      {
        key: "grade",
        label: "Resistencia",
        type: "select",
        full: true,
        default: "H21",
        options: [
          { value: "H17", label: "H17" },
          { value: "H21", label: "H21 · uso general" },
          { value: "H30", label: "H30 · estructural" },
        ],
      },
    ],
    compute: (v) =>
      calcFoundation({
        count: num(v, "count"),
        length: num(v, "length"),
        width: num(v, "width"),
        height: num(v, "height"),
        grade: v.grade as "H17" | "H21" | "H30",
      }),
  },
  {
    id: "pilotines",
    name: "Pilotines",
    category: "Fundaciones",
    icon: Cylinder,
    blurb: "Hormigón para pilotines cilíndricos.",
    fields: [
      { key: "count", label: "Cantidad", type: "number", default: 12, min: 1, step: 1, suffix: "u" },
      { key: "diameter", label: "Diámetro", type: "number", default: 20, min: 5, step: 1, suffix: "cm" },
      { key: "depth", label: "Profundidad", type: "number", default: 2, min: 0.1, step: 0.1, suffix: "m" },
      {
        key: "grade",
        label: "Resistencia",
        type: "select",
        full: true,
        default: "H21",
        options: [
          { value: "H17", label: "H17" },
          { value: "H21", label: "H21 · uso general" },
          { value: "H30", label: "H30 · estructural" },
        ],
      },
    ],
    compute: (v) =>
      calcPiles({
        count: num(v, "count"),
        diameter: num(v, "diameter"),
        depth: num(v, "depth"),
        grade: v.grade as "H17" | "H21" | "H30",
      }),
  },
  {
    id: "hierro",
    name: "Hierro",
    category: "Estructura",
    icon: Grip,
    blurb: "Cuantía de acero por m³ de hormigón.",
    fields: [
      { key: "volume", label: "Volumen de hormigón", type: "number", default: 2, min: 0, step: 0.1, suffix: "m³" },
      {
        key: "element",
        label: "Elemento",
        type: "select",
        full: true,
        default: "losa",
        options: [
          { value: "losa", label: "Losa" },
          { value: "viga", label: "Viga" },
          { value: "columna", label: "Columna" },
          { value: "base", label: "Base" },
          { value: "platea", label: "Platea" },
          { value: "encadenado", label: "Encadenado" },
        ],
      },
    ],
    compute: (v) =>
      calcSteel({
        volume: num(v, "volume"),
        element: v.element as StructElement,
      }),
  },
  {
    id: "revoque",
    name: "Revoque",
    category: "Revoques",
    icon: Layers2,
    blurb: "Grueso, fino, completo o monocapa.",
    fields: [
      { key: "area", label: "Superficie a revocar", type: "number", default: 30, min: 0, step: 0.5, suffix: "m²" },
      {
        key: "type",
        label: "Tipo de revoque",
        type: "select",
        full: true,
        default: "completo",
        options: [
          { value: "grueso", label: "Solo grueso" },
          { value: "fino", label: "Solo fino" },
          { value: "completo", label: "Completo (grueso + fino)" },
          { value: "monocapa", label: "Monocapa" },
        ],
      },
      { key: "waste", label: "Desperdicio", type: "number", default: 10, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcPlaster({
        area: num(v, "area"),
        type: v.type as "grueso" | "fino" | "completo" | "monocapa",
        waste: num(v, "waste"),
      }),
  },
  {
    id: "chapa",
    name: "Chapa",
    category: "Techos",
    icon: Warehouse,
    blurb: "Chapas, tornillos y correas.",
    fields: [
      { key: "slope", label: "Largo del faldón", type: "number", default: 6, min: 0, step: 0.1, suffix: "m" },
      { key: "width", label: "Ancho a cubrir", type: "number", default: 8, min: 0, step: 0.1, suffix: "m" },
      { key: "usefulWidth", label: "Ancho útil chapa", type: "number", default: 1, min: 0.5, step: 0.01, suffix: "m" },
      { key: "screwsPerM2", label: "Tornillos", type: "number", default: 7, min: 1, step: 1, suffix: "/m²" },
    ],
    compute: (v) =>
      calcRoofSheet({
        slope: num(v, "slope"),
        width: num(v, "width"),
        usefulWidth: num(v, "usefulWidth"),
        screwsPerM2: num(v, "screwsPerM2"),
      }),
  },
  {
    id: "contrapiso",
    name: "Contrapiso",
    category: "Pisos y revestimientos",
    icon: Grid3x3,
    blurb: "Cemento, cal, arena y cascote.",
    fields: [
      { key: "area", label: "Superficie", type: "number", default: 30, min: 0, step: 0.5, suffix: "m²" },
      { key: "thickness", label: "Espesor", type: "number", default: 8, min: 1, step: 1, suffix: "cm" },
      { key: "waste", label: "Desperdicio", type: "number", default: 8, min: 0, step: 1, suffix: "%" },
    ],
    compute: (v) =>
      calcContrapiso({
        area: num(v, "area"),
        thickness: num(v, "thickness"),
        waste: num(v, "waste"),
      }),
  },
];

function initialValues(def: CalcDef): Record<string, number | string> {
  return Object.fromEntries(def.fields.map((f) => [f.key, f.default]));
}

// Arranca por la primera calculadora de la primera etapa de obra.
const FIRST_ID =
  CALCS.find((c) => c.category === CATEGORIES[0])?.id ?? CALCS[0].id;

export function CalculatorsClient({ isMember = false }: { isMember?: boolean }) {
  const [activeId, setActiveId] = useState(FIRST_ID);
  const active = CALCS.find((c) => c.id === activeId)!;
  const [values, setValues] = useState(() => initialValues(active));

  const result = useMemo(() => {
    try {
      return active.compute(values);
    } catch {
      return null;
    }
  }, [active, values]);

  function switchTo(id: string) {
    const def = CALCS.find((c) => c.id === id)!;
    setActiveId(id);
    setValues(initialValues(def));
  }

  function switchCategory(cat: string) {
    const first = CALCS.find((c) => c.category === cat);
    if (first) switchTo(first.id);
  }

  const calcsInCategory = CALCS.filter((c) => c.category === active.category);

  return (
    <div>
      {/* Categorías (etapas de obra) */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active.category;
          return (
            <button
              key={cat}
              onClick={() => switchCategory(cat)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "border-amber-500 bg-amber-500 text-ink-950"
                  : "border-ink-200 bg-white text-ink-500 hover:border-ink-400 hover:text-ink-900"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Calculadoras de la categoría */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {calcsInCategory.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => switchTo(c.id)}
              className={cn(
                "group relative flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "border-ink-900 bg-ink-900 text-white shadow-soft"
                  : "border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900"
              )}
            >
              <c.icon
                className={cn("h-4 w-4", isActive ? "text-amber-400" : "text-ink-400")}
              />
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        {/* Inputs */}
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-900 text-amber-400">
                <active.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-900">
                  Calculadora de {active.name.toLowerCase()}
                </h2>
                <p className="text-sm text-ink-400">{active.blurb}</p>
              </div>
            </div>
            <button
              onClick={() => setValues(initialValues(active))}
              className="flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-500 transition-colors hover:border-ink-400 hover:text-ink-800"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {active.fields.map((f) => (
              <div key={f.key} className={cn(f.full && "sm:col-span-2")}>
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "select" ? (
                  <Select
                    id={f.key}
                    value={String(values[f.key])}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.key]: e.target.value }))
                    }
                  >
                    {f.options!.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <div className="relative">
                    <Input
                      id={f.key}
                      type="number"
                      inputMode="decimal"
                      min={f.min}
                      step={f.step}
                      value={String(values[f.key])}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          [f.key]:
                            e.target.value === "" ? "" : Number(e.target.value),
                        }))
                      }
                      className={cn(f.suffix && "pr-14")}
                    />
                    {f.suffix && (
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-400">
                        {f.suffix}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="overflow-hidden rounded-3xl border border-ink-900 bg-ink-950 text-white shadow-elevated">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-amber-400">
                  Resultado estimado
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">
                  Materiales necesarios
                </h3>
              </div>
              <span className="font-display text-sm font-bold text-white/70">
                Bild<span className="text-amber-400">Ap</span>
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + JSON.stringify(values)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="divide-y divide-white/5"
              >
                {result?.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div>
                      <p className="text-sm text-concrete-300">{row.label}</p>
                      {row.hint && (
                        <p className="mt-0.5 text-xs text-concrete-500">
                          {row.hint}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-mono text-lg font-semibold text-amber-400">
                      {row.value}
                    </span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {result?.note && (
              <p className="border-t border-white/10 px-6 py-4 text-xs leading-relaxed text-concrete-400">
                {result.note}
              </p>
            )}

            {result && (
              <div className="border-t border-white/10 px-6 py-4">
                <SaveCalculationButton
                  calcType={activeId}
                  calcName={active.name}
                  quantity={
                    Number(values.length) ||
                    Number(values.area) ||
                    Number(values.perimeter) ||
                    Number(values.slope) ||
                    Number(values.count) ||
                    Number(values.volume) ||
                    Number(values.width) ||
                    1
                  }
                  rows={result.rows}
                  budget={result.budget ?? []}
                  isMember={isMember}
                />
              </div>
            )}
          </div>

          {/* Presupuesto estimado */}
          {result && (
            <BudgetPanel budget={result.budget ?? []} isMember={isMember} />
          )}
        </div>
      </div>
    </div>
  );
}
