import { Mail, Phone, Trash2, Check, Inbox, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AdminHeader, ConfirmSubmit } from "@/components/admin/ui";
import { toggleMessage, deleteMessage } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
  });
  const unread = messages.filter((m) => !m.handled).length;

  return (
    <div>
      <AdminHeader
        title="Mensajes"
        description={`${messages.length} consultas recibidas · ${unread} sin gestionar.`}
      />

      {messages.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
          <Inbox className="h-10 w-10 text-ink-300" />
          <p className="mt-3 text-sm text-ink-500">
            Todavía no recibiste consultas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-3xl border bg-white p-6 shadow-soft transition-colors ${
                m.handled ? "border-ink-100 opacity-70" : "border-amber-200"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {!m.handled && (
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    )}
                    <h3 className="font-display font-semibold text-ink-900">
                      {m.name}
                    </h3>
                    {m.service && (
                      <span className="rounded-full bg-ink-50 px-2.5 py-0.5 text-xs font-medium text-ink-500">
                        {m.service}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                    <a
                      href={`mailto:${m.email}`}
                      className="flex items-center gap-1.5 hover:text-ink-900"
                    >
                      <Mail className="h-3.5 w-3.5" /> {m.email}
                    </a>
                    {m.phone && (
                      <a
                        href={`tel:${m.phone}`}
                        className="flex items-center gap-1.5 hover:text-ink-900"
                      >
                        <Phone className="h-3.5 w-3.5" /> {m.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1.5 text-ink-400">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(m.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <form action={toggleMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="handled" value={m.handled ? "false" : "on"} />
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        m.handled
                          ? "text-ink-500 hover:bg-ink-50"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {m.handled ? "Reabrir" : "Marcar gestionado"}
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmSubmit message="¿Eliminar este mensaje?">
                      <Trash2 className="h-3.5 w-3.5" />
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>

              {m.subject && (
                <p className="mt-4 font-medium text-ink-800">{m.subject}</p>
              )}
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-600">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
