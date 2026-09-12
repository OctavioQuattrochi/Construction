"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const easing = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  // Framer Motion anima con estilos inline desde JS, así que la regla CSS de
  // prefers-reduced-motion no lo alcanza: hay que contemplarlo acá. Si el
  // usuario pidió menos movimiento, el contenido aparece sin desplazamiento.
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={
        reduce
          ? { duration: 0.2, delay: 0 }
          : { duration: 0.7, ease: easing, delay }
      }
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
// Sin movimiento: sólo un fundido corto y sin escalonar, para que la lista no
// tarde en aparecer.
const reducedContainerVariants: Variants = { hidden: {}, show: {} };

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing } },
};
const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export function StaggerGroup({
  children,
  className,
  once = true,
  replayKey,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
  /**
   * Para listas que cambian (filtros/búsquedas): pasá un valor que cambie con el
   * filtro. Sin esto, los items que vuelven a montarse quedan en "hidden"
   * (invisibles) porque el contenedor ya disparó su animación con once:true.
   */
  replayKey?: string | number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={replayKey}
      className={className}
      variants={reduce ? reducedContainerVariants : containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduce ? reducedItemVariants : itemVariants}
    >
      {children}
    </motion.div>
  );
}
