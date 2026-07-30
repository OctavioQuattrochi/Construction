import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultServices, defaultCategories } from "../src/lib/content";

const db = new PrismaClient();

const articles = [
  {
    title: "Cómo elegir el cemento correcto para cada parte de tu obra",
    slug: "elegir-cemento-correcto",
    excerpt:
      "No todos los cementos sirven para lo mismo. Te explicamos las diferencias entre CPC, CPN y CPF y cuándo usar cada uno.",
    categorySlug: "materiales",
    coverImage:
      "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?auto=format&fit=crop&w=1400&q=80",
    tags: "cemento,materiales,estructura",
    featured: true,
    readMinutes: 6,
    content: `## El cemento no es todo igual

Uno de los errores más comunes en obra es comprar "cemento" sin fijarse en el tipo. En Argentina conviven varias clases y usar el equivocado puede afectar la resistencia y durabilidad de la estructura.

### Tipos más frecuentes

- **CPC (Cemento Portland Compuesto):** el más versátil y usado en obra general. Buena relación costo/desempeño.
- **CPN (Cemento Portland Normal):** mayor resistencia inicial, ideal para estructuras exigentes.
- **CPF (Cemento Portland con Filler):** más económico, apto para contrapisos y trabajos no estructurales.

### Recomendación práctica

Para columnas, vigas y losas priorizá un CPC40 o CPN. Para contrapisos y carpetas, un CPF rinde bien y cuida el presupuesto.

> Regla de oro: nunca uses cemento con más de 60 días de fabricación o que haya tomado humedad. Un cemento "apelmazado" perdió parte de su resistencia.

### Conservación

Guardá las bolsas sobre pallets, separadas del piso y de las paredes, y cubiertas de la humedad. Es la forma más barata de no tirar plata.`,
  },
  {
    title: "Humedad en paredes: causas reales y cómo resolverla de raíz",
    slug: "humedad-en-paredes-soluciones",
    excerpt:
      "La humedad no se tapa con pintura. Identificá si es ascendente, de filtración o de condensación y atacá la causa correcta.",
    categorySlug: "impermeabilizacion",
    coverImage:
      "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=1400&q=80",
    tags: "humedad,impermeabilizacion,patologias",
    featured: true,
    readMinutes: 7,
    content: `## Primero: identificar el tipo de humedad

Pintar sobre una mancha de humedad sin resolver la causa es tirar plata. Hay tres tipos y cada uno tiene su solución.

### 1. Humedad ascendente
Sube desde los cimientos por capilaridad. Se ve en la parte baja de las paredes. Solución: cortes de capilaridad (químicos o físicos) e hidrófugo en el revoque.

### 2. Humedad de filtración
Entra desde el exterior o desde cañerías. Aparece en manchas localizadas. Solución: reparar la fuente e impermeabilizar.

### 3. Condensación
Se forma por falta de ventilación y diferencias de temperatura. Solución: ventilación cruzada, aislación térmica y, a veces, deshumidificación.

### Cómo diagnosticar
Un truco simple: pegá un plástico transparente sobre la mancha durante 24 h. Si se moja del lado de la pared, es humedad interna; si se moja del lado del ambiente, es condensación.

Ante dudas, un peritaje evita gastar en soluciones que no atacan la causa.`,
  },
  {
    title: "Guía rápida para presupuestar una obra sin sorpresas",
    slug: "presupuestar-obra-sin-sorpresas",
    excerpt:
      "El presupuesto real de una obra no es solo materiales. Te mostramos los rubros que casi siempre se olvidan.",
    categorySlug: "costos",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
    tags: "presupuesto,costos,planificacion",
    featured: false,
    readMinutes: 8,
    content: `## El presupuesto es más que materiales

La mayoría subestima el costo de una obra porque solo cuenta materiales y mano de obra directa. Estos son los rubros que suelen faltar.

### Costos que se olvidan
- **Movimiento de suelo y limpieza del terreno.**
- **Conexiones de servicios** (agua, luz, cloacas).
- **Honorarios profesionales y trámites municipales.**
- **Andamios, alquiler de equipos y contenedores.**
- **Desperdicio de materiales** (10–15% según el rubro).

### Reserva de contingencia
Siempre dejá entre un **10% y 15%** del total como imprevistos. En construcción, siempre aparece algo.

### Cómo controlar el avance
Dividí la obra en etapas y certificá cada una antes de pagar. Nunca adelantes materiales que no vas a usar en las próximas semanas.

Usá el [comparador de precios](/comparador) y las [calculadoras](/calculadoras) de esta plataforma para armar un presupuesto realista.`,
  },
  {
    title: "Fundaciones: por qué el suelo define tu estructura",
    slug: "fundaciones-y-estudio-de-suelo",
    excerpt:
      "Antes de pensar en columnas, hay que entender el suelo. El estudio de suelos no es un lujo, es un seguro.",
    categorySlug: "estructura",
    coverImage:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=80",
    tags: "fundaciones,estructura,suelo",
    featured: false,
    readMinutes: 6,
    content: `## Todo empieza abajo

La estructura más cara puede fallar si las fundaciones no están bien resueltas. Y las fundaciones dependen del suelo.

### El estudio de suelos
Un estudio determina la capacidad portante y el tipo de fundación adecuada. En terrenos con arcillas expansivas o napas altas, es imprescindible.

### Tipos de fundación
- **Zapatas aisladas:** para cargas puntuales en suelos firmes.
- **Vigas de fundación:** distribuyen cargas en suelos menos homogéneos.
- **Plateas:** ideales para suelos de baja resistencia.
- **Pilotes:** cuando el suelo firme está a gran profundidad.

### El error más caro
Copiar la fundación del vecino. Cada terreno es distinto, incluso en la misma cuadra. Invertir en un estudio de suelos cuesta una fracción de lo que cuesta reparar una fundación mal calculada.`,
  },
  {
    title: "Ladrillo hueco vs. bloque de hormigón: cuál conviene",
    slug: "ladrillo-hueco-vs-bloque-hormigon",
    excerpt:
      "Comparamos costo, aislación, velocidad de ejecución y resistencia entre los dos sistemas más usados.",
    categorySlug: "materiales",
    coverImage:
      "https://images.unsplash.com/photo-1590986701408-9d6f2b9b1f3b?auto=format&fit=crop&w=1400&q=80",
    tags: "ladrillo,bloque,mamposteria,materiales",
    featured: false,
    readMinutes: 5,
    content: `## Dos sistemas, distintas lógicas

### Ladrillo hueco cerámico
- Mejor aislación térmica y acústica.
- Más liviano, buena terminación.
- Requiere más piezas por m².

### Bloque de hormigón
- Ejecución más rápida (piezas más grandes).
- Muy resistente, ideal para muros portantes.
- Necesita mejor aislación complementaria.

### ¿Cuál elegir?
Para vivienda con foco en confort térmico, el hueco cerámico suele ganar. Para obras donde prima la velocidad y la resistencia estructural, el bloque es competitivo.

Estimá cuántas piezas necesitás con la [calculadora de ladrillos](/calculadoras).`,
  },
  {
    title: "Impermeabilización de techos: membrana, pintura o cementicio",
    slug: "impermeabilizacion-de-techos",
    excerpt:
      "Cada sistema tiene su lugar. Te ayudamos a elegir según el tipo de techo y el clima de Córdoba.",
    categorySlug: "impermeabilizacion",
    coverImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    tags: "techos,impermeabilizacion,membrana",
    featured: false,
    readMinutes: 6,
    content: `## Proteger el techo es proteger todo lo demás

### Membrana asfáltica
El sistema más usado en losas planas. Buena durabilidad (8–12 años). Requiere buena ejecución en los solapes.

### Pinturas impermeabilizantes
Ideales para mantenimiento y superficies con poca pendiente. Fáciles de aplicar, pero de menor vida útil.

### Cementicios flexibles
Excelentes para zonas de contacto permanente con agua (terrazas, tanques). Se adhieren muy bien al sustrato.

### Consejo para Córdoba
Con la amplitud térmica de la región, priorizá sistemas flexibles que acompañen la dilatación del hormigón. Y respetá siempre las pendientes mínimas para el escurrimiento.`,
  },
];

