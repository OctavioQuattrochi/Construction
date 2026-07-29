import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const staticRoutes = [
    "",
    "/conocimiento",
    "/calculadoras",
    "/comparador",
    "/contacto",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await db.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    articleRoutes = articles.map((a) => ({
      url: `${base}/conocimiento/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* db unavailable at build */
  }

  return [...staticRoutes, ...articleRoutes];
}
