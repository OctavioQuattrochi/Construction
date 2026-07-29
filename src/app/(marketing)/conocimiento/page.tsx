import type { Metadata } from "next";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ArticleCard } from "@/components/knowledge/article-card";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { getArticles, getCategories } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Centro de Conocimiento",
  description:
    "Artículos técnicos, guías de construcción y consejos profesionales para tomar mejores decisiones en tu obra.",
};

export const dynamic = "force-dynamic";

export default async function ConocimientoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const search = params.q?.trim() || "";
  const cat = params.cat || "";

  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticles({ search, categorySlug: cat || undefined }),
  ]);

  const hasFilters = Boolean(search || cat);
  const featured = !hasFilters ? articles.find((a) => a.featured) : undefined;
  const rest = featured ? articles.filter((a) => a.id !== featured.id) : articles;

  return (
    <>
      <PageHeader
        eyebrow="Centro de Conocimiento"
        title={
          <>
            Construí con información,{" "}
            <span className="text-gradient-amber">no con suposiciones</span>
          </>
        }
        description="Guías técnicas y artículos prácticos escritos desde la experiencia real en obra. Aprendé a evitar los errores más costosos de la construcción."
      >
        <form action="/conocimiento" className="max-w-lg">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 pl-5 backdrop-blur-md">
            <Search className="h-5 w-5 text-concrete-400" />
            <input
              name="q"
              defaultValue={search}
              placeholder="Buscar artículos…"
              className="w-full bg-transparent py-3 text-white placeholder:text-concrete-500 focus:outline-none"
            />
            <button className="m-1 rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-amber-400">
              Buscar
            </button>
          </div>
        </form>
      </PageHeader>

      <section className="container-x py-12">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip href="/conocimiento" active={!cat && !search}>
            Todos
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              href={`/conocimiento?cat=${c.slug}`}
              active={cat === c.slug}
              color={c.color}
            >
              {c.name}
            </FilterChip>
          ))}
          {hasFilters && (
            <Link
              href="/conocimiento"
              className="ml-auto inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
            >
              <X className="h-4 w-4" /> Limpiar
            </Link>
          )}
        </div>

        {search && (
          <p className="mt-6 text-ink-500">
            {articles.length} resultado(s) para{" "}
            <span className="font-medium text-ink-900">“{search}”</span>
          </p>
        )}

        {articles.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
            <h3 className="font-display text-lg font-semibold text-ink-900">
              No encontramos artículos
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              Probá con otro término o explorá todas las categorías.
            </p>
            <Link
              href="/conocimiento"
              className="mt-4 inline-block text-sm font-medium text-amber-600 hover:underline"
            >
              Ver todos los artículos
            </Link>
          </div>
        ) : (
          <>
            {featured && (
              <div className="mt-8">
                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <ArticleCard article={featured} featured />
                  <div className="flex flex-col justify-center rounded-3xl border border-ink-100 bg-concrete-50 p-8">
                    <span className="eyebrow">Artículo destacado</span>
                    <h2 className="mt-3 font-display text-2xl font-bold text-ink-900">
                      Lo más importante que deberías leer antes de construir
                    </h2>
                    <p className="mt-3 text-ink-500">
                      Seleccionamos el contenido con mayor impacto para tu obra.
                      Empezá por acá y evitá los errores más comunes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <StaggerGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <StaggerItem key={a.id}>
                  <ArticleCard article={a} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </>
        )}
      </section>
    </>
  );
}

function FilterChip({
  href,
  active,
  color,
  children,
}: {
  href: string;
  active: boolean;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-ink-900 bg-ink-900 text-white"
          : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900"
      )}
      style={active && color ? { backgroundColor: color, borderColor: color } : undefined}
    >
      {children}
    </Link>
  );
}
