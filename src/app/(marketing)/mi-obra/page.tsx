import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HardHat, ArrowRight, MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Field, inputClass } from "@/components/admin/ui";
import { SubmitButton } from "@/components/ui/loading";
import { getMemberSession } from "@/lib/member-auth";
import { listObrasFor } from "@/lib/obra-access";
import { formatCurrency } from "@/lib/utils";
import { createObra } from "./actions";

export const metadata: Metadata = {
  title: "Mi obra",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  planificacion: "En planificación",
  ejecucion: "En ejecución",
  pausada: "Pausada",
  terminada: "Terminada",
};

export default async function MiObraPage() {
  const member = await getMemberSession();
  if (!member) redirect("/ingresar");

  // Incluye las obras propias y aquellas a las que fue invitado.
  const obras = await listObrasFor(member);

  return (
    <>
      <PageHeader
        eyebrow="Mi obra"
        title={
          <>
            Tu obra, <span className="text-gradient-amber">bajo control</span>
          </>
        }
        description="Organizá el presupuesto, los materiales, los gastos y el avance de tu obra en un solo lugar."
      />

      <section className="container-x py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Lista */}
          <div>
            {obras.length === 0 ? (
              <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
                <HardHat className="h-12 w-12 text-ink-300" />
                <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
                  Todavía no creaste tu obra
                </h2>
                <p className="mt-1 max-w-md text-ink-500">
                  Creá tu primera obra y empezá a controlar presupuesto, materiales
                  y avance. Es gratis.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {obras.map((o) => {
                  const presupuesto = o.rubros.reduce((s, r) => s + r.budgeted, 0);
                  const gastado = o.expenses.reduce((s, e) => s + e.amount, 0);
                  const avance = o.rubros.length
                    ? Math.round(
                        o.rubros.reduce((s, r) => s + r.progress, 0) / o.rubros.length
                      )
                    : 0;
                  return (
                    <Link
                      key={o.id}
                      href={`/mi-obra/${o.id}`}
                      className="block rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-bold text-ink-900">
                            {o.name}
                          </h3>
                          {o.location && (
                            <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-400">
                              <MapPin className="h-3.5 w-3.5" /> {o.location}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
                            {statusLabel[o.status] ?? o.status}
                          </span>
                          {o.shared && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-medium text-ink-600">
                              {o.myRole === "editor" ? "Compartida · cargás avance" : "Compartida · sólo mirás"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink-100 pt-4 text-sm">
                        <div>
                          <p className="text-xs text-ink-400">Presupuesto</p>
                          <p className="font-semibold text-ink-900">
                            {formatCurrency(presupuesto)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-400">Gastado</p>
                          <p className="font-semibold text-ink-900">
                            {formatCurrency(gastado)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-400">Avance</p>
                          <p className="font-semibold text-amber-600">{avance}%</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Crear */}
          <form
            action={createObra}
            className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-24"
          >
            <h2 className="flex items-center gap-2 font-display font-semibold text-ink-900">
              <Plus className="h-4 w-4 text-amber-500" /> Nueva obra
            </h2>
            <Field label="Nombre de la obra">
              <input name="name" required placeholder="Casa familia Pérez" className={inputClass} />
            </Field>
            <Field label="Ubicación" hint="Opcional.">
              <input name="location" placeholder="Córdoba" className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Inicio">
                <input name="startDate" type="date" className={inputClass} />
              </Field>
              <Field label="Entrega estimada">
                <input name="estimatedEnd" type="date" className={inputClass} />
              </Field>
            </div>
            <Field label="Estado">
              <select name="status" className={inputClass} defaultValue="planificacion">
                <option value="planificacion">En planificación</option>
                <option value="ejecucion">En ejecución</option>
                <option value="pausada">Pausada</option>
                <option value="terminada">Terminada</option>
              </select>
            </Field>
            <SubmitButton
              pendingText="Creando tu obra…"
              className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-ink-950 hover:bg-amber-600"
            >
              Crear obra <ArrowRight className="h-4 w-4" />
            </SubmitButton>
            <p className="text-xs text-ink-400">
              Se crean las etapas típicas de obra para que sólo cargues tus montos.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
