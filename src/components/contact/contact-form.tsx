"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Input, Textarea, Select, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const services = [
  "Consultoría en construcción",
  "Inspección / peritaje técnico",
  "Arquitectura y proyecto",
  "Dirección de obra",
  "Otra consulta",
];

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al enviar");
      setSent(true);
      toast.success("¡Mensaje enviado! Te responderemos a la brevedad.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50 p-12 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">
          Mensaje recibido
        </h3>
        <p className="mt-2 max-w-sm text-ink-500">
          Gracias por escribirnos. Vamos a revisar tu consulta y te contactaremos
          a la brevedad.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-medium text-amber-600 hover:underline"
        >
          Enviar otra consulta
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft md:p-8"
    >
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre y apellido *</Label>
          <Input id="name" name="name" required placeholder="Tu nombre" />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" placeholder="+54 351 …" />
        </div>
        <div>
          <Label htmlFor="service">Servicio de interés</Label>
          <Select id="service" name="service" defaultValue="">
            <option value="" disabled>
              Seleccioná una opción
            </option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="subject">Asunto</Label>
        <Input id="subject" name="subject" placeholder="¿Sobre qué querés consultar?" />
      </div>

      <div className="mt-5">
        <Label htmlFor="message">Mensaje *</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Contanos sobre tu proyecto: qué querés construir, en qué etapa estás, tus dudas…"
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-ink-400">* Campos obligatorios</p>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Enviando…
            </>
          ) : (
            <>
              Enviar consulta <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
