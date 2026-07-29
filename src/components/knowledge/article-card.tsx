import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface ArticleCardData {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  readMinutes: number;
  createdAt: Date | string;
  author?: string;
  category?: { name: string; color: string; slug: string } | null;
}

export function ArticleCard({
  article,
  featured = false,
}: {
  article: ArticleCardData;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/conocimiento/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes={featured ? "(max-width:768px) 100vw, 66vw" : "(max-width:768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {article.category && (
          <span
            className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
            style={{ backgroundColor: `${article.category.color}dd` }}
          >
            {article.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <span>{formatDate(article.createdAt)}</span>
          <span className="h-1 w-1 rounded-full bg-ink-200" />
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readMinutes} min
          </span>
        </div>

        <h3
          className={`mt-3 font-display font-semibold leading-snug text-ink-900 transition-colors group-hover:text-amber-700 ${
            featured ? "text-2xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
          {article.excerpt}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-800">
          Leer artículo
          <ArrowUpRight className="h-4 w-4 text-amber-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
