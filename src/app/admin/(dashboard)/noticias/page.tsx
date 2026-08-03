import Link from "next/link";
import { Pencil, Trash2, Newspaper, Save, X, Eye, EyeOff, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { AdminHeader, ConfirmSubmit, Field, inputClass } from "@/components/admin/ui";
import { saveNews, deleteNews } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const news = await db.news.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  const editing = edit ? news.find((n) => n.id === edit) : null;

  return (
    <div>
      <AdminHeader
        title="Noticias"
        description="Noticias de la construcción que se muestran en la home (links a medios)."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Form */}
        <form
          action={saveNews}
          className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-8"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-900">
              {editing ? "Editar noticia" : "Nueva noticia"}
            </h2>
            {editing && (
              <Link
                href="/admin/noticias"
                className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
              >
                <X className="h-4 w-4" /> Cancelar
              </Link>
            )}
          </div>

          <Field label="Título">
            <input name="title" required defaultValue={editing?.title} className={inputClass} />
          </Field>
          <Field label="Resumen breve" hint="Opcional.">
            <textarea name="summary" rows={2} defaultValue={editing?.summary ?? ""} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Medio / fuente">
              <input name="source" required defaultValue={editing?.source} placeholder="La Voz del Interior" className={inputClass} />
            </Field>
            <Field label="Orden">
              <input name="order" type="number" defaultValue={editing?.order ?? 0} className={inputClass} />
            </Field>
          </div>
          <Field label="Link a la nota (URL)">
            <input name="url" required type="url" defaultValue={editing?.url} placeholder="https://…" className={inputClass} />
          </Field>
          <Field label="Imagen (URL)" hint="Opcional.">
            <input name="image" defaultValue={editing?.image ?? ""} placeholder="https://…" className={inputClass} />
          </Field>
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink-700">Publicada</span>
            <input
              type="checkbox"
              name="published"
              defaultChecked={editing ? editing.published : true}
              className="h-5 w-5 accent-amber-500"
            />
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3 font-medium text-white transition-colors hover:bg-ink-800"
          >
            <Save className="h-4 w-4" />
            {editing ? "Guardar cambios" : "Crear noticia"}
          </button>
        </form>

        {/* List */}
        <div>
          {news.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
              <Newspaper className="h-10 w-10 text-ink-300" />
              <p className="mt-3 text-sm text-ink-500">Todavía no hay noticias.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {news.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-ink-900">{n.title}</p>
                      <span className={n.published ? "text-emerald-600" : "text-ink-400"}>
                        {n.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </span>
                    </div>
                    <p className="flex items-center gap-1 truncate text-xs text-ink-400">
                      {n.source} · <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 hover:text-amber-600">ver <ExternalLink className="h-3 w-3" /></a>
                    </p>
                  </div>
                  <Link
                    href={`/admin/noticias?edit=${n.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:border-ink-900"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                  <form action={deleteNews}>
                    <input type="hidden" name="id" value={n.id} />
                    <ConfirmSubmit message={`¿Eliminar la noticia “${n.title}”?`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </ConfirmSubmit>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
