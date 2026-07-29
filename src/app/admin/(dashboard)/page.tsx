import Link from "next/link";
import {
  FileText,
  FolderTree,
  Wrench,
  Inbox,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [articles, published, categories, services, messages, unread, recent] =
      await Promise.all([
        db.article.count(),
        db.article.count({ where: { published: true } }),
        db.category.count(),
        db.service.count(),
        db.contactMessage.count(),
        db.contactMessage.count({ where: { handled: false } }),
        db.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);
    return { articles, published, categories, services, messages, unread, recent };
  } catch {
    return {
      articles: 0,
      published: 0,
      categories: 0,
      services: 0,
      messages: 0,
      unread: 0,
      recent: [],
    };
  }
}

export default async function DashboardPage() {
  const s = await getStats();

  const cards = [
    { label: "Artículos", value: s.articles, sub: `${s.published} publicados`, icon: FileText, href: "/admin/articulos", color: "#0b5cab" },
    { label: "Categorías", value: s.categories, sub: "activas", icon: FolderTree, href: "/admin/categorias", color: "#f0a500" },
    { label: "Servicios", value: s.services, sub: "en el sitio", icon: Wrench, href: "/admin/servicios", color: "#0a7d3e" },
    { label: "Mensajes", value: s.messages, sub: `${s.unread} sin leer`, icon: Inbox, href: "/admin/mensajes", color: "#c0392b" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">
          Panel de control
        </h1>
        <p className="mt-1.5 text-ink-500">
          Resumen de tu plataforma. Gestioná contenido, servicios y consultas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: c.color }}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-ink-900">
              {c.value}
            </p>
            <p className="text-sm text-ink-400">
              {c.label} · {c.sub}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-900">
              Mensajes recientes
            </h2>
            <Link href="/admin/mensajes" className="text-sm font-medium text-amber-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 divide-y divide-ink-100">
            {s.recent.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-400">
                Todavía no hay mensajes.
              </p>
            )}
            {s.recent.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-900">{m.name}</p>
                  <p className="truncate text-sm text-ink-400">
                    {m.subject || m.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-400">
                  {!m.handled && (
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                  )}
                  {formatDate(m.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-ink-950 p-6 text-white shadow-soft">
          <TrendingUp className="h-6 w-6 text-amber-400" />
          <h2 className="mt-3 font-display text-lg font-semibold">
            Accesos rápidos
          </h2>
          <div className="mt-4 space-y-2">
            <Link href="/admin/articulos/nuevo" className="block rounded-xl bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10">
              + Escribir un artículo
            </Link>
            <Link href="/admin/servicios" className="block rounded-xl bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10">
              Editar servicios de la home
            </Link>
            <Link href="/admin/categorias" className="block rounded-xl bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10">
              Administrar categorías
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
