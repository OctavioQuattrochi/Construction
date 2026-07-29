import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/ui/logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ingreso · Administración",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-20" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="h-12 w-12" />
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-concrete-400">
            {site.brand} · Ingresá con tus credenciales
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-elevated">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-white/5" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-concrete-500">
          Acceso restringido. Todas las acciones quedan registradas.
        </p>
      </div>
    </div>
  );
}
