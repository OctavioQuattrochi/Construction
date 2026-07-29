"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { nav, site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "transition-all duration-500 ease-premium",
          scrolled
            ? "border-b border-ink-100/80 bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(12,15,20,0.04)]"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="container-x flex h-16 items-center justify-between md:h-[4.5rem]">
          <Link href="/" aria-label={site.brand} className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active =
                item.href === pathname ||
                (item.href !== "/" &&
                  !item.href.startsWith("/#") &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                    active
                      ? "text-ink-900"
                      : "text-ink-500 hover:text-ink-900 hover:bg-ink-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink
              href={site.whatsappUrl}
              external
              variant="outline"
              size="sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </ButtonLink>
            <ButtonLink href="/contacto" variant="secondary" size="sm">
              Consultar
            </ButtonLink>
          </div>

          <button
            className="btn-focus -mr-1 rounded-full p-2 text-ink-800 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="container-x lg:hidden"
          >
            <div className="mt-2 rounded-3xl border border-ink-100 bg-white p-4 shadow-elevated">
              <div className="flex flex-col">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl px-4 py-3 text-[0.95rem] font-medium text-ink-700 transition-colors hover:bg-ink-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ButtonLink href={site.whatsappUrl} external variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </ButtonLink>
                <ButtonLink href="/contacto" variant="secondary" size="sm">
                  Consultar
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
