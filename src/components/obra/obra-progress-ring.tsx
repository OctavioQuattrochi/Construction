"use client";

import { motion } from "framer-motion";

/**
 * Anillo de avance animado. Se dibuja al entrar en pantalla: comunica el estado
 * de la obra de un vistazo, sin que el cliente tenga que leer números.
 */
export function ObraProgressRing({
  pct,
  size = 180,
  label = "de la obra",
}: {
  pct: number;
  size?: number;
  label?: string;
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = Math.max(0, Math.min(100, pct));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-ink-100"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-amber-500"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * value) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="font-display text-4xl font-bold text-ink-900"
        >
          {value}%
        </motion.span>
        <span className="text-xs text-ink-400">{label}</span>
      </div>
    </div>
  );
}
