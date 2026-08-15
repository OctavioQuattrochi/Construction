import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  TrendingUp,
  Package,
  BookOpen,
  LayoutDashboard,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { formatCurrency, cn } from "@/lib/utils";
import { Field, inputClass, ConfirmSubmit } from "@/components/admin/ui";
import {
  saveRubro,
  deleteRubro,
  saveMaterial,
  setMaterialStatus,
  deleteMaterial,
  saveExpense,
  deleteExpense,
  saveLog,
  deleteLog,
} from "../actions";

export const metadata: Metadata = {
  title: "Mi obra",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const TABS = [
  { key: "resumen", label: "Resumen", icon: LayoutDashboard },
  { key: "avance", label: "Avance", icon: TrendingUp },
  { key: "dinero", label: "Dinero", icon: Wallet },
  { key: "materiales", label: "Materiales", icon: Package },
  { key: "libro", label: "Libro de obra", icon: BookOpen },
];

const statusLabel: Record<string, string> = {
  planificacion: "En planificación",
  ejecucion: "En ejecución",
  pausada: "Pausada",
  terminada: "Terminada",
};
const matStatus: Record<string, { label: string; cls: string }> = {
  necesario: { label: "Necesario", cls: "bg-ink-100 text-ink-600" },
  comprado: { label: "Comprado", cls: "bg-amber-500/15 text-amber-700" },
  recibido: { label: "Recibido", cls: "bg-emerald-50 text-emerald-700" },
};

export default async function ObraPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const member = await getMemberSession();
  if (!member) redirect("/ingresar");
  const { id } = await params;
  const { tab } = await searchParams;
  const active = TABS.find((t) => t.key === tab)?.key ?? "resumen";

  const obra = await db.obra.findUnique({
    where: { id },
    include: {
      rubros: { orderBy: { order: "asc" } },
      materials: { orderBy: { createdAt: "desc" } },
      expenses: { orderBy: { date: "desc" }, include: { rubro: true } },
      logs: { orderBy: { date: "desc" } },
    },
  });
  if (!obra || obra.memberId !== member.id) notFound();

  // --- métricas ---
  const presupuesto = obra.rubros.reduce((s, r) => s + r.budgeted, 0);
  const gastado = obra.expenses.reduce((s, e) => s + e.amount, 0);
  const pendiente = Math.max(0, presupuesto - gastado);
  // Avance ponderado por presupuesto si hay montos; si no, promedio simple.
  const avance =
    presupuesto > 0
      ? Math.round(
          obra.rubros.reduce((s, r) => s + (r.budgeted / presupuesto) * r.progress, 0)
        )
      : obra.rubros.length
        ? Math.round(obra.rubros.reduce((s, r) => s + r.progress, 0) / obra.rubros.length)
        : 0;
  const gastoPct = presupuesto > 0 ? Math.round((gastado / presupuesto) * 100) : 0;
  // Señal temprana: se gastó bastante más de lo que se avanzó.
  const alerta = presupuesto > 0 && gastoPct - avance >= 15;

  const href = (t: string) => `/mi-obra/${obra.id}?tab=${t}`;

  return (
    <article className="pb-24 pt-28 md:pt-32">
      <div className="container-x">
        <Link
          href="/mi-obra"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" /> Mis obras
        </Link>

        {/* Encabezado */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900">{obra.name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              {obra.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-amber-500" /> {obra.location}
                </span>
              )}
              {obra.startDate && (
                <span>Inicio {obra.startDate.toLocaleDateString("es-AR")}</span>
              )}
              {obra.estimatedEnd && (
                <span>· Entrega estimada {obra.estimatedEnd.toLocaleDateString("es-AR")}</span>
              )}
            </p>
          </div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-700">
            {statusLabel[obra.status] ?? obra.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="thin-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={href(t.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors",
                active === t.key
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"
              )}
            >
              <t.icon className={cn("h-4 w-4", active === t.key && "text-amber-400")} />
              {t.label}
            </Link>
          ))}
        </div>

        {/* ---------------- RESUMEN ---------------- */}
        {active === "resumen" && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Presupuesto" value={formatCurrency(presupuesto)} hint="suma de etapas" />
              <Stat
                label="Gastado"
                value={formatCurrency(gastado)}
                hint={`${gastoPct}% del presupuesto`}
              />
              <Stat label="Avance de obra" value={`${avance}%`} accent hint="ponderado por etapa" />
            </div>

            {alerta && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-500/10 p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-ink-900">
                    Estás gastando más rápido de lo que avanzás
                  </p>
                  <p className="mt-1 text-sm text-ink-600">
                    Llevás gastado el <strong>{gastoPct}%</strong> del presupuesto y el
                    avance declarado es del <strong>{avance}%</strong>. Revisá si falta
                    cargar avance o si hay un desvío de costos.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="Avance por etapa" href={href("avance")}>
                {obra.rubros.slice(0, 6).map((r) => (
                  <div key={r.id} className="py-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-700">{r.name}</span>
                      <span className="font-medium text-ink-900">{r.progress}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </Panel>

              <Panel title="Últimos movimientos" href={href("dinero")}>
                {obra.expenses.length === 0 ? (
                  <p className="py-3 text-sm text-ink-400">Sin gastos registrados.</p>
                ) : (
                  obra.expenses.slice(0, 6).map((e) => (
                    <div key={e.id} className="flex items-center justify-between py-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate text-ink-700">{e.description}</p>
                        <p className="text-xs text-ink-400">
                          {e.date.toLocaleDateString("es-AR")}
                          {e.rubro ? ` · ${e.rubro.name}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono font-medium text-ink-900">
                        {formatCurrency(e.amount)}
                      </span>
                    </div>
                  ))
                )}
              </Panel>
            </div>
          </div>
        )}

        {/* ---------------- AVANCE ---------------- */}
        {active === "avance" && (
          <div className="mt-6 space-y-3">
            {obra.rubros.map((r) => (
              <form
                key={r.id}
                action={saveRubro}
                className="flex flex-wrap items-end gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft"
              >
                <input type="hidden" name="obraId" value={obra.id} />
                <input type="hidden" name="id" value={r.id} />
                <div className="min-w-[10rem] flex-1">
                  <Field label="Etapa">
                    <input name="name" defaultValue={r.name} className={inputClass} />
                  </Field>
                </div>
                <div className="w-40">
                  <Field label="Presupuesto">
                    <input
                      name="budgeted"
                      type="number"
                      step="0.01"
                      defaultValue={r.budgeted}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="w-28">
                  <Field label="Avance %">
                    <input
                      name="progress"
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={r.progress}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
                >
                  Guardar
                </button>
                <ConfirmSubmit
                  message={`¿Eliminar la etapa “${r.name}”?`}
                  formAction={deleteRubro}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </ConfirmSubmit>
              </form>
            ))}

            <form
              action={saveRubro}
              className="flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-ink-200 bg-white p-4"
            >
              <input type="hidden" name="obraId" value={obra.id} />
              <div className="min-w-[10rem] flex-1">
                <Field label="Nueva etapa">
                  <input name="name" required placeholder="Ej: Piscina" className={inputClass} />
                </Field>
              </div>
              <div className="w-40">
                <Field label="Presupuesto">
                  <input name="budgeted" type="number" step="0.01" defaultValue={0} className={inputClass} />
                </Field>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-amber-600"
              >
                <Plus className="h-4 w-4" /> Agregar
              </button>
            </form>
          </div>
        )}

        {/* ---------------- DINERO ---------------- */}
        {active === "dinero" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <Stat label="Presupuesto" value={formatCurrency(presupuesto)} />
                <Stat label="Gastado" value={formatCurrency(gastado)} />
                <Stat label="Pendiente" value={formatCurrency(pendiente)} accent />
              </div>
              {obra.expenses.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center text-sm text-ink-400">
                  Todavía no registraste gastos.
                </p>
              ) : (
                <div className="divide-y divide-ink-50 overflow-hidden rounded-2xl border border-ink-100 bg-white">
                  {obra.expenses.map((e) => (
                    <div key={e.id} className="flex items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-900">{e.description}</p>
                        <p className="text-xs text-ink-400">
                          {e.date.toLocaleDateString("es-AR")}
                          {e.rubro ? ` · ${e.rubro.name}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono font-semibold text-ink-900">
                        {formatCurrency(e.amount)}
                      </span>
                      <form action={deleteExpense}>
                        <input type="hidden" name="obraId" value={obra.id} />
                        <input type="hidden" name="id" value={e.id} />
                        <ConfirmSubmit message="¿Eliminar este gasto?">
                          <Trash2 className="h-3.5 w-3.5" />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form
              action={saveExpense}
              className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-24"
            >
              <input type="hidden" name="obraId" value={obra.id} />
              <h2 className="font-display font-semibold text-ink-900">Registrar gasto</h2>
              <Field label="Descripción">
                <input name="description" required placeholder="Pago albañil" className={inputClass} />
              </Field>
              <Field label="Importe">
                <input name="amount" type="number" step="0.01" required className={inputClass} />
              </Field>
              <Field label="Etapa" hint="Opcional.">
                <select name="rubroId" className={inputClass} defaultValue="">
                  <option value="">Sin asignar</option>
                  {obra.rubros.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Fecha">
                <input name="date" type="date" className={inputClass} />
              </Field>
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-ink-950 hover:bg-amber-600"
              >
                Registrar
              </button>
            </form>
          </div>
        )}

        {/* ---------------- MATERIALES ---------------- */}
        {active === "materiales" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              {obra.materials.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
                  <p className="text-sm text-ink-500">
                    Todavía no cargaste materiales.
                  </p>
                  <Link
                    href="/calculadoras"
                    className="mt-2 inline-block text-sm font-medium text-amber-600 hover:underline"
                  >
                    Calcular materiales →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-ink-50 overflow-hidden rounded-2xl border border-ink-100 bg-white">
                  {obra.materials.map((mat) => {
                    const st = matStatus[mat.status] ?? matStatus.necesario;
                    const next =
                      mat.status === "necesario"
                        ? "comprado"
                        : mat.status === "comprado"
                          ? "recibido"
                          : "necesario";
                    return (
                      <div key={mat.id} className="flex items-center gap-3 p-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-ink-900">{mat.label}</p>
                          <p className="text-xs text-ink-400">
                            {mat.qty} {mat.unit ?? ""}
                            {mat.unitPrice ? ` · ${formatCurrency(mat.unitPrice)} c/u` : ""}
                            {mat.store ? ` · ${mat.store}` : ""}
                          </p>
                        </div>
                        <form action={setMaterialStatus}>
                          <input type="hidden" name="obraId" value={obra.id} />
                          <input type="hidden" name="id" value={mat.id} />
                          <input type="hidden" name="status" value={next} />
                          <button
                            type="submit"
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80",
                              st.cls
                            )}
                            title="Cambiar estado"
                          >
                            {st.label}
                          </button>
                        </form>
                        <form action={deleteMaterial}>
                          <input type="hidden" name="obraId" value={obra.id} />
                          <input type="hidden" name="id" value={mat.id} />
                          <ConfirmSubmit message="¿Quitar este material?">
                            <Trash2 className="h-3.5 w-3.5" />
                          </ConfirmSubmit>
                        </form>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <form
              action={saveMaterial}
              className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-24"
            >
              <input type="hidden" name="obraId" value={obra.id} />
              <h2 className="font-display font-semibold text-ink-900">Agregar material</h2>
              <Field label="Material">
                <input name="label" required placeholder="Cemento 50 kg" className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Cantidad">
                  <input name="qty" type="number" step="0.01" defaultValue={1} className={inputClass} />
                </Field>
                <Field label="Unidad">
                  <input name="unit" placeholder="bolsa" className={inputClass} />
                </Field>
              </div>
              <Field label="Precio unitario" hint="Opcional.">
                <input name="unitPrice" type="number" step="0.01" className={inputClass} />
              </Field>
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-ink-950 hover:bg-amber-600"
              >
                Agregar
              </button>
              <p className="text-xs text-ink-400">
                También podés mandarlos directo desde las{" "}
                <Link href="/calculadoras" className="font-medium text-amber-600 hover:underline">
                  calculadoras
                </Link>
                .
              </p>
            </form>
          </div>
        )}

        {/* ---------------- LIBRO DE OBRA ---------------- */}
        {active === "libro" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              {obra.logs.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center text-sm text-ink-400">
                  Todavía no hay entradas. Registrá qué se hizo cada día.
                </p>
              ) : (
                obra.logs.map((l) => (
                  <div
                    key={l.id}
                    className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft"
                  >
                    {l.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.photo} alt="" className="aspect-video w-full object-cover" />
                    )}
                    <div className="flex items-start justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="text-xs text-amber-600">
                          {l.date.toLocaleDateString("es-AR")}
                        </p>
                        <p className="font-display font-semibold text-ink-900">{l.title}</p>
                        {l.note && (
                          <p className="mt-1 whitespace-pre-line text-sm text-ink-500">{l.note}</p>
                        )}
                      </div>
                      <form action={deleteLog}>
                        <input type="hidden" name="obraId" value={obra.id} />
                        <input type="hidden" name="id" value={l.id} />
                        <ConfirmSubmit message="¿Eliminar esta entrada?">
                          <Trash2 className="h-3.5 w-3.5" />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              action={saveLog}
              className="h-fit space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft lg:sticky lg:top-24"
            >
              <input type="hidden" name="obraId" value={obra.id} />
              <h2 className="font-display font-semibold text-ink-900">Nueva entrada</h2>
              <Field label="Qué se hizo">
                <input name="title" required placeholder="Se levantó el muro norte" className={inputClass} />
              </Field>
              <Field label="Observaciones" hint="Opcional.">
                <textarea name="note" rows={3} className={inputClass} />
              </Field>
              <Field label="Foto (URL)" hint="Opcional.">
                <input name="photo" placeholder="https://…" className={inputClass} />
              </Field>
              <Field label="Fecha">
                <input name="date" type="date" className={inputClass} />
              </Field>
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-ink-950 hover:bg-amber-600"
              >
                Registrar
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold",
          accent ? "text-amber-600" : "text-ink-900"
        )}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

function Panel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display font-semibold text-ink-900">{title}</h3>
        <Link href={href} className="text-xs font-medium text-amber-600 hover:underline">
          Ver todo
        </Link>
      </div>
      <div className="divide-y divide-ink-50">{children}</div>
    </div>
  );
}
