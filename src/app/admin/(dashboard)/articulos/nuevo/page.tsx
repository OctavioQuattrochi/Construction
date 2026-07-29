import { db } from "@/lib/db";
import { ArticleForm } from "@/components/admin/article-form";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  return <ArticleForm categories={categories} />;
}
