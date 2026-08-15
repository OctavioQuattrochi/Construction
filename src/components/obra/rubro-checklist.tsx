"use client";

import { useState } from "react";
import { Check, ListChecks, Plus, Trash2, ChevronDown, Loader2 } from "lucide-react";
import {
  seedTasks,
  addTask,
  toggleTask,
  deleteTask,
} from "@/app/(marketing)/mi-obra/actions";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  label: string;
  done: boolean;
}

/**
 * Checklist de la etapa. Tildar tareas concretas es mucho más natural que
 * estimar un porcentaje: el % de la etapa se calcula solo a partir de acá.
 */
export function RubroChecklist({
  obraId,
  rubroId,
  rubroName,
  tasks,
  hasTemplate,
  canEdit,
}: {
  obraId: string;
  rubroId: string;
  rubroName: string;
  tasks: Task[];
  hasTemplate: boolean;
  canEdit: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");

  const done = tasks.filter((t) => t.done).length;

  async function run(fn: (fd: FormData) => Promise<void>, fd: FormData, key: string) {
    setBusy(key);
    try {
      await fn(fd);
    } finally {
      setBusy(null);
    }
  }

  function fd(extra: Record<string, string>) {
    const f = new FormData();
    f.set("obraId", obraId);
    f.set("rubroId", rubroId);
    Object.entries(extra).forEach(([k, v]) => f.set(k, v));
    return f;
  }

  // Sin tareas y sin plantilla disponible: no mostramos nada (etapa a mano).
  if (tasks.length === 0 && !hasTemplate) return null;

  return (
    <div className="mt-3 border-t border-ink-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-900"
      >
        <ListChecks className="h-4 w-4 text-amber-500" />
        {tasks.length > 0 ? (
          <span>
            Tareas: <strong className="text-ink-900">{done}</strong> de {tasks.length}
          </span>
        ) : (
          <span>Usar checklist en vez de porcentaje</span>
        )}
        <ChevronDown
          className={cn("ml-auto h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-1.5">
          {/* Cargar plantilla */}
          {tasks.length === 0 && hasTemplate && canEdit && (
            <div className="rounded-xl bg-concrete-50 p-3">
              <p className="text-xs text-ink-500">
                Cargá las tareas típicas de {rubroName.toLowerCase()} y andá
                tildando lo que se hizo. El avance se calcula solo.
              </p>
              <button
                type="button"
                onClick={() => run(seedTasks, fd({}), "seed")}
                disabled={busy === "seed"}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
              >
                {busy === "seed" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                Cargar tareas típicas
              </button>
            </div>
          )}

          {/* Lista */}
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => canEdit && run(toggleTask, fd({ id: t.id }), t.id)}
                disabled={!canEdit || busy === t.id}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                  t.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-ink-300 bg-white hover:border-amber-500",
                  !canEdit && "cursor-default opacity-70"
                )}
                aria-label={t.done ? "Marcar como pendiente" : "Marcar como hecha"}
              >
                {busy === t.id ? (
                  <Loader2 className="h-3 w-3 animate-spin text-ink-400" />
                ) : t.done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : null}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm",
                  t.done ? "text-ink-400 line-through" : "text-ink-700"
                )}
              >
                {t.label}
              </span>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => run(deleteTask, fd({ id: t.id }), `del-${t.id}`)}
                  className="text-ink-300 hover:text-red-600"
                  aria-label="Eliminar tarea"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}

          {/* Agregar una tarea propia */}
          {canEdit && tasks.length > 0 && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newLabel.trim()) return;
                await run(addTask, fd({ label: newLabel.trim() }), "add");
                setNewLabel("");
              }}
              className="flex gap-2 pt-1"
            >
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Agregar una tarea…"
                className="flex-1 rounded-lg border border-ink-200 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy === "add" || !newLabel.trim()}
                className="rounded-lg border border-ink-200 px-3 text-sm font-medium text-ink-600 hover:border-ink-400 disabled:opacity-50"
              >
                {busy === "add" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
