import type { Metadata } from "next";
import Link from "next/link";
import { HardHat, ArrowRight, MapPin, Plus, Ruler, Archive } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Field, inputClass } from "@/components/admin/ui";
import { SubmitButton } from "@/components/ui/loading";
import { getMemberSession } from "@/lib/member-auth";
import { listObrasFor } from "@/lib/obra-access";
import { formatCurrency } from "@/lib/utils";
import {
  obraMetrics,
  currentStage,
  statusLabel,
  projectTypeLabel,
  formatSurface,
} from "@/lib/obra-metrics";
import { createObra, unarchiveObra } from "./actions";
import { MiObraLanding } from "@/components/obra/mi-obra-landing";

export const metadata: Metadata = {
  title: "Mi Obra — seguimiento de obra con presupuesto, avance y gastos",
  description:
    "Llevá tu obra en un solo lugar: presupuesto con línea base, avance por etapa, gastos, materiales y libro de obra con fotos. El profesional carga los datos y el propietario los ve al día. Gratis.",
};

export const dynamic = "force-dynamic";

export default async function MiObraPage({
  searchParams,
}: {
  searchParams: Promise<{ archivadas?: string }>;
}) {
  const member = await getMemberSession();
  // Sin sesión mostramos la portada que explica qué es Mi Obra, en vez de
  // mandar al login a ciegas. Es también lo que indexan los buscadores.
  if (!member) return <MiObraLanding />;

  const params = await searchParams;
  const verArchivadas = params.archivadas === "1";

  // Propias + invitadas. Por defecto sólo activas.
  const [obras, archivadas] = await Promise.all([
    listObrasFor(member, { archived: verArchivadas }),
    verArchivadas ? Promise.resolve([]) : listObrasFor(member, { archived: true }),
  ]);

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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                {verArchivadas ? "Obras archivadas" : "Mis obras"}
                {obras.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-ink-400">
                    {obras.length}
                  </span>
                )}
              </h2>
              {verArchivadas ? (
                <Link
                  href="/mi-obra"
                  className="text-sm font-medium text-amber-600 hover:underline"
                >
                  ← Volver a las activas
                </Link>
              ) : (
                archivadas.length > 0 && (
                  <Link
                    href="/mi-obra?archivadas=1"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
                  >
                    <Archive className="h-4 w-4" />
                    Archivadas ({archivadas.length})
                  </Link>
                )
              )}
            </div>

            {obras.length === 0 ? (
              <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
                <HardHat className="h-12 w-12 text-ink-300" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">
                  {verArchivadas
                    ? "No tenés obras archivadas"
                    : "Todavía no creaste tu obra"}
                </h3>
                <p className="mt-1 max-w-md text-ink-500">
                  {verArchivadas
                    ? "Cuando termines una obra vas a poder archivarla acá sin perder nada."
                    : "Creá tu primera obra y empezá a controlar presupuesto, materiales y avance. Es gratis."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {obras.map((o) => {
                  // Mismo cálculo que el tablero: una sola fuente de verdad.
                  const m = obraMetrics(o.rubros, o.expenses);
                  const etapa = currentStage(o.rubros);
                  const sup = formatSurface(o.surfaceM2);
                  return (
                    <div
                      key={o.id}
                      className="rounded-3xl border border-ink-100 bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                    >
                      <Link href={`/mi-obra/${o.id}`} className="block p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-display text-lg font-bold text-ink-900">
                              {o.name}
                            </h3>
                            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-400">
                              {o.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" /> {o.location}
                                </span>
                              )}
                              {sup && (
                                <span className="flex items-center gap-1">
                                  <Ruler className="h-3.5 w-3.5" /> {sup}
                                </span>
                              )}
                              {o.projectType && (
                                <span>{projectTypeLabel[o.projectType]}</span>
                              )}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
                              {statusLabel[o.status] ?? o.status}
                            </span>
                            {o.shared && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-medium text-ink-600">
                                {o.myRole === "editor"
                                  ? "Compartida · cargás avance"
                                  : "Compartida · sólo mirás"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-100 pt-4 text-sm sm:grid-cols-4">
                          <div>
                            <p className="text-xs text-ink-400">Presupuesto</p>
                            <p className="font-semibold text-ink-900">
                              {formatCurrency(m.presupuesto, o.currency)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-ink-400">Gastado</p>
                            <p className="font-semibold text-ink-900">
                              {formatCurrency(m.gastado, o.currency)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-ink-400">Avance</p>
                            <p className="font-semibold text-amber-600">
                              {m.avance}%
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-ink-400">Etapa actual</p>
                            <p className="truncate font-semibold text-ink-900">
                              {etapa}
                            </p>
                          </div>
                        </div>
                      </Link>

                      {verArchivadas && o.myRole === "admin" && (
                        <form
                          action={unarchiveObra}
                          className="border-t border-ink-100 px-6 py-3"
                        >
                          <input type="hidden" name="id" value={o.id} />
                          <SubmitButton
                            pendingText="Restaurando…"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:underline"
                          >
                            Restaurar obra
                          </SubmitButton>
                        </form>
                      )}
                    </div>
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
              <input
                name="name"
                required
                placeholder="Casa familia Pérez"
                className={inputClass}
              />
            </Field>
            <Field label="Ubicación" hint="Opcional.">
              <input name="location" placeholder="Córdoba" className={inputClass} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tipo de obra">
                <select
                  name="projectType"
                  className={inputClass}
                  defaultValue="obra_nueva"
                >
                  <option value="obra_nueva">Obra nueva</option>
                  <option value="ampliacion">Ampliación</option>
                  <option value="refaccion">Refacción</option>
                </select>
              </Field>
              <Field label="Superficie" hint="En m². Opcional.">
                <input
                  name="surfaceM2"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="180"
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
              <Field label="Moneda">
                <select name="currency" className={inputClass} defaultValue="ARS">
                  <option value="ARS">Pesos (ARS)</option>
                  <option value="USD">Dólares (USD)</option>
                </select>
              </Field>
              <Field label="Presupuesto inicial" hint="Opcional. Después lo ajustás.">
                <input
                  name="initialBudget"
                  type="number"
                  min={0}
                  step="1000"
                  placeholder="24000000"
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Inicio">
                <input name="startDate" type="date" className={inputClass} />
              </Field>
              <Field label="Entrega estimada">
                <input name="estimatedEnd" type="date" className={inputClass} />
              </Field>
            </div>
            <Field label="Estado">
              <select
                name="status"
                className={inputClass}
                defaultValue="planificacion"
              >
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
              Se crean las etapas típicas de obra. Si cargás un presupuesto
              inicial, se reparte entre ellas y queda como línea base.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
