import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { getMemberSession, isGoogleConfigured } from "@/lib/member-auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Ingresá o registrate en BildAp para acceder a más funciones.",
};

export const dynamic = "force-dynamic";

const benefits = [
  "Guardá tus cálculos y comparaciones favoritas",
  "Recibí alertas de precios de materiales",
  "Contactá profesionales e inmuebles más rápido",
];

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getMemberSession();
  if (session) redirect("/");
  const { error } = await searchParams;
  const configured = isGoogleConfigured();

  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid min-h-[80vh] items-center gap-12 py-24 lg:grid-cols-2">
        <div>
          <LogoMark className="h-12 w-12" />
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">
            Sumate a {site.brand}
          </h1>
          <p className="mt-4 max-w-md text-lg text-ink-500">
            Creá tu cuenta gratis y aprovechá al máximo la plataforma. Es rápido y
            seguro.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-ink-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-elevated">
            <h2 className="font-display text-xl font-semibold text-ink-900">
              Ingresar o registrarse
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Usá tu cuenta de Google para empezar.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error === "google_no_configurado"
                  ? "El ingreso con Google todavía no está habilitado. Volvé pronto."
                  : "No pudimos completar el ingreso. Intentá de nuevo."}
              </div>
            )}

            {configured ? (
              <a
                href="/api/auth/google"
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-ink-200 bg-white py-3 font-medium text-ink-800 transition-colors hover:bg-ink-50"
              >
                <GoogleIcon /> Continuar con Google
              </a>
            ) : (
              <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-concrete-50 py-3 text-sm font-medium text-ink-400">
                <Sparkles className="h-4 w-4" /> Ingreso con Google · próximamente
              </div>
            )}

            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Tus datos están protegidos.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-ink-400">
            ¿Sos profesional o empresa?{" "}
            <Link href="/contacto" className="font-medium text-amber-600 hover:underline">
              Sumate a la red
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
