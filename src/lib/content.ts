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
    q: "¿Qué es BildAp?",
    a: "BildAp es una plataforma para la industria de la construcción: reúne guías técnicas, calculadoras de materiales, un comparador de precios entre proveedores, una red de profesionales asociados y un servicio inmobiliario. Todo en un mismo lugar para tomar mejores decisiones.",
  },
  {
    q: "¿En qué zonas opera?",
    a: "El foco inicial es Córdoba y Argentina, con servicios y proveedores locales. Las herramientas y el contenido son de acceso libre desde cualquier lugar, y la plataforma está pensada para expandirse a más regiones.",
  },
  {
    q: "¿Cómo funciona el comparador de precios?",
    a: "Buscás un material y el sistema consulta varios proveedores de Córdoba y Argentina, mostrando precio, marca, presentación y disponibilidad para que compares en un solo lugar. Cada resultado indica si el precio es en vivo o de referencia, y la fecha de obtención.",
  },
  {
    q: "¿Las calculadoras son confiables?",
    a: "Usan dosificaciones y rendimientos estándar de la construcción y son excelentes para estimar y presupuestar tus compras. Para obras con responsabilidad estructural, siempre conviene validarlas con un profesional de la red.",
  },
  {
    q: "Soy profesional o empresa, ¿puedo sumarme?",
    a: "Sí. Sumamos arquitectos, ingenieros, maestros mayores de obra y empresas a la red de profesionales, y permitimos a constructoras e inmobiliarias publicar inmuebles. Escribinos desde el formulario de contacto para conocer cómo participar.",
  },
  {
    q: "¿Tiene costo usar BildAp?",
    a: "El contenido, las calculadoras y el comparador son gratuitos para quien construye. Los profesionales y empresas que quieran destacarse en la red pueden acceder a planes de membresía (próximamente).",
  },
];

export const aboutBio = {
  years: 40,
  // Pilares de la empresa (no de un profesional individual).
  highlights: [
    "Una red de profesionales verificados a tu disposición.",
    "Herramientas técnicas gratuitas para planificar y presupuestar.",
    "Información transparente de precios y proveedores.",
    "Enfoque práctico: soluciones reales, no teoría.",
  ],
  pillars: [
    { title: "Conocimiento", desc: "Guías y artículos técnicos escritos por especialistas." },
    { title: "Herramientas", desc: "Calculadoras y comparador de precios en tiempo real." },
    { title: "Comunidad", desc: "Red de profesionales e inmuebles en un solo lugar." },
  ],
};
