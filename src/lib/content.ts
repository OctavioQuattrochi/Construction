// Marketing content defaults. Also consumed by prisma/seed.ts so the DB and the
// static fallback stay in sync.

export const defaultServices = [
  {
    title: "Consultoría en construcción",
    slug: "consultoria",
    icon: "Compass",
    summary:
      "Asesoramiento técnico independiente antes, durante y después de tu obra.",
    description:
      "Analizamos tu proyecto, presupuesto y decisiones constructivas para que inviertas con criterio. Ideal para quienes construyen por primera vez o necesitan una segunda opinión profesional.",
    features:
      "Análisis de proyecto|Revisión de presupuestos|Segunda opinión técnica|Asesoramiento de materiales",
    order: 1,
  },
  {
    title: "Inspecciones y peritajes técnicos",
    slug: "peritajes",
    icon: "ClipboardCheck",
    summary:
      "Diagnóstico del estado de una construcción, patologías y su resolución.",
    description:
      "Detección de fisuras, humedades, problemas estructurales y vicios ocultos. Informes técnicos con validez profesional para compraventa, seguros o litigios.",
    features:
      "Detección de patologías|Informe técnico firmado|Peritaje para compraventa|Evaluación estructural",
    order: 2,
  },
  {
    title: "Arquitectura y proyecto",
    slug: "arquitectura",
    icon: "PencilRuler",
    summary:
      "Diseño de espacios funcionales, eficientes y con identidad propia.",
    description:
      "Desde el anteproyecto hasta la documentación técnica y municipal. Proyectos de vivienda, ampliaciones y refacciones pensados para tu forma de habitar y tu presupuesto.",
    features:
      "Anteproyecto y diseño|Documentación técnica|Trámites municipales|Ampliaciones y refacciones",
    order: 3,
  },
  {
    title: "Dirección y gestión de obra",
    slug: "direccion-de-obra",
    icon: "HardHat",
    summary:
      "Control profesional de tiempos, costos y calidad de ejecución.",
    description:
      "Coordinación de gremios, control de avance, certificaciones y cumplimiento del proyecto. Tu obra ejecutada según lo proyectado, sin sobrecostos evitables.",
    features:
      "Coordinación de gremios|Control de avance y costos|Certificación de obra|Control de calidad",
    order: 4,
  },
];

export const defaultCategories = [
  {
    name: "Cimientos y estructura",
    slug: "estructura",
    color: "#0b5cab",
    description: "Fundaciones, hormigón armado y estabilidad estructural.",
  },
  {
    name: "Materiales",
    slug: "materiales",
    color: "#f0a500",
    description: "Guías de compra, calidad y uso correcto de materiales.",
  },
  {
    name: "Impermeabilización",
    slug: "impermeabilizacion",
    color: "#0a7d3e",
    description: "Humedad, membranas y protección contra el agua.",
  },
  {
    name: "Costos y presupuesto",
    slug: "costos",
    color: "#c0392b",
    description: "Cómo presupuestar y controlar el costo de tu obra.",
  },
];

export const faqs = [
  {
    q: "¿En qué zonas trabajan?",
    a: "Trabajamos principalmente en Córdoba capital y alrededores, con consultoría remota disponible para todo el país. La plataforma de contenido y herramientas es de acceso libre desde cualquier lugar.",
  },
  {
    q: "¿Necesito un arquitecto si mi obra es chica?",
    a: "Sí. Incluso en ampliaciones o refacciones pequeñas, una buena decisión técnica inicial evita sobrecostos, problemas estructurales y trámites mal gestionados. Una consulta puntual suele pagarse sola.",
  },
  {
    q: "¿Cómo funciona el comparador de precios?",
    a: "Buscás un material y el sistema consulta varios proveedores de Córdoba y Argentina, mostrando precio, marca, presentación y disponibilidad para que compares en un solo lugar. Los datos incluyen la fecha de obtención.",
  },
  {
    q: "¿Las calculadoras son confiables?",
    a: "Usan dosificaciones y rendimientos estándar de la construcción y son excelentes para estimar y presupuestar. Para obras de responsabilidad estructural, siempre deben validarse con un profesional.",
  },
  {
    q: "¿Hacen peritajes para compraventa o seguros?",
    a: "Sí. Emitimos informes técnicos firmados que sirven para operaciones de compraventa, reclamos a seguros, consorcios o instancias judiciales.",
  },
  {
    q: "¿Cuánto cuesta una consultoría?",
    a: "Depende del alcance. Ofrecemos desde consultas puntuales hasta acompañamiento integral de obra. Escribinos por WhatsApp o el formulario de contacto y te pasamos un presupuesto sin cargo.",
  },
];

export const aboutBio = {
  years: 40,
  highlights: [
    "Más de cuatro décadas dirigiendo y proyectando obras.",
    "Peritajes técnicos con validez profesional y judicial.",
    "Enfoque práctico: soluciones reales, no teoría.",
    "Acompañamiento honesto, cuidando tu presupuesto.",
  ],
};
