import { db } from "./db";
import { defaultServices, defaultCategories } from "./content";

// Data access with graceful fallback: if the DB is unreachable or empty the site
// still renders using the static defaults from content.ts.

export async function getServices() {
  try {
    const services = await db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (services.length) return services;
  } catch {
    /* fall through */
  }
  return defaultServices.map((s, i) => ({
    id: String(i),
    ...s,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getCategories() {
  try {
    const cats = await db.category.findMany({ orderBy: { name: "asc" } });
    if (cats.length) return cats;
  } catch {
    /* fall through */
  }
  return defaultCategories.map((c, i) => ({
    id: String(i),
    ...c,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export interface ArticleFilter {
  search?: string;
  categorySlug?: string;
  featured?: boolean;
  take?: number;
}

export async function getArticles(filter: ArticleFilter = {}) {
  try {
    const where: Record<string, unknown> = { published: true };
    if (filter.featured) where.featured = true;
    if (filter.categorySlug) where.category = { slug: filter.categorySlug };

    const articles = await db.article.findMany({
      where,
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: filter.search ? undefined : filter.take,
    });

    // Case-insensitive search filtered in JS so it works on SQLite and PostgreSQL.
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const filtered = articles.filter((a) =>
        `${a.title} ${a.excerpt} ${a.tags}`.toLowerCase().includes(q)
      );
      return filter.take ? filtered.slice(0, filter.take) : filtered;
    }
    return articles;
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    return await db.article.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch {
    return null;
  }
}

// ------------------------------------------------------------- PROFESSIONALS
export async function getProfessionals(filter: { profession?: string } = {}) {
  try {
    return await db.professional.findMany({
      where: {
        active: true,
        ...(filter.profession ? { profession: filter.profession } : {}),
      },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { name: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getProfessions() {
  try {
    const rows = await db.professional.findMany({
      where: { active: true },
      select: { profession: true },
      distinct: ["profession"],
      orderBy: { profession: "asc" },
    });
    return rows.map((r) => r.profession);
  } catch {
    return [];
  }
}

// ------------------------------------------------------------- PROPERTIES
export async function getProperties(
  filter: { operation?: string; type?: string } = {}
) {
  try {
    return await db.property.findMany({
      where: {
        published: true,
        ...(filter.operation ? { operation: filter.operation } : {}),
        ...(filter.type ? { type: filter.type } : {}),
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getPropertyBySlug(slug: string) {
  try {
    return await db.property.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

// ------------------------------------------------------------- FAVORITES
export async function getSavedRefIds(
  memberId: string,
  type: string
): Promise<Set<string>> {
  try {
    const items = await db.savedItem.findMany({
      where: { memberId, type },
      select: { refId: true },
    });
    return new Set(items.map((i) => i.refId));
  } catch {
    return new Set();
  }
}

export async function getSavedItems(memberId: string) {
  try {
    return await db.savedItem.findMany({
      where: { memberId },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

// ------------------------------------------------------------- NEWS
export async function getNews(take = 6) {
  try {
    return await db.news.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take,
    });
  } catch {
    return [];
  }
}

// ------------------------------------------------------------- CALCULATIONS
export async function getSavedCalculations(memberId: string) {
  try {
    return await db.savedCalculation.findMany({
      where: { memberId },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getRelatedArticles(articleId: string, categoryId: string | null) {
  try {
    return await db.article.findMany({
      where: {
        published: true,
        id: { not: articleId },
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
