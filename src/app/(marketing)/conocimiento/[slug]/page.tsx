import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries";
import { markdownToHtml } from "@/lib/markdown";
import { formatDate, toList } from "@/lib/utils";
import { ArticleCard } from "@/components/knowledge/article-card";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artículo no encontrado" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  const related = await getRelatedArticles(article.id, article.categoryId);
  const html = markdownToHtml(article.content);
  const tags = toList(article.tags);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Person", name: article.author },
    datePublished: new Date(article.createdAt).toISOString(),
    image: article.coverImage || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pb-24 pt-28 md:pt-32">
        <div className="container-x">
          <Link
            href="/conocimiento"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Centro de Conocimiento
          </Link>

          <div className="mx-auto mt-8 max-w-3xl">
            {article.category && (
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </span>
            )}
            <h1 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-tight text-ink-900 sm:text-4xl md:text-[2.75rem]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-ink-100 py-4 text-sm text-ink-500">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-amber-500" /> {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-500" />
                {formatDate(article.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" /> {article.readMinutes} min de lectura
              </span>
            </div>
          </div>
        </div>

        {article.coverImage && (
          <div className="container-x mt-10">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] shadow-elevated">
              <Image
                src={article.coverImage}
                alt={article.title}
                width={1400}
                height={800}
                priority
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="container-x mt-12">
          <div
            className="prose-article mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {tags.length > 0 && (
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-500"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Author / CTA */}
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl bg-ink-950 p-8 text-white md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-concrete-400">Escrito por</p>
                <p className="mt-1 font-display text-xl font-semibold">
                  {article.author}
                </p>
                <p className="text-sm text-concrete-400">Equipo de {site.company}</p>
              </div>
              <ButtonLink href="/contacto" variant="primary">
                Consultar por mi obra
              </ButtonLink>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-ink-100 bg-concrete-50 py-20">
          <div className="container-x">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold text-ink-900">
                Seguí leyendo
              </h2>
              <Link
                href="/conocimiento"
                className="text-sm font-medium text-amber-600 hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
