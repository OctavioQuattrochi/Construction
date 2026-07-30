import Link from "next/link";
import { Pencil, Trash2, Building2, Save, X, Star, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/db";
import { AdminHeader, ConfirmSubmit, Field, inputClass } from "@/components/admin/ui";
import { saveProperty, deleteProperty } from "@/app/admin/actions";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const props = await db.property.findMany({ orderBy: { createdAt: "desc" } });
  const editing = edit ? props.find((p) => p.id === edit) : null;

  return (
    <div>
      <AdminHeader
        title="Inmuebles"
        description="Servicio inmobiliario: propiedades publicadas."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form
          action={saveProperty}
          className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-8"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-900">
              {editing ? "Editar inmueble" : "Nuevo inmueble"}
            </h2>
            {editing && (
              <Link href="/admin/inmuebles" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900">
                <X className="h-4 w-4" /> Cancelar
              </Link>
            )}
          </div>

          <Field label="Título">
            <input name="title" required defaultValue={editing?.title} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Operación">
              <select name="operation" defaultValue={editing?.operation ?? "venta"} className={inputClass}>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </Field>
            <Field label="Tipo">
              <select name="type" defaultValue={editing?.type ?? "casa"} className={inputClass}>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="lote">Lote</option>
                <option value="local">Local</option>
                <option value="oficina">Oficina</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <Field label="Precio" hint="Vacío = 'Consultar'">
              <input name="price" type="number" step="any" defaultValue={editing?.price ?? ""} className={inputClass} />
            </Field>
            <Field label="Moneda">
              <select name="currency" defaultValue={editing?.currency ?? "USD"} className={inputClass}>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </Field>
          </div>
          <Field label="Ubicación">
            <input name="location" required defaultValue={editing?.location} placeholder="Nueva Córdoba, Córdoba" className={inputClass} />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Dorm.">
              <input name="bedrooms" type="number" defaultValue={editing?.bedrooms ?? ""} className={inputClass} />
            </Field>
            <Field label="Baños">
              <input name="bathrooms" type="number" defaultValue={editing?.bathrooms ?? ""} className={inputClass} />
            </Field>
            <Field label="m²">
              <input name="area" type="number" step="any" defaultValue={editing?.area ?? ""} className={inputClass} />
            </Field>
          </div>
          <Field label="Descripción">
            <textarea name="description" required rows={4} defaultValue={editing?.description} className={inputClass} />
          </Field>
          <Field label="Imagen de portada (URL)">
            <input name="coverImage" defaultValue={editing?.coverImage ?? ""} placeholder="https://…" className={inputClass} />
          </Field>
          <Field label="Más imágenes" hint="URLs separadas por | (barra).">
            <textarea name="images" rows={2} defaultValue={editing?.images} placeholder="https://…|https://…" className={inputClass} />
          </Field>
          <Field label="Publicado por (inmobiliaria/constructora)">
            <input name="agency" required defaultValue={editing?.agency} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="WhatsApp">
              <input name="whatsapp" defaultValue={editing?.whatsapp ?? ""} className={inputClass} />
            </Field>
            <Field label="Teléfono">
              <input name="phone" defaultValue={editing?.phone ?? ""} className={inputClass} />
            </Field>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input type="checkbox" name="featured" defaultChecked={editing?.featured} className="h-5 w-5 accent-amber-500" /> Destacado
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input type="checkbox" name="published" defaultChecked={editing ? editing.published : true} className="h-5 w-5 accent-amber-500" /> Publicado
            </label>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3 font-medium text-white transition-colors hover:bg-ink-800">
            <Save className="h-4 w-4" /> {editing ? "Guardar cambios" : "Crear inmueble"}
          </button>
        </form>

        <div>
          {props.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
              <Building2 className="h-10 w-10 text-ink-300" />
              <p className="mt-3 text-sm text-ink-500">Todavía no hay inmuebles.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {props.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverImage} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-300">
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-ink-900">{p.title}</p>
                      {p.featured && <Star className="h-3.5 w-3.5 text-amber-500" />}
                      <span className={p.published ? "text-emerald-600" : "text-ink-400"}>
                        {p.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </span>
                    </div>
                    <p className="truncate text-xs text-ink-400">
                      {p.operation} · {p.type} · {p.price != null ? formatCurrency(p.price, p.currency) : "Consultar"} · {p.location}
                    </p>
                  </div>
                  <Link href={`/admin/inmuebles?edit=${p.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:border-ink-900">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                  <form action={deleteProperty}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmSubmit message={`¿Eliminar "${p.title}"?`}>
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
