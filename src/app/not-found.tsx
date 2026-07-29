import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-20" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="relative">
        <LogoMark className="mx-auto h-12 w-12" />
        <p className="mt-8 font-display text-7xl font-bold text-amber-400 md:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold md:text-3xl">
          Esta página no está en los planos
        </h1>
        <p className="mx-auto mt-3 max-w-md text-concrete-400">
          La dirección que buscás no existe o fue movida. Volvé al inicio para
          seguir explorando la plataforma.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-medium text-ink-950 transition-colors hover:bg-amber-400"
          >
            <Home className="h-4 w-4" /> Ir al inicio
          </Link>
          <Link
            href="/conocimiento"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium text-white transition-colors hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" /> Centro de Conocimiento
          </Link>
        </div>
      </div>
    </div>
  );
}
