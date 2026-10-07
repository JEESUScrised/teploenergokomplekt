"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo, viewportOnce } from "@/lib/motion";
import { RevealImage } from "@/components/motion/RevealImage";

/** Decorative overlay nodes — not geographic GIS, just motion accents over the map PNG */
const nodes = [
  { x: "22%", y: "48%", delay: 0.15 },
  { x: "28%", y: "42%", delay: 0.22 },
  { x: "34%", y: "52%", delay: 0.28 },
  { x: "42%", y: "40%", delay: 0.34 },
  { x: "48%", y: "46%", delay: 0.4 },
  { x: "56%", y: "38%", delay: 0.46 },
  { x: "64%", y: "44%", delay: 0.52 },
  { x: "72%", y: "48%", delay: 0.58 },
  { x: "80%", y: "42%", delay: 0.64 },
  { x: "88%", y: "50%", delay: 0.7 },
];

export function GeographyMap() {
  const reduce = usePrefersReducedMotion();

  return (
    <RevealImage className="relative w-full" direction="scale" parallax>
      <Image
        src="/assets/brand/russia-coverage-map.jpg"
        alt="Карта географии работ ООО «Теплоэнергокомплект» по России"
        width={1200}
        height={800}
        className="h-auto w-full object-contain"
        sizes="(max-width: 1024px) 100vw, 58vw"
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {nodes.map((node) => (
          <motion.span
            key={`${node.x}-${node.y}`}
            className="geo-node absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--blue)] shadow-[0_0_0_3px_rgba(23,55,166,0.18)]"
            style={{ left: node.x, top: node.y }}
            initial={reduce ? false : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 0.9, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, ease: easeOutExpo, delay: node.delay }}
          >
            {!reduce ? (
              <motion.span
                className="absolute inset-0 rounded-full bg-[var(--blue)]"
                animate={{ scale: [1, 1.8, 1], opacity: [0.45, 0, 0.45] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: node.delay }}
              />
            ) : null}
          </motion.span>
        ))}
        {!reduce ? (
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M22 48 C 30 40, 40 55, 48 46 S 64 38, 72 48 S 84 40, 88 50"
              fill="none"
              stroke="rgba(23,55,166,0.35)"
              strokeWidth="0.35"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1.4, ease: easeOutExpo, delay: 0.35 }}
            />
          </svg>
        ) : null}
      </div>
    </RevealImage>
  );
}
