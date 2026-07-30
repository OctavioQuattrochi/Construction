import { Mail, Download } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subs = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  const emails = subs.map((s) => s.email).join(", ");

  return (
    <div>
      <AdminHeader
        title="Suscriptores"
        description={`${subs.length} personas suscriptas al newsletter.`}
      />

      {subs.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
          <Mail className="h-10 w-10 text-ink-300" />
          <p className="mt-3 text-sm text-ink-500">Todavía no hay suscriptores.</p>
        </div>
      ) : (
        <>
          <details className="mb-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
              <Download className="h-4 w-4" /> Copiar todos los emails
            </summary>
            <textarea
              readOnly
              value={emails}
              className="mt-3 h-28 w-full rounded-xl border border-ink-200 bg-concrete-50 p-3 text-sm text-ink-600"
            />
          </details>

          <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
            <div className="divide-y divide-ink-100">
              {subs.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-ink-900">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-400">
                    <span className="rounded-full bg-ink-50 px-2 py-0.5">{s.source}</span>
                    {formatDate(s.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
