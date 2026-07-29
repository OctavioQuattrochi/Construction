import Link from "next/link";
import type { Article, Category } from "@prisma/client";
import { ArrowLeft, Save } from "lucide-react";
import { saveArticle } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/admin/ui";

export function ArticleForm({
  article,
  categories,
}: {
  article?: Article | null;
  categories: Category[];
}) {
  const isEdit = Boolean(article);
  return (
    <div>
      <Link
        href="/admin/articulos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a artículos
      </Link>

      <form action={saveArticle} className="mt-5">
        {article && <input type="hidden" name="id" value={article.id} />}

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Main */}
          <div className="space-y-5 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft md:p-8">
            <h1 className="font-display text-xl font-bold text-ink-900">
              {isEdit ? "Editar artículo" : "Nuevo artículo"}
            </h1>

            <Field label="Título">
              <input
                name="title"
                required
                defaultValue={article?.title}
                placeholder="Ej: Cómo elegir el cemento correcto"
                className={inputClass}
              />
            </Field>

            <Field label="Slug (URL)" hint="Se genera del título si lo dejás vacío.">
              <input
                name="slug"
                defaultValue={article?.slug}
                placeholder="elegir-cemento-correcto"
                className={inputClass}
              />
            </Field>

            <Field label="Resumen" hint="Aparece en las tarjetas y en SEO.">
              <textarea
                name="excerpt"
                required
                rows={2}
                defaultValue={article?.excerpt}
                placeholder="Breve descripción del artículo…"
                className={inputClass}
              />
            </Field>

            <Field label="Contenido (Markdown)" hint="Soporta ##, ###, listas (-), citas (>), **negrita**, [links](/).">
              <textarea
                name="content"
                required
                rows={18}
                defaultValue={article?.content}
                placeholder={"## Subtítulo\n\nTu contenido acá…"}
                className={`${inputClass} font-mono text-sm leading-relaxed`}
              />
            </Field>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
              <h2 className="font-display font-semibold text-ink-900">Publicación</h2>

              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink-700">Publicado</span>
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={article ? article.published : true}
                  className="h-5 w-5 accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink-700">Destacado</span>
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={article?.featured}
                  className="h-5 w-5 accent-amber-500"
                />
              </label>

              <Field label="Categoría">
                <select
                  name="categoryId"
                  defaultValue={article?.categoryId ?? ""}
                  className={inputClass}
                >
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Minutos de lectura" hint="0 = calcular automáticamente.">
                <input
                  name="readMinutes"
                  type="number"
                  min={0}
                  defaultValue={article?.readMinutes ?? 0}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
              <h2 className="font-display font-semibold text-ink-900">Detalles</h2>
              <Field label="Imagen de portada (URL)">
                <input
                  name="coverImage"
                  defaultValue={article?.coverImage ?? ""}
                  placeholder="https://…"
                  className={inputClass}
                />
              </Field>
              <Field label="Autor">
                <input
                  name="author"
                  defaultValue={article?.author ?? "Juan Carlos Quattrochi"}
                  className={inputClass}
                />
              </Field>
              <Field label="Etiquetas" hint="Separadas por coma.">
                <input
                  name="tags"
                  defaultValue={article?.tags ?? ""}
                  placeholder="cemento, materiales"
                  className={inputClass}
                />
              </Field>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-medium text-ink-950 transition-colors hover:bg-amber-400"
            >
              <Save className="h-4 w-4" />
              {isEdit ? "Guardar cambios" : "Crear artículo"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