const professionals = [
  {
    name: "Estudio Vértice Arquitectura",
    slug: "estudio-vertice",
    profession: "Arquitectura",
    bio: "Estudio de arquitectura con foco en vivienda unifamiliar y refacciones. Proyecto, dirección y documentación técnica en Córdoba capital.",
    location: "Córdoba Capital",
    whatsapp: "5493511111111",
    email: "hola@vertice.com.ar",
    specialties: "Vivienda|Refacciones|Dirección de obra|Documentación municipal",
    featured: true,
    order: 1,
  },
  {
    name: "Ing. Martín Sosa",
    slug: "ing-martin-sosa",
    profession: "Ingeniería Civil",
    bio: "Ingeniero civil especializado en cálculo estructural y fundaciones. Estudios de suelo y verificación de estructuras de hormigón armado.",
    location: "Córdoba Capital",
    whatsapp: "5493512222222",
    email: "msosa@ing.com.ar",
    specialties: "Cálculo estructural|Fundaciones|Estudio de suelos|Hormigón armado",
    featured: true,
    order: 2,
  },
  {
    name: "Constructora Del Sur",
    slug: "constructora-del-sur",
    profession: "Empresa Constructora",
    bio: "Empresa constructora llave en mano. Ejecutamos obra nueva, ampliaciones y remodelaciones con equipo propio y control de calidad.",
    location: "Villa Carlos Paz",
    whatsapp: "5493513333333",
    email: "obras@delsur.com.ar",
    specialties: "Obra nueva|Llave en mano|Ampliaciones|Gestión integral",
    featured: false,
    order: 3,
  },
  {
    name: "Laura Giménez — MMO",
    slug: "laura-gimenez-mmo",
    profession: "Maestro Mayor de Obra",
    bio: "Maestra mayor de obra con amplia trayectoria en dirección y ejecución. Coordinación de gremios y control de avance de obra.",
    location: "Río Cuarto",
    whatsapp: "5493514444444",
    email: "laura.mmo@gmail.com",
    specialties: "Dirección de obra|Coordinación de gremios|Presupuestos",
    featured: false,
    order: 4,
  },
  {
    name: "Estudio Térmico Eficiente",
    slug: "estudio-termico-eficiente",
    profession: "Eficiencia Energética",
    bio: "Asesoramiento en aislación térmica, etiquetado de viviendas y construcción sustentable. Reducí el consumo de tu casa.",
    location: "Córdoba Capital",
    whatsapp: "5493515555555",
    email: "info@termico.com.ar",
    specialties: "Aislación térmica|Etiquetado energético|Construcción sustentable",
    featured: false,
    order: 5,
  },
  {
    name: "Grupo Hidra — Instalaciones",
    slug: "grupo-hidra",
    profession: "Instalaciones",
    bio: "Instalaciones sanitarias, de gas y contra incendio. Matriculados para aprobación de planos y conexiones.",
    location: "Córdoba Capital",
    whatsapp: "5493516666666",
    email: "contacto@hidra.com.ar",
    specialties: "Sanitaria|Gas|Contra incendio|Planos aprobados",
    featured: false,
    order: 6,
  },
];

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

