/**
 * Métricas de obra — única fuente de verdad.
 *
 * Antes el listado y el tablero calculaban el avance con fórmulas distintas
 * (promedio simple vs ponderado), así que la misma obra mostraba dos números.
 * Todo lo que necesite avance, presupuesto, gasto o etapa actual tiene que
 * usar estas funciones.
 *
 * La semántica es la que ya tenía el tablero: se conserva, no se reinventa.
 */

/** Lo mínimo que hace falta de un rubro/etapa para calcular métricas. */
export interface RubroLike {
  name: string;
  budgeted: number;
  progress: number;
  order?: number;
}

export interface ExpenseLike {
  amount: number;
}

export interface ObraMetrics {
  /** Suma de lo presupuestado por etapa. */
  presupuesto: number;
  /** Suma de los gastos registrados. */
  gastado: number;
  /** Presupuesto no ejecutado (nunca negativo). */
  pendiente: number;
  /** Avance 0-100 ponderado por presupuesto (promedio simple si no hay montos). */
  avance: number;
  /** Porcentaje del presupuesto ya gastado. */
  gastoPct: number;
  /** Señal temprana: se gastó bastante más de lo que se avanzó. */
  alerta: boolean;
  etapasTotal: number;
  etapasTerminadas: number;
}

/**
 * Avance global de la obra, 0-100.
 *
 * Ponderado por presupuesto: una etapa de $10M al 50% pesa más que una de $1M
 * al 100%. Si todavía no se cargaron montos, cae al promedio simple para que
 * el número no quede en cero apenas se crea la obra.
 */
export function obraProgress(rubros: RubroLike[]): number {
  if (rubros.length === 0) return 0;
  const presupuesto = rubros.reduce((s, r) => s + r.budgeted, 0);
  if (presupuesto > 0) {
    return Math.round(
      rubros.reduce((s, r) => s + (r.budgeted / presupuesto) * r.progress, 0)
    );
  }
  return Math.round(rubros.reduce((s, r) => s + r.progress, 0) / rubros.length);
}

/**
 * Etapa actual, lista para mostrar.
 *
 * Es la primera sin terminar siguiendo el orden de la obra; si ya arrancó
 * alguna, se prioriza esa. Distingue los tres casos, porque una obra sin
 * etapas cargadas no está "terminada": simplemente no tiene etapas.
 */
export function currentStage(rubros: RubroLike[]): string {
  if (rubros.length === 0) return "Sin etapas";
  const ordered = [...rubros].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const enCurso = ordered.find((r) => r.progress > 0 && r.progress < 100);
  if (enCurso) return enCurso.name;
  const proxima = ordered.find((r) => r.progress < 100);
  return proxima ? proxima.name : "Terminada";
}

/** Todas las métricas de una obra de una sola pasada. */
export function obraMetrics(
  rubros: RubroLike[],
  expenses: ExpenseLike[]
): ObraMetrics {
  const presupuesto = rubros.reduce((s, r) => s + r.budgeted, 0);
  const gastado = expenses.reduce((s, e) => s + e.amount, 0);
  const avance = obraProgress(rubros);
  const gastoPct = presupuesto > 0 ? Math.round((gastado / presupuesto) * 100) : 0;

  return {
    presupuesto,
    gastado,
    pendiente: Math.max(0, presupuesto - gastado),
    avance,
    gastoPct,
    alerta: presupuesto > 0 && gastoPct - avance >= 15,
    etapasTotal: rubros.length,
    etapasTerminadas: rubros.filter((r) => r.progress === 100).length,
  };
}

// ------------------------------------------------------------------ ETIQUETAS
export const PROJECT_TYPES = ["obra_nueva", "ampliacion", "refaccion"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const projectTypeLabel: Record<string, string> = {
  obra_nueva: "Obra nueva",
  ampliacion: "Ampliación",
  refaccion: "Refacción",
};

export const CURRENCIES = ["ARS", "USD"] as const;

export const statusLabel: Record<string, string> = {
  planificacion: "En planificación",
  ejecucion: "En ejecución",
  pausada: "Pausada",
  terminada: "Terminada",
};

/** Superficie formateada ("180 m²") o null si no se cargó. */
export function formatSurface(m2: number | null | undefined): string | null {
  if (m2 == null || m2 <= 0) return null;
  return `${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(m2)} m²`;
}
