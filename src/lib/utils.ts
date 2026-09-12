import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(date: Date | string, locale = "es-AR"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number, currency = "ARS"): string {
  if (currency === "ARS") return ARS.format(value);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export function toList(value: string, sep = ","): string[] {
  return value
    .split(sep)
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Serializa datos estructurados (JSON-LD) para incrustar en un <script>.
 * Escapa `<` (y `>`, `&`) para que un valor con "</script>" no pueda cerrar el
 * bloque e inyectar HTML. JSON.stringify por sí solo NO lo hace.
 */
export function jsonLdScript(data: unknown): string {
  // Escapa a la forma \uXXXX cualquier caracter que pueda romper el <script>
  // contenedor (< > &) o el parser JS embebido (U+2028/U+2029). El backslash se
  // toma de fromCharCode para no depender de escapes de backslash en el fuente.
  const bs = String.fromCharCode(92); // "\"
  return JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (c) => bs + "u" + c.charCodeAt(0).toString(16).padStart(4, "0")
  );
}
