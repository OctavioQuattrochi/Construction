import Link from "next/link";
import { Pencil, Trash2, Wrench, Save, X, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/db";
import { AdminHeader, ConfirmSubmit, Field, inputClass } from "@/components/admin/ui";
import { saveService, deleteService } from "@/app/admin/actions";
import { DynamicIcon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

const ICONS = [
  "Compass",
  "ClipboardCheck",
  "PencilRuler",
  "HardHat",
  "Building2",
  "Ruler",
  "Hammer",
  "Layers",
];

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const services = await db.service.findMany({ orderBy: { order: "asc" } });
  const editing = edit ? services.find((s) => s.id === edit) : null;

  return (
    <div>
      <AdminHeader
        title="Servicios"
        description="Los servicios que se muestran en la página principal."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Form */}
        <form
          action={saveService}
          className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-8"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-900">
              {editing ? "Editar servicio" : "Nuevo servicio"}
            </h2>
            {editing && (
              <Link
                href="/admin/servicios"
                className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
              >
                <X className="h-4 w-4" /> Cancelar
              </Link>
            )}
          </div>

          <Field label="Título">
            <input name="title" required defaultValue={editing?.title} className={inputClass} />
          </Field>
          <Field label="Slug">
            <input name="slug" defaultValue={editing?.slug} className={inputClass} />
          </Field>
          <Field label="Resumen breve">
            <input name="summary" required defaultValue={editing?.summary} className={inputClass} />
          </Field>
          <Field label="Descripción">
            <textarea name="description" required rows={3} defaultValue={editing?.description} className={inputClass} />
          </Field>
          <Field label="Características" hint="Separadas por | (barra vertical).">
            <textarea
              name="features"
              rows={2}
              defaultValue={editing?.features}
              placeholder="Análisis|Revisión|Segunda opinión"
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ícono">
              <select name="icon" defaultValue={editing?.icon ?? "HardHat"} className={inputClass}>
                {ICONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Orden">
              <input name="order" type="number" defaultValue={editing?.order ?? 0} className={inputClass} />
            </Field>
          </div>
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink-700">Publicado</span>
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
            {editing ? "Guardar cambios" : "Crear servicio"}
          </button>
        </form>

        {/* List */}
        <div>
          {services.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
              <Wrench className="h-10 w-10 text-ink-300" />
              <p className="mt-3 text-sm text-ink-500">Todavía no hay servicios.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-amber-400">
                    <DynamicIcon name={s.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-ink-900">{s.title}</p>
                      <span className={`text-xs ${s.published ? "text-emerald-600" : "text-ink-400"}`}>
                        {s.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </span>
                    </div>
                    <p className="truncate text-xs text-ink-400">{s.summary}</p>
                  </div>
                  <Link
                    href={`/admin/servicios?edit=${s.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:border-ink-900"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                  <form action={deleteService}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmSubmit message={`¿Eliminar el servicio “${s.title}”?`}>
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
