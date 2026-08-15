"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

interface Entry {
  id: string;
  date: Date;
  title: string;
  note: string | null;
  photo: string | null;
}

/**
 * Línea de tiempo de la obra. Es lo que el propietario realmente quiere ver:
 * cómo fue creciendo su casa, con fotos y fechas. Cada hito aparece al hacer
 * scroll, contando la historia de la obra.
 */
export function ObraTimeline({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
        <Camera className="h-9 w-9 text-ink-300" />
        <p className="mt-3 text-sm text-ink-500">
          Todavía no hay registros de avance con fotos.
        </p>
      </div>
    );
  }

  // Más viejo arriba: se lee como una historia que avanza hacia hoy.
  const ordered = [...entries].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="relative pl-8">
      {/* Línea vertical */}
      <div className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-amber-500/60 via-ink-200 to-transparent" />

      <div className="space-y-8">
        {ordered.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
            className="relative"
          >
            {/* Punto */}
            <span className="absolute -left-8 top-1.5 flex h-6 w-6 items-center justify-center">
              <span className="absolute h-6 w-6 rounded-full bg-amber-500/15" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
            </span>

            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              {e.date.toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h4 className="mt-1 font-display text-lg font-semibold text-ink-900">
              {e.title}
            </h4>
            {e.note && (
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-500">
                {e.note}
              </p>
            )}
            {e.photo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-3 overflow-hidden rounded-2xl border border-ink-100 shadow-soft"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.photo}
                  alt={e.title}
                  loading="lazy"
                  className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
