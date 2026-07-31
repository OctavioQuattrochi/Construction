import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  MessageCircle,
  Phone,
  Building2,
} from "lucide-react";
import { getPropertyBySlug, getSavedRefIds } from "@/lib/queries";
import { getMemberSession } from "@/lib/member-auth";
import { priceLabel } from "@/components/properties/property-card";
import { SaveButton } from "@/components/member/save-button";
import { toList } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Inmueble no encontrado" };
  return {
    title: property.title,
    description: property.description.slice(0, 155),
    openGraph: {
      title: property.title,
      images: property.coverImage ? [property.coverImage] : undefined,
    },
  };
}

const typeLabel: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  lote: "Lote",
  local: "Local",
  oficina: "Oficina",
};

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property || !property.published) notFound();

  const member = await getMemberSession();
  const savedSet = member
    ? await getSavedRefIds(member.id, "property")
    : new Set<string>();

  const gallery = [
    property.coverImage,
    ...toList(property.images, "|"),
  ].filter(Boolean) as string[];
  const wa = property.whatsapp || property.phone;

  return (
    <article className="pb-24 pt-28 md:pt-32">
      <div className="container-x">
        <Link
          href="/inmuebles"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a inmuebles
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Gallery + description */}
          <div>
            {gallery.length > 0 && (
              <div className="overflow-hidden rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gallery[0]}
                  alt={property.title}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            )}
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {gallery.slice(1, 5).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${property.title} ${i + 2}`}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}

            <div className="prose-article mt-10 max-w-none">
              <h2 className="md-h2">Descripción</h2>
              <p className="md-p whitespace-pre-line">{property.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-ink-950">
                    {property.operation === "alquiler" ? "Alquiler" : "Venta"}
                  </span>
                  <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
                    {typeLabel[property.type] ?? property.type}
                  </span>
                </div>
                <SaveButton
                  isMember={Boolean(member)}
                  initialSaved={savedSet.has(property.slug)}
                  item={{
                    type: "property",
                    refId: property.slug,
                    title: property.title,
                    subtitle: property.location,
                    href: `/inmuebles/${property.slug}`,
                    image: property.coverImage || undefined,
                  }}
                />
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-ink-900">
                {priceLabel(property)}
              </p>
              <h1 className="mt-2 font-display text-xl font-semibold text-ink-900">
                {property.title}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                <MapPin className="h-4 w-4 text-amber-500" /> {property.location}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3 border-y border-ink-100 py-4 text-center">
                <Feature icon={BedDouble} value={property.bedrooms} label="Dorm." />
                <Feature icon={Bath} value={property.bathrooms} label="Baños" />
                <Feature icon={Ruler} value={property.area} label="m²" />
              </div>

              <div className="mt-5 space-y-2">
                {wa && (
                  <a
                    href={`https://wa.me/${wa.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hola, me interesa el inmueble "${property.title}" publicado en BildAp.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-medium text-white transition-colors hover:brightness-105"
                  >
                    <MessageCircle className="h-5 w-5" /> Consultar por WhatsApp
                  </a>
                )}
                {property.phone && (
                  <a
                    href={`tel:${property.phone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 py-3 font-medium text-ink-800 transition-colors hover:border-ink-900"
                  >
                    <Phone className="h-5 w-5" /> {property.phone}
                  </a>
                )}
              </div>

              <p className="mt-5 flex items-center gap-2 text-sm text-ink-400">
                <Building2 className="h-4 w-4" /> Publicado por{" "}
                <span className="font-medium text-ink-600">{property.agency}</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

function Feature({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BedDouble;
  value: number | null;
  label: string;
}) {
  return (
    <div>
      <Icon className="mx-auto h-5 w-5 text-ink-400" />
      <p className="mt-1 font-display font-semibold text-ink-900">
        {value ?? "–"}
      </p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  );
}