const properties = [
  {
    title: "Casa moderna 3 dormitorios en Valle Escondido",
    slug: "casa-valle-escondido-3-dorm",
    operation: "venta",
    type: "casa",
    price: 285000,
    currency: "USD",
    location: "Valle Escondido, Córdoba",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    coverImage: img("photo-1600585154340-be6161a56a0c"),
    images: `${img("photo-1600566753086-00f18fb6b3ea")}|${img("photo-1600607687939-ce8a6c25118c")}`,
    description:
      "Excelente casa a estrenar en barrio cerrado. Diseño contemporáneo, amplios ventanales, cocina integrada al living comedor y galería con parrillero. Pileta y jardín parquizado. Seguridad 24 hs.",
    agency: "Del Sur Propiedades",
    whatsapp: "5493513333333",
    featured: true,
  },
  {
    title: "Departamento 1 dormitorio a estrenar en Nueva Córdoba",
    slug: "depto-1-dorm-nueva-cordoba",
    operation: "alquiler",
    type: "departamento",
    price: 320000,
    currency: "ARS",
    location: "Nueva Córdoba, Córdoba",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    coverImage: img("photo-1522708323590-d24dbb6b0267"),
    images: "",
    description:
      "Departamento a estrenar a metros de la Ciudad Universitaria. Cocina equipada, balcón, edificio con SUM y cochera opcional. Ideal estudiantes o profesionales.",
    agency: "Centro Inmobiliaria",
    whatsapp: "5493517777777",
    featured: true,
  },
  {
    title: "Lote 600 m² en barrio cerrado Miradores de Manantiales",
    slug: "lote-manantiales-600",
    operation: "venta",
    type: "lote",
    price: 78000,
    currency: "USD",
    location: "Manantiales, Córdoba",
    area: 600,
    coverImage: img("photo-1500382017468-9049fed747ef"),
    images: "",
    description:
      "Lote apto para construir en barrio cerrado consolidado. Todos los servicios, calles asfaltadas y amenities. Financiación disponible.",
    agency: "Del Sur Propiedades",
    whatsapp: "5493513333333",
    featured: false,
  },
  {
    title: "Local comercial 80 m² sobre avenida principal",
    slug: "local-comercial-avenida",
    operation: "alquiler",
    type: "local",
    price: 650000,
    currency: "ARS",
    location: "Alta Córdoba, Córdoba",
    area: 80,
    bathrooms: 1,
    coverImage: img("photo-1441986300917-64674bd600d8"),
    images: "",
    description:
      "Local a la calle con gran vidriera sobre avenida de alto tránsito. Apto para gastronomía o comercio. Baño y depósito. Excelente ubicación.",
    agency: "Centro Inmobiliaria",
    whatsapp: "5493517777777",
    featured: false,
  },
];

