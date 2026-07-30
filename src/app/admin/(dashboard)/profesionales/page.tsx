import Link from "next/link";
import { Pencil, Trash2, Users, Save, X, Star, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/db";
import { AdminHeader, ConfirmSubmit, Field, inputClass } from "@/components/admin/ui";
import { saveProfessional, deleteProfessional } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProfessionalsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const pros = await db.professional.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  const editing = edit ? pros.find((p) => p.id === edit) : null;

  return (
    <div>
      <AdminHeader
        title="Profesionales"
        description="Bolsa de trabajo: red de profesionales asociados."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          action={saveProfessional}
          className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-8"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-900">
              {editing ? "Editar profesional" : "Nuevo profesional"}
            </h2>
            {editing && (
              <Link href="/admin/profesionales" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900">
                <X className="h-4 w-4" /> Cancelar
              </Link>
            )}
          </div>

          <Field label="Nombre">
            <input name="name" required defaultValue={editing?.name} className={inputClass} />
          </Field>
          <Field label="Profesión">
            <input name="profession" required defaultValue={editing?.profession} placeholder="Arquitecto/a, Ing. Civil, MMO…" className={inputClass} />
          </Field>
          <Field label="Bio / descripción">
            <textarea name="bio" required rows={3} defaultValue={editing?.bio} className={inputClass} />
          </Field>
          <Field label="Especialidades" hint="Separadas por | (barra).">
            <input name="specialties" defaultValue={editing?.specialties} placeholder="Diseño|Dirección de obra|Peritajes" className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ubicación">
              <input name="location" defaultValue={editing?.location ?? "Córdoba"} className={inputClass} />
            </Field>
            <Field label="Orden">
              <input name="order" type="number" defaultValue={editing?.order ?? 0} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="WhatsApp" hint="Ej: 5493511234567">
              <input name="whatsapp" defaultValue={editing?.whatsapp ?? ""} className={inputClass} />
            </Field>
            <Field label="Teléfono">
              <input name="phone" defaultValue={editing?.phone ?? ""} className={inputClass} />
            </Field>
          </div>
          <Field label="Email">
            <input name="email" type="email" defaultValue={editing?.email ?? ""} className={inputClass} />
          </Field>
          <Field label="Foto (URL)">
            <input name="photo" defaultValue={editing?.photo ?? ""} placeholder="https://…" className={inputClass} />
          </Field>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input type="checkbox" name="featured" defaultChecked={editing?.featured} className="h-5 w-5 accent-amber-500" /> Destacado
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input type="checkbox" name="active" defaultChecked={editing ? editing.active : true} className="h-5 w-5 accent-amber-500" /> Activo
            </label>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3 font-medium text-white transition-colors hover:bg-ink-800">
            <Save className="h-4 w-4" /> {editing ? "Guardar cambios" : "Crear profesional"}
          </button>
        </form>

        <div>
          {pros.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
              <Users className="h-10 w-10 text-ink-300" />
              <p className="mt-3 text-sm text-ink-500">Todavía no hay profesionales.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pros.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-sm font-bold text-amber-400">
                    {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-ink-900">{p.name}</p>
                      {p.featured && <Star className="h-3.5 w-3.5 text-amber-500" />}
                      <span className={p.active ? "text-emerald-600" : "text-ink-400"}>
                        {p.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </span>
                    </div>
                    <p className="truncate text-xs text-ink-400">{p.profession} · {p.location}</p>
                  </div>
                  <Link href={`/admin/profesionales?edit=${p.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:border-ink-900">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                  <form action={deleteProfessional}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmSubmit message={`¿Eliminar a ${p.name}?`}>
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
