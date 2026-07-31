import { Reveal } from "./reveal";
import { LogoMark } from "./logo";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
  brandLarge = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  brandLarge?: boolean;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-ink-950 pt-28 pb-16 text-white md:pt-36 md:pb-20", className)}>
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-20" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="container-x relative">
        <Reveal>
          {brandLarge ? (
            <span className="mb-5 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-6 backdrop-blur-md">
              <LogoMark className="h-11 w-11" />
              <span className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Bild<span className="text-amber-400">Ap</span>
              </span>
            </span>
          ) : (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 backdrop-blur-md">
              <LogoMark className="h-6 w-6" />
              <span className="font-display text-sm font-bold text-white">
                Bild<span className="text-amber-400">Ap</span>
              </span>
            </span>
          )}
        </Reveal>
        {eyebrow && (
          <Reveal>
            <span className="eyebrow text-amber-400">
              <span className="h-px w-6 bg-amber-500/60" />
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-[3.25rem]">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-concrete-300">
              {description}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.15}>
            <div className="mt-8">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