async function main() {
  console.log("→ Seeding database...");

  // Admin user
  const email = process.env.ADMIN_EMAIL || "admin@construccion.com.ar";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hashed = await bcrypt.hash(password, 10);
  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administrador", password: hashed, role: "admin" },
  });
  console.log(`  ✓ Admin: ${email}`);

  // Categories
  for (const c of defaultCategories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, color: c.color, description: c.description },
      create: c,
    });
  }
  console.log(`  ✓ ${defaultCategories.length} categorías`);

  // Services
  for (const s of defaultServices) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`  ✓ ${defaultServices.length} servicios`);

  // Articles
  for (const a of articles) {
    const cat = await db.category.findUnique({
      where: { slug: a.categorySlug },
    });
    const { categorySlug, ...rest } = a;
    await db.article.upsert({
      where: { slug: a.slug },
      update: { ...rest, categoryId: cat?.id ?? null },
      create: { ...rest, categoryId: cat?.id ?? null },
    });
  }
  console.log(`  ✓ ${articles.length} artículos`);

  // Normalizar autor a la marca de empresa.
  await db.article.updateMany({ data: { author: "Equipo BildAp" } });

  // Professionals
  for (const p of professionals) {
    await db.professional.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`  ✓ ${professionals.length} profesionales`);

  // Properties
  for (const pr of properties) {
    await db.property.upsert({
      where: { slug: pr.slug },
      update: pr,
      create: pr,
    });
  }
  console.log(`  ✓ ${properties.length} inmuebles`);

  // Homepage editable content
  await db.siteContent.upsert({
    where: { key: "home_hero" },
    update: {},
    create: {
      key: "home_hero",
      value: JSON.stringify({
        headline: "Construí con criterio técnico, no con improvisación.",
        subline:
          "La plataforma de referencia para tomar decisiones de construcción.",
      }),
    },
  });

  console.log("✓ Seed completo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
