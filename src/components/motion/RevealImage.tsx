"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRevealGate } from "@/hooks/useRevealGate";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "scale";
  delay?: number;
  parallax?: boolean;
  hoverZoom?: boolean;
};

export function RevealImage({
  children,
  className = "",
  direction = "up",
  delay = 0,
  parallax = false,
  hoverZoom = false,
}: Props) {
  const reduce = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [ref, show] = useRevealGate<HTMLDivElement>();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const enableParallax = parallax && isDesktop && !reduce && show;
  const y = useTransform(scrollYProgress, [0, 1], enableParallax ? [16, -16] : [0, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], enableParallax ? [1, 1.035] : [1, 1]);

  const dirClass =
    direction === "left"
      ? "reveal-clip-left"
      : direction === "scale"
        ? "reveal-scale-clip"
        : "reveal-clip";

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${dirClass} ${show ? "is-in" : ""} ${hoverZoom ? "group" : ""} ${className}`.trim()}
      style={{ ["--reveal-delay" as string]: `${delay}s` }}
    >
      <motion.div
        className={
          hoverZoom
            ? "h-full w-full origin-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            : "h-full w-full origin-center"
        }
        style={enableParallax ? { y, scale: scrollScale } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
