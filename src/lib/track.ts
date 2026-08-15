"use client";

// Eventos de producto para GA4. No-op si no hay analytics configurado.
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Params) => void;
  }
}

export function track(event: string, params?: Params) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* nunca romper la UI por analítica */
  }
}

// Eventos clave del embudo.
export const trackSearch = (query: string, results: number) =>
  track("comparador_busqueda", { query, results });

export const trackCalcDone = (calculator: string) =>
  track("calculo_realizado", { calculator });

export const trackCalcSaved = (calculator: string) =>
  track("calculo_guardado", { calculator });

export const trackObraCreated = () => track("obra_creada");

export const trackMaterialsToObra = (count: number, source: string) =>
  track("materiales_a_obra", { count, source });

export const trackSignupStart = () => track("registro_iniciado");
