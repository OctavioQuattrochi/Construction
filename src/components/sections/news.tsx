import { Newspaper, ArrowUpRight } from "lucide-react";
import { getNews } from "@/lib/queries";
import { Section, SectionHeading } from "@/components/ui/section";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";

// Noticias de la construcción curadas por el admin. Si no hay, no renderiza nada.
export async function News() {
  const news = await getNews(3);
  if (news.length === 0) return null;

  return (
    <Section className="bg-concrete-50">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Actualidad"
          title="Noticias de la construcción"
          description="Lo que pasa en el rubro, seleccionado por el equipo de BildAp."
        />
      </div>

      <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
        {news.map((n) => (
          <StaggerItem key={n.id}>
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
                {n.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.image}
                    alt={n.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-300">
                    <Newspaper className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                  {n.source}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink-900">
                  {n.title}
                </h3>
                {n.summary && (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-500">
                    {n.summary}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink-700 group-hover:text-amber-700">
                  Leer nota <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
