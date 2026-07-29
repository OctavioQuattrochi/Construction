import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

export function CTA() {
  return (
    <section className="container-x py-20 md:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-950 px-8 py-16 shadow-elevated md:px-16 md:py-20">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
          <div className="pointer-events-none absolute inset-0 bg-radial-amber opacity-70" />

          <div className="relative max-w-2xl">
            <span className="eyebrow text-amber-400">
              <span className="h-px w-6 bg-amber-500/60" />
              ¿Listo para empezar?
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Hablemos de tu proyecto antes de la primera pala.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-concrete-300">
              Una consulta inicial puede ahorrarte semanas de obra y una parte
              importante de tu presupuesto. Contanos qué querés construir.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/contacto" size="lg" variant="primary">
                Solicitar consultoría
                <ArrowRight className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink href={site.whatsappUrl} external size="lg" variant="dark">
                <MessageCircle className="h-5 w-5" />
                Escribir por WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
