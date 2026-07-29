import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 ease-premium btn-focus disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-amber-500 text-ink-950 hover:bg-amber-400 shadow-glow hover:shadow-[0_0_0_1px_rgb(240_165_0/0.3),0_12px_50px_-8px_rgb(240_165_0/0.5)] active:scale-[0.98]",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 shadow-soft active:scale-[0.98]",
  dark: "bg-white text-ink-900 hover:bg-concrete-100 shadow-soft active:scale-[0.98]",
  outline:
    "border border-ink-200 text-ink-800 hover:border-ink-900 hover:bg-ink-50 active:scale-[0.98]",
  ghost: "text-ink-700 hover:text-ink-900 hover:bg-ink-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  external,
  ...props
}: CommonProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external || href.startsWith("http") || href.startsWith("mailto")) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        {...props}
      />
    );
  }
  return <Link href={href} className={classes} {...props} />;
}
