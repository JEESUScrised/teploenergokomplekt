"use client";

import { motion } from "motion/react";
import { GeographyMap } from "@/components/sections/GeographyMap";
import { RevealText } from "@/components/motion/RevealHeading";
import { AnimatedLine } from "@/components/motion/AnimatedLine";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { RevealHeading } from "@/components/motion/RevealHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

type Props = {
  index?: string;
};

export function GeographyBand({ index = "09" }: Props) {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="section border-b border-[var(--line)] overflow-x-clip" id="geography">
      <div className="container grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-5">
          <SectionIndex index={index} />
          <RevealHeading className="display text-[clamp(2rem,4.5vw,3.4rem)]" mode="lines">
            {"География\nработ"}
          </RevealHeading>
          <motion.p
            className="geo-watermark"
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, amount: 0.01 }}
            transition={{ duration: 0.85, ease: easeOutExpo, delay: 0.12 }}
          >
            Россия
          </motion.p>
          <RevealText className="mt-5 text-[var(--muted)] prose-max relative z-[1]" delay={0.1}>
            <p>
              Выезд специалистов в различные регионы России. На объектах компании — от Поволжья и
              Урала до Сибири и юга страны.
            </p>
          </RevealText>
        </div>
        <div className="lg:col-span-7 lg:-mr-6 xl:-mr-10">
          <GeographyMap />
        </div>
      </div>
      <div className="container mt-8">
        <AnimatedLine className="tech-rule" delay={0.1} />
      </div>
    </section>
  );
}