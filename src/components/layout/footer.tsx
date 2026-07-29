import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { footerNav, site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-concrete-300">
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-[0.35]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-concrete-400">
              {site.description}
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2.5 text-concrete-300 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-amber-500" /> {site.email}
              </a>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-concrete-300 transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-amber-500" /> WhatsApp directo
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-amber-500" /> {site.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(footerNav).map(([group, links]) => (
              <div key={group}>
                <h3 className="font-display text-sm font-semibold text-white">
                  {group}
                </h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-concrete-400 transition-colors hover:text-amber-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-concrete-500 sm:flex-row sm:items-center">
          <p>
            © {year} {site.brand}. {site.owner} — {site.ownerTitle}.
          </p>
          <p className="flex items-center gap-2">
            Hecho con criterio técnico en {site.region}, {site.country}.
          </p>
        </div>
      </div>
    </footer>
  );
}
