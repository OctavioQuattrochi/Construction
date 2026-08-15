import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { getObraAccess } from "@/lib/obra-access";
import { formatCurrency, cn } from "@/lib/utils";
import { PrintButton } from "@/components/obra/print-button";

export const metadata: Metadata = {
  title: "Informe de obra",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  planificacion: "En planificación",
  ejecucion: "En ejecución",
  pausada: "Pausada",
  terminada: "Terminada",
};

/** Informe de avance listo para imprimir o guardar como PDF (para reuniones). */
export default async function InformePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const member = await getMemberSession();
  if (!member) redirect("/ingresar");
  const { id } = await params;

  const obra = await db.obra.findUnique({
    where: { id },
    include: {
      rubros: { orderBy: { order: "asc" } },
      expenses: { orderBy: { date: "desc" } },
      adjustments: { where: { approved: true }, orderBy: { date: "asc" } },
      logs: { orderBy: { date: "desc" }, take: 6 },
    },
  });
  if (!obra) notFound();
  const access = await getObraAccess(obra.id, member, obra.memberId);
  if (!access) notFound();

  const presupuesto = obra.rubros.reduce((s, r) => s + r.budgeted, 0);
  const gastado = obra.expenses.reduce((s, e) => s + e.amount, 0);
  const ajustes = obra.adjustments.reduce((s, a) => s + a.amount, 0);
  const base = obra.baselineTotal ?? presupuesto;
  const actualizado = base + ajustes;
  const avance =
    presupuesto > 0
      ? Math.round(
          obra.rubros.reduce((s, r) => s + (r.budgeted / presupuesto) * r.progress, 0)
        )
      : 0;
  const hoy = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="pb-24 pt-28 md:pt-32">
      <div className="container-x max-w-4xl">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Link
            href={`/mi-obra/${obra.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a la obra
          </Link>
          <PrintButton
            label="Descargar PDF"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
          />
        </div>

        {/* ---- Hoja del informe ---- */}
        <div
          id="informe-obra"
          className="mt-6 rounded-3xl border border-ink-100 bg-white p-8 shadow-soft md:p-12"
        >
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-4 border-b border-ink-100 pb-6">
            <div>
              <p className="font-display text-lg font-bold text-ink-900">
                Bild<span className="text-amber-500">Ap</span>
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold text-ink-900">
                {obra.name}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-ink-500">
                {obra.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {obra.location}
                  </span>
                )}
                <span>{statusLabel[obra.status] ?? obra.status}</span>
              </p>
            </div>
            <div className="text-right text-sm text-ink-500">
              <p className="font-medium text-ink-900">Informe de avance</p>
              <p>{hoy}</p>
            </div>
          </div>

          {/* Resumen */}
          <div className="grid gap-4 border-b border-ink-100 py-6 sm:grid-cols-3">
            <Box label="Avance de obra" value={`${avance}%`} accent />
            <Box label="Presupuesto actualizado" value={formatCurrency(actualizado)} />
            <Box label="Invertido a la fecha" value={formatCurrency(gastado)} />
          </div>

          {/* Avance por etapa */}
          <section className="border-b border-ink-100 py-6">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-900">
              Avance por etapa
            </h2>
            <div className="space-y-3">
              {obra.rubros.map((r) => (
                <div key={r.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-700">{r.name}</span>
                    <span className="text-ink-500">
                      {formatCurrency(r.budgeted)} · <strong className="text-ink-900">{r.progress}%</strong>
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        r.progress === 100 ? "bg-emerald-500" : "bg-amber-500"
                      )}
                      style={{ width: `${r.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Evolución del presupuesto */}
          {obra.baselineTotal && (
            <section className="border-b border-ink-100 py-6">
              <h2 className="mb-4 font-display text-lg font-bold text-ink-900">
                Evolución del presupuesto
              </h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-ink-50">
                  <tr>
                    <td className="py-2 text-ink-600">Presupuesto original</td>
                    <td className="py-2 text-right font-mono text-ink-900">
                      {formatCurrency(base)}
                    </td>
                  </tr>
                  {obra.adjustments.map((a) => (
                    <tr key={a.id}>
                      <td className="py-2 text-ink-600">{a.reason}</td>
                      <td className="py-2 text-right font-mono text-ink-900">
                        {a.amount > 0 ? "+" : "−"}
                        {formatCurrency(Math.abs(a.amount))}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="py-2 text-ink-900">Presupuesto actualizado</td>
                    <td className="py-2 text-right font-mono text-amber-600">
                      {formatCurrency(actualizado)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          {/* Últimos registros */}
          {obra.logs.length > 0 && (
            <section className="py-6">
              <h2 className="mb-4 font-display text-lg font-bold text-ink-900">
                Últimos trabajos registrados
              </h2>
              <div className="space-y-4">
                {obra.logs.map((l) => (
                  <div key={l.id} className="flex gap-4">
                    {l.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l.photo}
                        alt=""
                        className="h-20 w-28 shrink-0 rounded-xl object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs text-amber-600">
                        {l.date.toLocaleDateString("es-AR")}
                      </p>
                      <p className="font-medium text-ink-900">{l.title}</p>
                      {l.note && (
                        <p className="text-sm text-ink-500">{l.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <p className="border-t border-ink-100 pt-6 text-xs text-ink-400">
            Informe generado con BildAp el {hoy}. Los valores son los cargados por
            quien administra la obra y tienen carácter orientativo.
          </p>
        </div>
      </div>
    </article>
  );
}

function Box({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 p-4">
      <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold",
          accent ? "text-amber-600" : "text-ink-900"
        )}
      >
        {value}
      </p>
    </div>
  );
}
