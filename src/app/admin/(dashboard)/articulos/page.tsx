import Link from "next/link";
import { Pencil, Trash2, Star, Eye, EyeOff, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AdminHeader, ConfirmSubmit } from "@/components/admin/ui";
import { deleteArticle } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await db.article.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminHeader
        title="Artículos"
        description="Gestioná el contenido del Centro de Conocimiento."
        action={{ href: "/admin/articulos/nuevo", label: "Nuevo artículo" }}
      />

      {articles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
          <div className="divide-y divide-ink-100">
            {articles.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {a.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <Star className="h-3 w-3" /> Destacado
                      </span>
                    )}
                    {a.category && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: a.category.color }}
                      >
                        {a.category.name}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 text-xs ${
                        a.published ? "text-emerald-600" : "text-ink-400"
                      }`}
                    >
                      {a.published ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      {a.published ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                  <h3 className="mt-1.5 truncate font-medium text-ink-900">
                    {a.title}
                  </h3>
                  <p className="text-xs text-ink-400">
                    {formatDate(a.createdAt)} · {a.readMinutes} min · /{a.slug}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/articulos/${a.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmSubmit message={`¿Eliminar “${a.title}”?`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
      <FileText className="h-10 w-10 text-ink-300" />
      <h3 className="mt-4 font-display font-semibold text-ink-900">
        Todavía no hay artículos
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        Creá el primer artículo del Centro de Conocimiento.
      </p>
      <Link
        href="/admin/articulos/nuevo"
        className="mt-4 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
      >
        Nuevo artículo
      </Link>
    </div>
  );
}
