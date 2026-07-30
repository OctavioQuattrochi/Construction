import Link from "next/link";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import type { Property } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

const operationLabel: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
};

const typeLabel: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  lote: "Lote",
  local: "Local",
  oficina: "Oficina",
};

export function priceLabel(p: Pick<Property, "price" | "currency" | "operation">) {
  if (p.price == null) return "Consultar";
  const value = formatCurrency(p.price, p.currency);
  return p.operation === "alquiler" ? `${value}/mes` : value;
}

export function PropertyCard({ property }: { property: Property }) {
  const img = property.coverImage || property.images.split("|")[0] || null;

  return (
    <Link
      href={`/inmuebles/${property.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-ink-950">
            {operationLabel[property.operation] ?? property.operation}
          </span>
          <span className="rounded-full bg-ink-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {typeLabel[property.type] ?? property.type}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-xl font-bold text-ink-900">
          {priceLabel(property)}
        </p>
        <h3 className="mt-1 line-clamp-1 font-medium text-ink-800 group-hover:text-amber-700">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-400">
          <MapPin className="h-3.5 w-3.5" /> {property.location}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-ink-100 pt-4 text-sm text-ink-500">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-ink-400" /> {property.bedrooms} dorm.
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-ink-400" /> {property.bathrooms} baño(s)
            </span>
          )}
          {property.area != null && (
            <span className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-ink-400" /> {property.area} m²
            </span>
          )}
        </div>
        <p className="mt-3 text-xs text-ink-400">{property.agency}</p>
      </div>
    </Link>
  );
}
