import { TrendingUp, ArrowRight, Check, Clock, Trash2, Lock } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Field, inputClass, ConfirmSubmit } from "@/components/admin/ui";
import { SubmitButton } from "@/components/ui/loading";
import {
  setBaseline,
  addAdjustment,
  approveAdjustment,
  deleteAdjustment,
  applyInflation,
} from "@/app/(marketing)/mi-obra/actions";

interface Adjustment {
  id: string;
  type: string;
  amount: number;
  reason: string;
  days: number;
  approved: boolean;
  date: Date;
}

const typeMeta: Record<string, { label: string; cls: string }> = {
  inflacion: { label: "Inflación", cls: "bg-orange-50 text-orange-700" },
  cambio: { label: "Cambio pedido", cls: "bg-blue-50 text-blue-700" },
  correccion: { label: "Corrección", cls: "bg-ink-100 text-ink-600" },
};

/**
 * Evolución del presupuesto: original → ajustes → actualizado.
 * El presupuesto original nunca se modifica; así el propietario ve exactamente
 * cuánto subió por inflación y cuánto por cambios que pidió él.
 */
export function BudgetEvolution({
  obraId,
  baselineTotal,
  baselineAt,
  baselineUsdRate,
  currentBudget,
  adjustments,
  gastado,
  canEdit,
  canApprove,
}: {
  obraId: string;
  baselineTotal: number | null;
  baselineAt: Date | null;
  baselineUsdRate: number | null;
  currentBudget: number;
  adjustments: Adjustment[];
  gastado: number;
  canEdit: boolean;
  canApprove: boolean;
}) {
  const aprobados = adjustments.filter((a) => a.approved);
  const pendientes = adjustments.filter((a) => !a.approved);
  const sumaAjustes = aprobados.reduce((s, a) => s + a.amount, 0);
  const base = baselineTotal ?? currentBudget;
  const actualizado = base + sumaAjustes;
  const diasExtra = aprobados.reduce((s, a) => s + a.days, 0);
  const porTipo = (t: string) =>
    aprobados.filter((a) => a.type === t).reduce((s, a) => s + a.amount, 0);

  // Sin línea base todavía: invitar a fijarla.
  if (!baselineTotal) {
    return (
      <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-500/5 p-6">
        <h3 className="flex items-center gap-2 font-display font-bold text-ink-900">
          <Lock className="h-4 w-4 text-amber-600" /> Fijá el presupuesto original
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          Congelá el presupuesto de arranque ({formatCurrency(currentBudget)}). A
          partir de ahí, todo aumento se registra como un ajuste con su motivo — así
          siempre vas a saber <strong>por qué</strong> subió la obra, en vez de ver
          un número que cambia sin explicación.
        </p>
        {canEdit && currentBudget > 0 && (
          <form action={setBaseline} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="obraId" value={obraId} />
            <div className="w-48">
              <Field label="Dólar hoy" hint="Opcional, como referencia.">
                <input name="usdRate" type="number" step="0.01" placeholder="1450" className={inputClass} />
              </Field>
            </div>
            <SubmitButton
              pendingText="Fijando…"
              className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
            >
              Fijar presupuesto original
            </SubmitButton>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cascada: original → ajustes → actualizado */}
      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
        <div className="border-b border-ink-100 px-6 py-4">
          <h3 className="font-display font-bold text-ink-900">
            Evolución del presupuesto
          </h3>
          <p className="text-xs text-ink-400">
            Original fijado el {baselineAt?.toLocaleDateString("es-AR")}
            {baselineUsdRate ? ` · dólar a ${formatCurrency(baselineUsdRate)}` : ""}
          </p>
        </div>

        <div className="divide-y divide-ink-50">
          <Row label="Presupuesto original" value={formatCurrency(base)} muted />
          {porTipo("inflacion") !== 0 && (
            <Row
              label="Aumento de precios (inflación)"
              value={fmtDelta(porTipo("inflacion"))}
              tone="orange"
            />
          )}
          {porTipo("cambio") !== 0 && (
            <Row
              label="Cambios que pediste"
              value={fmtDelta(porTipo("cambio"))}
              tone="blue"
            />
          )}
          {porTipo("correccion") !== 0 && (
            <Row label="Correcciones" value={fmtDelta(porTipo("correccion"))} />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-ink-100 bg-concrete-50 px-6 py-4">
          <div>
            <span className="font-display font-bold text-ink-900">
              Presupuesto actualizado
            </span>
            {diasExtra !== 0 && (
              <p className="text-xs text-ink-400">
                {diasExtra > 0 ? "+" : ""}
                {diasExtra} días de plazo por los cambios
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="font-display text-xl font-bold text-amber-600">
              {formatCurrency(actualizado)}
            </span>
            {sumaAjustes !== 0 && base > 0 && (
              <p className="text-xs text-ink-400">
                {sumaAjustes > 0 ? "+" : ""}
                {((sumaAjustes / base) * 100).toFixed(1)}% vs original
              </p>
            )}
          </div>
        </div>

        {/* Alerta de desvío real */}
        {gastado > actualizado && (
          <p className="border-t border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
            Ya gastaste {formatCurrency(gastado - actualizado)} por encima del
            presupuesto actualizado.
          </p>
        )}
      </div>

      {/* Cambios pendientes de aprobación */}
      {pendientes.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-blue-200 bg-blue-50/50">
          <p className="border-b border-blue-100 px-5 py-3 text-sm font-semibold text-blue-900">
            {pendientes.length} cambio(s) esperando tu aprobación
          </p>
          <div className="divide-y divide-blue-100">
            {pendientes.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900">{a.reason}</p>
                  <p className="text-xs text-ink-500">
                    {fmtDelta(a.amount)}
                    {a.days ? ` · ${a.days > 0 ? "+" : ""}${a.days} días` : ""}
                  </p>
                </div>
                {canApprove && (
                  <form action={approveAdjustment}>
                    <input type="hidden" name="obraId" value={obraId} />
                    <input type="hidden" name="id" value={a.id} />
                    <SubmitButton
                      pendingText="Aprobando…"
                      className="rounded-full bg-ink-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-ink-800"
                    >
                      <Check className="h-3.5 w-3.5" /> Aprobar
                    </SubmitButton>
                  </form>
                )}
                {canEdit && (
                  <form action={deleteAdjustment}>
                    <input type="hidden" name="obraId" value={obraId} />
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmSubmit message="¿Descartar este cambio?">
                      <Trash2 className="h-3.5 w-3.5" />
                    </ConfirmSubmit>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalle de ajustes aplicados */}
      {aprobados.length > 0 && (
        <details className="group rounded-2xl border border-ink-100 bg-white">
          <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-ink-600">
            Ver el detalle de los {aprobados.length} ajustes aplicados
          </summary>
          <div className="divide-y divide-ink-50 border-t border-ink-100">
            {aprobados.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    typeMeta[a.type]?.cls ?? "bg-ink-100 text-ink-600"
                  )}
                >
                  {typeMeta[a.type]?.label ?? a.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-700">{a.reason}</p>
                  <p className="text-xs text-ink-400">
                    {a.date.toLocaleDateString("es-AR")}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-sm font-semibold text-ink-900">
                  {fmtDelta(a.amount)}
                </span>
                {canEdit && (
                  <form action={deleteAdjustment}>
                    <input type="hidden" name="obraId" value={obraId} />
                    <input type="hidden" name="id" value={a.id} />
                    <ConfirmSubmit message="¿Eliminar este ajuste?">
                      <Trash2 className="h-3.5 w-3.5" />
                    </ConfirmSubmit>
                  </form>
                )}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Cargar un ajuste */}
      {canEdit && (
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display font-semibold text-ink-900">
              Registrar un ajuste
            </h3>
            <form action={applyInflation}>
              <input type="hidden" name="obraId" value={obraId} />
              <SubmitButton
                pendingText="Calculando…"
                className="rounded-full border border-orange-300 bg-orange-50 px-4 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100"
              >
                <TrendingUp className="h-3.5 w-3.5" /> Actualizar por inflación
              </SubmitButton>
            </form>
          </div>
          <p className="mt-1 text-xs text-ink-400">
            &ldquo;Actualizar por inflación&rdquo; calcula solo cuánto subieron los
            materiales desde que fijaste el presupuesto, con los precios reales del
            comparador.
          </p>

          <form action={addAdjustment} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="obraId" value={obraId} />
            <Field label="Motivo">
              <input name="reason" required placeholder="Cambiar cerámico por porcelanato" className={inputClass} />
            </Field>
            <Field label="Tipo">
              <select name="type" className={inputClass} defaultValue="cambio">
                <option value="cambio">Cambio pedido por el propietario</option>
                <option value="inflacion">Aumento de precios</option>
                <option value="correccion">Corrección del cómputo</option>
              </select>
            </Field>
            <Field label="Importe" hint="Negativo si es un ahorro.">
              <input name="amount" type="number" step="0.01" required placeholder="1030000" className={inputClass} />
            </Field>
            <Field label="Días de demora" hint="Opcional.">
              <input name="days" type="number" defaultValue={0} className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <SubmitButton
                pendingText="Registrando…"
                className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-ink-950 hover:bg-amber-600"
              >
                Registrar ajuste <ArrowRight className="h-4 w-4" />
              </SubmitButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function fmtDelta(n: number) {
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${formatCurrency(Math.abs(n))}`;
}

function Row({
  label,
  value,
  tone,
  muted,
}: {
  label: string;
  value: string;
  tone?: "orange" | "blue";
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className={cn("text-sm", muted ? "text-ink-500" : "text-ink-700")}>
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-sm font-semibold",
          tone === "orange" && "text-orange-600",
          tone === "blue" && "text-blue-600",
          !tone && "text-ink-900"
        )}
      >
        {value}
      </span>
    </div>
  );
}
