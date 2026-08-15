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

// ---- Embudo de herramientas ----
export const trackSearch = (query: string, results: number) =>
  track("comparador_busqueda", { query, results });

export const trackCalcDone = (calculator: string) =>
  track("calculo_realizado", { calculator });

export const trackCalcSaved = (calculator: string) =>
  track("calculo_guardado", { calculator });

export const trackBasketAdd = (product: string, store: string, price: number) =>
  track("lista_agregado", { product, store, price });

export const trackOfferClick = (store: string, product: string, live: boolean) =>
  track("oferta_click", { store, product, live });

// ---- Mi obra ----
export const trackObraCreated = () => track("obra_creada");

export const trackMaterialsToObra = (count: number, source: string) =>
  track("materiales_a_obra", { count, source });

// ---- Registro ----
export const trackSignupStart = () => track("registro_iniciado");

// ---- Red de profesionales (base del modelo de suscripción) ----
// Estos son los eventos que permiten decirle al profesional cuánta gente lo vio
// y cuántos lo contactaron. Se envía el slug para poder segmentar por perfil.
export const trackProProfileView = (slug: string, profession: string) =>
  track("profesional_visto", { profesional: slug, profesion: profession });

export const trackProContact = (
  slug: string,
  profession: string,
  channel: "whatsapp" | "email" | "telefono"
) =>
  track("profesional_contacto", {
    profesional: slug,
    profesion: profession,
    canal: channel,
  });

// ---- Inmuebles ----
export const trackPropertyView = (slug: string) =>
  track("inmueble_visto", { inmueble: slug });

export const trackPropertyContact = (
  slug: string,
  channel: "whatsapp" | "telefono"
) => track("inmueble_contacto", { inmueble: slug, canal: channel });
