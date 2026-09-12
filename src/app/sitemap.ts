import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, freq: "weekly" as const },
    { path: "/conocimiento", priority: 0.9, freq: "weekly" as const },
    { path: "/comparador", priority: 0.9, freq: "daily" as const },
    { path: "/calculadoras", priority: 0.9, freq: "weekly" as const },
    { path: "/inmuebles", priority: 0.8, freq: "daily" as const },
    { path: "/profesionales", priority: 0.8, freq: "weekly" as const },
    { path: "/mi-obra", priority: 0.7, freq: "weekly" as const },
    { path: "/contacto", priority: 0.7, freq: "monthly" as const },
    { path: "/terminos", priority: 0.2, freq: "yearly" as const },
    { path: "/privacidad", priority: 0.2, freq: "yearly" as const },
  ].map(({ path, priority, freq }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  // Las páginas de detalle son contenido indexable real: si la base no está
  // disponible durante el build, el sitemap sale igual con las rutas fijas.
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [articles, properties] = await Promise.all([
      db.article.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      db.property.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    dynamicRoutes = [
      ...articles.map((a) => ({
        url: `${base}/conocimiento/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...properties.map((p) => ({
        url: `${base}/inmuebles/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    /* base no disponible durante el build */
  }

  return [...staticRoutes, ...dynamicRoutes];
}
