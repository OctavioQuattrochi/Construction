// Central site configuration — single source of truth for brand + contact info.

/** Dominio público canónico. Vive acá porque no es un secreto y no cambia. */
export const PRODUCTION_URL = "https://bildap.com.ar";

/**
 * URL base del sitio, en orden de prioridad:
 *  1. NEXT_PUBLIC_SITE_URL (lo que se configura en Netlify)
 *  2. el dominio de producción, si estamos en un build de producción
 *  3. localhost, para desarrollo
 *
 * El paso 2 evita el peor escenario: que la variable falte en producción y los
 * canonical/OG del sitio terminen apuntando a localhost.
 */
function siteUrl(): string {
  const isProd = process.env.NODE_ENV === "production";
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  if (fromEnv) {
    // Las URLs *.netlify.app son del deploy, no el dominio público: si los
    // canonical/OG apuntaran ahí, el posicionamiento se repartiría entre dos
    // dominios y las previews competirían con producción como contenido
    // duplicado. En un build de producción siempre gana el dominio canónico.
    // Si el valor no es una URL válida (típico: olvidarse el https://) no
    // rompemos el build: se ignora y se usa el dominio canónico.
    let host: string | null = null;
    try {
      host = new URL(fromEnv).hostname;
    } catch {
      host = null;
    }
    if (host) {
      const isDeployUrl = /\.netlify\.app$/i.test(host);
      if (!(isProd && isDeployUrl)) return fromEnv;
    }
  }

  return isProd ? PRODUCTION_URL : "http://localhost:3000";
}

export const site = {
  name: "BildAp",
  brand: "BildAp",
  tagline: "La plataforma para construir con criterio.",
  description:
    "BildAp es la plataforma de referencia en construcción: guías técnicas, calculadoras de materiales, comparador de precios entre proveedores, red de profesionales asociados y servicio inmobiliario. Pensada para Córdoba y toda Argentina.",
  // Identidad de empresa (no de un profesional individual).
  company: "BildAp",
  companyTagline: "Construcción · Tecnología · Comunidad",
  location: "Córdoba, Argentina",
  region: "Córdoba",
  country: "Argentina",
  url: siteUrl(),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hola@bildap.com.ar",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "5493511234567",
  get whatsappUrl() {
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(
      "Hola BildAp, quisiera hacer una consulta sobre mi proyecto."
    )}`;
  },
} as const;

// Navegación principal. "Mi obra" es el corazón de la plataforma y va primero.
// Se mantiene corta a propósito: "Contacto" ya está en el botón "Consultar" y
// "Servicios" es un ancla de la home (ambos viven en el footer).
export const nav = [
  { label: "Mi obra", href: "/mi-obra" },
  { label: "Calculadoras", href: "/calculadoras" },
  { label: "Comparador", href: "/comparador" },
  { label: "Profesionales", href: "/profesionales" },
  { label: "Inmuebles", href: "/inmuebles" },
  { label: "Conocimiento", href: "/conocimiento" },
] as const;

export const footerNav = {
  Plataforma: [
    { label: "Soluciones", href: "/#servicios" },
    { label: "Sobre BildAp", href: "/#sobre" },
    { label: "Preguntas frecuentes", href: "/#faq" },
    { label: "Contacto", href: "/contacto" },
  ],
  Herramientas: [
    { label: "Calculadoras", href: "/calculadoras" },
    { label: "Comparador de precios", href: "/comparador" },
    { label: "Centro de Conocimiento", href: "/conocimiento" },
  ],
  Comunidad: [
    { label: "Profesionales", href: "/profesionales" },
    { label: "Inmuebles", href: "/inmuebles" },
    { label: "Sumar mi empresa", href: "/contacto" },
  ],
  Legal: [
    { label: "Términos", href: "/terminos" },
    { label: "Privacidad", href: "/privacidad" },
  ],
};
