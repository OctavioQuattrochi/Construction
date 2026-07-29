import Link from "next/link";
import { Pencil, Trash2, FolderTree, Save, X } from "lucide-react";
import { db } from "@/lib/db";
import { AdminHeader, ConfirmSubmit, Field, inputClass } from "@/components/admin/ui";
import { saveCategory, deleteCategory } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const categories = await db.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });
  const editing = edit ? categories.find((c) => c.id === edit) : null;

  return (
    <div>
      <AdminHeader
        title="Categorías"
        description="Organizá los artículos del Centro de Conocimiento."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Form */}
        <form
          action={saveCategory}
          className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-8"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-900">
              {editing ? "Editar categoría" : "Nueva categoría"}
            </h2>
            {editing && (
              <Link
                href="/admin/categorias"
                className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
              >
                <X className="h-4 w-4" /> Cancelar
              </Link>
            )}
          </div>

          <Field label="Nombre">
            <input
              name="name"
              required
              defaultValue={editing?.name}
              placeholder="Ej: Materiales"
              className={inputClass}
            />
          </Field>
          <Field label="Slug" hint="Se genera del nombre si lo dejás vacío.">
            <input
              name="slug"
              defaultValue={editing?.slug}
              placeholder="materiales"
              className={inputClass}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              name="description"
              rows={2}
              defaultValue={editing?.description ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Color">
            <div className="flex items-center gap-3">
              <input
                name="color"
                type="color"
                defaultValue={editing?.color ?? "#f0a500"}
                className="h-11 w-16 cursor-pointer rounded-lg border border-ink-200 bg-white p-1"
              />
              <span className="text-sm text-ink-400">Etiqueta de la categoría</span>
            </div>
          </Field>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3 font-medium text-white transition-colors hover:bg-ink-800"
          >
            <Save className="h-4 w-4" />
            {editing ? "Guardar cambios" : "Crear categoría"}
          </button>
        </form>

        {/* List */}
        <div>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
              <FolderTree className="h-10 w-10 text-ink-300" />
              <p className="mt-3 text-sm text-ink-500">
                Todavía no hay categorías.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
              <div className="divide-y divide-ink-100">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 p-4">
                    <span
                      className="h-9 w-9 shrink-0 rounded-xl"
                      style={{ backgroundColor: c.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink-900">{c.name}</p>
                      <p className="truncate text-xs text-ink-400">
                        /{c.slug} · {c._count.articles} artículo(s)
                      </p>
                    </div>
                    <Link
                      href={`/admin/categorias?edit=${c.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:border-ink-900"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Link>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmSubmit message={`¿Eliminar la categoría “${c.name}”?`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </ConfirmSubmit>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
