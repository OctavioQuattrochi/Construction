import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building2,
  Users,
  Heart,
  ArrowRight,
  Sparkles,
  Calculator,
  Trash2,
  DollarSign,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SaveButton } from "@/components/member/save-button";
import { getMemberSession } from "@/lib/member-auth";
import { getSavedItems, getSavedCalculations } from "@/lib/queries";
import type { SaveItemInput } from "@/components/member/save-button";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const sections = [
  { type: "property", label: "Inmuebles guardados", icon: Building2 },
  { type: "professional", label: "Profesionales guardados", icon: Users },
] as const;

const calcNames: Record<string, string> = {
  hormigon: "Hormigón",
  ladrillos: "Ladrillos",
  mortero: "Mortero",
  pintura: "Pintura",
  piso: "Piso",
  membrana: "Membrana",
  durlock: "Durlock",
  zocalos: "Zócalos",
};

export default async function MiCuentaPage() {
  const member = await getMemberSession();
  if (!member) redirect("/ingresar");

  const [items, calculations] = await Promise.all([
    getSavedItems(member.id),
    getSavedCalculations(member.id),
  ]);
  const byType = (t: string) => items.filter((i) => i.type === t);
  const firstName = member.name.split(" ")[0];

  return (
    <>
      <PageHeader
        eyebrow="Mi cuenta"
        title={
          <>
            Hola,{" "}
            <span className="text-gradient-amber">{firstName}</span> 👋
          </>
        }
        description="Acá tenés tus favoritos guardados. Guardá inmuebles y profesionales para tenerlos siempre a mano."
      />

      <section className="container-x py-12">
        {items.length === 0 && calculations.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
            <Heart className="h-12 w-12 text-ink-300" />
            <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
              Todavía no guardaste nada
            </h2>
            <p className="mt-1 max-w-md text-ink-500">
              Tocá el corazón ❤️ en cualquier inmueble o profesional para
              guardarlo y encontrarlo acá.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/inmuebles"
                className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
              >
                Ver inmuebles <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/profesionales"
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:border-ink-900"
              >
                Ver profesionales
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Favoritos */}
            {items.length > 0 && (
              <div>
                {sections.map((section) => {
                  const list = byType(section.type);
                  if (list.length === 0) return null;
                  return (
                    <div key={section.type}>
                      <div className="mb-5 flex items-center gap-2">
                        <section.icon className="h-5 w-5 text-amber-500" />
                        <h2 className="font-display text-xl font-bold text-ink-900">
                          {section.label}
                        </h2>
                        <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500">
                          {list.length}
                        </span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {list.map((item) => {
                          const input: SaveItemInput = {
                            type: item.type as SaveItemInput["type"],
                            refId: item.refId,
                            title: item.title,
                            subtitle: item.subtitle ?? undefined,
                            href: item.href ?? undefined,
                            image: item.image ?? undefined,
                          };
                          return (
                            <div
                              key={item.id}
                              className="group flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-soft"
                            >
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image}
                                  alt=""
                                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-300">
                                  <section.icon className="h-5 w-5" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={item.href || "#"}
                                  className="line-clamp-1 font-medium text-ink-900 hover:text-amber-700"
                                >
                                  {item.title}
                                </Link>
                                {item.subtitle && (
                                  <p className="line-clamp-1 text-sm text-ink-400">
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                              <SaveButton isMember initialSaved item={input} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Presupuestos guardados */}
            {calculations.length > 0 && (
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-amber-500" />
                  <h2 className="font-display text-xl font-bold text-ink-900">
                    Cálculos guardados
                  </h2>
                  <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500">
                    {calculations.length}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {calculations.map((calc) => {
                    const data = JSON.parse(calc.result) as Record<string, number>;
                    return (
                      <div
                        key={calc.id}
                        className="flex flex-col rounded-2xl border border-ink-100 bg-white p-5 shadow-soft"
                      >
                        <h3 className="line-clamp-2 font-display text-sm font-bold text-ink-900">
                          {calc.name}
                        </h3>
                        <p className="mt-1 text-xs text-ink-400">
                          {calcNames[calc.calcType] || calc.calcType}
                        </p>
                        <div className="mt-4 space-y-2 border-t border-ink-100 pt-3">
                          {Object.entries(data).slice(0, 4).map(([key, val]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-ink-500 capitalize">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="font-mono font-semibold text-ink-900">
                                {val.toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={async () => {
                            if (
                              confirm("¿Eliminar este cálculo?")
                            ) {
                              await fetch(
                                `/api/calculations?id=${calc.id}`,
                                { method: "DELETE" }
                              );
                              location.reload();
                            }
                          }}
                          className="mt-4 flex items-center justify-center gap-1 rounded-lg bg-red-50 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Próximamente */}
        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-ink-100 bg-concrete-50 p-5">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm text-ink-500">
            <span className="font-medium text-ink-700">Próximamente:</span> vas a
            poder guardar cálculos de materiales, seguir precios del comparador y
            recibir alertas. Estamos sumando beneficios para usuarios registrados.
          </p>
        </div>
      </section>
    </>
  );
}
