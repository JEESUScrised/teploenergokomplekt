"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Pixel shift range over scroll */
  offset?: number;
  axis?: "y" | "x";
};

/** Slow industrial-layer parallax; disabled on mobile & reduced-motion */
export function Parallax({ children, className, offset = 28, axis = "y" }: Props) {
  const reduce = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const enabled = !reduce && isDesktop;
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    enabled ? [-offset, offset] : [0, 0],
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={axis === "x" ? { x: transform } : { y: transform }}
    >
      {children}
    </motion.div>
  );
}
