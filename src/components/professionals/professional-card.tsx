import { MapPin, Mail, MessageCircle, Phone, BadgeCheck } from "lucide-react";
import type { Professional } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { toList } from "@/lib/utils";

export function ProfessionalCard({ pro }: { pro: Professional }) {
  const specialties = toList(pro.specialties, "|");
  const initials = pro.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const wa = pro.whatsapp || pro.phone;

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-elevated">
      <div className="flex items-start gap-4">
        {pro.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pro.photo}
            alt={pro.name}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink-900 font-display text-lg font-bold text-amber-400">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-lg font-semibold text-ink-900">
              {pro.name}
            </h3>
            {pro.featured && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-amber-500" />
            )}
          </div>
          <p className="text-sm font-medium text-amber-700">{pro.profession}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
            <MapPin className="h-3 w-3" /> {pro.location}
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
        {pro.bio}
      </p>

      {specialties.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {specialties.slice(0, 4).map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
        {wa && (
          <a
            href={`https://wa.me/${wa.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1.5 text-sm font-medium text-[#0a7d3e] transition-colors hover:bg-[#25D366]/20"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        )}
        {pro.email && (
          <a
            href={`mailto:${pro.email}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
        )}
        {pro.phone && !pro.whatsapp && (
          <a
            href={`tel:${pro.phone}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900"
          >
            <Phone className="h-4 w-4" /> Llamar
          </a>
        )}
      </div>
    </article>
  );
}
