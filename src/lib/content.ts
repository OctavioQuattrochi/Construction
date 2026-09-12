// Marketing content defaults. Also consumed by prisma/seed.ts so the DB and the
// static fallback stay in sync.

export const defaultServices = [
  {
    title: "Proyecto y planificación",
    slug: "proyecto-y-planificacion",
    icon: "PencilRuler",
    // El `summary` es la promesa corta que encabeza la tarjeta.
    summary: "Empezá tu obra con información clara.",
    description:
      "Antes de poner el primer ladrillo conviene saber qué se va a construir, en qué orden y cuánto cuesta. Te ayudamos a ordenar la idea, entender las etapas y llegar al inicio de obra con un plan realista.",
    features:
      "Planificación de proyectos|Guías para construir|Documentación y trámites|Ampliaciones y reformas",
    order: 1,
  },
  {
    title: "Control y seguimiento de obra",
    slug: "control-y-seguimiento",
    icon: "HardHat",
    summary: "Sabé qué está pasando en tu obra.",
    description:
      "Avance real por etapa, gastos registrados, materiales y libro de obra con fotos. El profesional carga los datos y el propietario los ve al día, desde el celular y sin llamados.",
    features:
      "Avance por etapa|Presupuesto y gastos|Materiales y compras|Libro de obra con fotos",
    order: 2,
  },
  {
    title: "Asesoramiento para construir",
    slug: "asesoramiento",
    icon: "Compass",
    summary: "Tomá decisiones con más información y menos incertidumbre.",
    description:
      "Una segunda mirada técnica antes de decidir. Revisamos presupuestos, comparamos alternativas y explicamos las implicancias de cada opción en plata, plazo y durabilidad.",
    features:
      "Análisis de presupuestos|Comparación de alternativas|Orientación sobre materiales|Revisión de proyectos|Consultas técnicas",
    order: 3,
  },
  {
    title: "Inspección y diagnóstico",
    slug: "inspeccion-y-diagnostico",
    icon: "ClipboardCheck",
    summary: "Detectá problemas antes de que sean más costosos.",
    description:
      "Humedades, fisuras y patologías que empeoran con el tiempo. Identificamos la causa real —no el síntoma— y te decimos qué hay que hacer, con qué urgencia y qué se puede esperar.",
    features:
      "Humedades y filtraciones|Fisuras y patologías|Evaluación del estado general|Inspección previa a una compra|Informes técnicos",
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
    q: "¿Qué es Mi Obra y quién la usa?",
    a: "Mi Obra es el seguimiento de obra de BildAp: avance por etapa, presupuesto, gastos, materiales y libro de obra con fotos. El profesional a cargo carga los datos y el propietario los ve al día desde el celular. También se puede usar solo, si estás construyendo por tu cuenta. Es gratis y necesita una cuenta.",
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
  /**
   * El fundador aporta la credibilidad; la plataforma aporta el valor. Por eso
   * aparece como respaldo profesional y no como protagonista: BildAp tiene que
   * poder existir con más profesionales además de él.
   */
  founder: {
    name: "Juan Carlos Quattrochi",
    role: "Arquitecto · Fundador de BildAp",
    blurb:
      "Más de 40 años proyectando, dirigiendo y peritando obras en Córdoba. Esa experiencia es la que define el criterio técnico de la plataforma: qué se recomienda, qué se advierte y qué no se afirma sin estar seguro.",
  },
  // Pilares de la empresa (no de un profesional individual).
  highlights: [
    "Una red de profesionales de la construcción a tu disposición.",
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
