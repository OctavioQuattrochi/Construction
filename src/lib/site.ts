// Central site configuration — single source of truth for brand + contact info.

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
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hola@bildap.com.ar",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "5493511234567",
  get whatsappUrl() {
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(
      "Hola BildAp, quisiera hacer una consulta sobre mi proyecto."
    )}`;
  },
} as const;

export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Conocimiento", href: "/conocimiento" },
  { label: "Calculadoras", href: "/calculadoras" },
  { label: "Comparador", href: "/comparador" },
  { label: "Profesionales", href: "/profesionales" },
  { label: "Inmuebles", href: "/inmuebles" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const footerNav = {
  Plataforma: [
    { label: "Servicios", href: "/#servicios" },
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
