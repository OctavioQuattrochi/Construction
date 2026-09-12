import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultServices, defaultCategories } from "../src/lib/content";
import { articles } from "./articles";
import { readingTime } from "../src/lib/utils";

const db = new PrismaClient();



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
    email: "laura.mmo@ejemplo.com.ar",
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
    // El tiempo de lectura se calcula del texto: así nunca queda inflado.
    const data = {
      ...rest,
      readMinutes: readingTime(a.content),
      categoryId: cat?.id ?? null,
    };
    await db.article.upsert({
      where: { slug: a.slug },
      update: data,
      create: data,
    });
  }
  console.log(`  ✓ ${articles.length} artículos`);

  // Normalizar autor a la marca de empresa.
  await db.article.updateMany({ data: { author: "Equipo BildAp" } });

  // Professionals — datos de ejemplo: se marcan como demo para etiquetarlos en la UI.
  for (const p of professionals) {
    const data = { ...p, demo: true };
    await db.professional.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }
  console.log(`  ✓ ${professionals.length} profesionales (demo)`);

  // Properties — idem.
  for (const pr of properties) {
    const data = { ...pr, demo: true };
    await db.property.upsert({
      where: { slug: pr.slug },
      update: data,
      create: data,
    });
  }
  console.log(`  ✓ ${properties.length} inmuebles (demo)`);

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
