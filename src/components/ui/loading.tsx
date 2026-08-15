"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Bloque de carga a pantalla: ícono + mensaje. Para loading.tsx de rutas. */
export function PageLoading({ message = "Cargando…" }: { message?: string }) {
  return (
    <div className="container-x flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-amber-500/25 border-t-amber-500" />
        <span className="font-display text-sm font-bold text-ink-900">
          B<span className="text-amber-500">A</span>
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-ink-500">{message}</p>
    </div>
  );
}

/** Barra indeterminada sutil. */
export function LoadingBar({ className }: { className?: string }) {
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-ink-100", className)}>
      <div className="h-full w-1/3 animate-[loading-slide_1.1s_ease-in-out_infinite] rounded-full bg-amber-500" />
    </div>
  );
}

/** Placeholder de tarjeta mientras carga una grilla. */
export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-3xl border border-ink-100 bg-white"
        >
          <div className="aspect-[16/10] w-full bg-ink-100" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 rounded bg-ink-100" />
            <div className="h-4 w-3/4 rounded bg-ink-100" />
            <div className="h-3 w-1/2 rounded bg-ink-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Botón de submit que se deshabilita y muestra spinner mientras corre la
 * server action. Evita el doble clic y comunica que algo está pasando.
 */
export function SubmitButton({
  children,
  className,
  pendingText,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-opacity disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
