"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

/**
 * Soft enter only. Never animate wrapper opacity from 0 —
 * a stuck opacity:0 wrapper blanks the entire page (incl. hero).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  );
}
