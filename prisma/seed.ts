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
