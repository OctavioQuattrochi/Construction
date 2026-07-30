"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function Newsletter({
  variant = "band",
  source = "web",
}: {
  variant?: "band" | "inline";
  source?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setDone(true);
      toast.success("¡Listo! Vas a recibir novedades de BildAp.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  const form = (
    <form onSubmit={onSubmit} className="w-full">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]" aria-hidden />
      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium",
            variant === "band" ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-700"
          )}
        >
          <CheckCircle2 className="h-5 w-5" /> ¡Suscripción confirmada! Gracias.
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <div
            className={cn(
              "flex flex-1 items-center gap-2 rounded-full px-4",
              variant === "band"
                ? "border border-white/15 bg-white/5"
                : "border border-ink-200 bg-white"
            )}
          >
            <Mail className={cn("h-5 w-5", variant === "band" ? "text-concrete-400" : "text-ink-400")} />
            <input
              type="email"
              name="email"
              required
              placeholder="Tu email"
              className={cn(
                "w-full bg-transparent py-3 focus:outline-none",
                variant === "band"
                  ? "text-white placeholder:text-concrete-500"
                  : "text-ink-900 placeholder:text-ink-300"
              )}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-ink-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Suscribirme
          </button>
        </div>
      )}
    </form>
  );

  if (variant === "inline") return form;

  return (
    <section className="container-x py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-8 py-12 md:px-14 md:py-14">
        <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-20" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="eyebrow text-amber-400">
              <span className="h-px w-6 bg-amber-500/60" />
              Newsletter
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              Novedades, guías y precios que te ahorran plata
            </h2>
            <p className="mt-3 max-w-lg text-concrete-300">
              Sumate al newsletter de BildAp y recibí contenido técnico,
              actualizaciones de precios y consejos de obra. Sin spam.
            </p>
          </div>
          <div className="relative">{form}</div>
        </div>
      </div>
    </section>
  );
}
