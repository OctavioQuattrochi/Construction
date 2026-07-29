// Central site configuration — single source of truth for brand + contact info.

export const site = {
  name: "Quattrochi",
  brand: "Estudio Quattrochi",
  tagline: "Arquitectura, obra y decisiones técnicas con criterio.",
  description:
    "Plataforma de referencia en construcción: contenido técnico, calculadoras, comparador de precios de materiales y consultoría profesional con más de 40 años de experiencia.",
  owner: "Juan Carlos Quattrochi",
  ownerTitle: "Arquitecto · MP 40 años de trayectoria",
  location: "Córdoba, Argentina",
  region: "Córdoba",
  country: "Argentina",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "estudio@quattrochi.com.ar",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "5493511234567",
  get whatsappUrl() {
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(
      "Hola, quisiera hacer una consulta profesional sobre mi proyecto."
    )}`;
  },
} as const;

export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Centro de Conocimiento", href: "/conocimiento" },
  { label: "Calculadoras", href: "/calculadoras" },
  { label: "Comparador", href: "/comparador" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const footerNav = {
  Plataforma: [
    { label: "Servicios", href: "/#servicios" },
    { label: "Sobre Juan Carlos", href: "/#sobre" },
    { label: "Preguntas frecuentes", href: "/#faq" },
    { label: "Contacto", href: "/contacto" },
  ],
  Herramientas: [
    { label: "Calculadoras", href: "/calculadoras" },
    { label: "Comparador de precios", href: "/comparador" },
    { label: "Centro de Conocimiento", href: "/conocimiento" },
  ],
  Legal: [
    { label: "Términos", href: "/terminos" },
    { label: "Privacidad", href: "/privacidad" },
  ],
};
