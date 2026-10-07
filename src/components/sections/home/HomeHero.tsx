"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function HomeHero() {
  const reduce = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], isDesktop && !reduce ? [0, 40] : [0, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], isDesktop && !reduce ? [1, 1.045] : [1, 1]);
  const imageX = useTransform(scrollYProgress, [0, 1], isDesktop && !reduce ? [0, -6] : [0, 0]);

  return (
    <section className={`hero ${reduce ? "hero--reduced" : ""}`} aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow mb-3 lg:mb-4 hero-anim" style={{ ["--hero-delay" as string]: "0.32s" }}>
            ООО «Теплоэнергокомплект»
          </p>

          <div aria-hidden="true" className="hero-brand mb-4 lg:mb-0">
            {["Тепло", "Энерго", "Комплект"].map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <span
                  className="block hero-anim-line"
                  style={{ ["--hero-delay" as string]: `${0.42 + i * 0.1}s` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </div>

          <h1 id="hero-title" className="hero-title">
            <span className="block overflow-hidden">
              <span className="block hero-anim-line" style={{ ["--hero-delay" as string]: "0.78s" }}>
                Ремонт, реконструкция и монтаж паровых и водогрейных котлов и вспомогательного
                оборудования
              </span>
            </span>
          </h1>

          <p className="hero-lead hero-anim" style={{ ["--hero-delay" as string]: "1s" }}>
            Полный цикл работ — от диагностики и дефектации до пусконаладки, документального
            сопровождения и планового обслуживания. Выезд специалистов в любую точку России,
            круглый год.
          </p>

          <div className="hero-actions">
            <div className="w-full sm:w-auto hero-anim" style={{ ["--hero-delay" as string]: "1.15s" }}>
              <Button href="/contacts#request" className="w-full sm:w-auto">
                Получить консультацию
              </Button>
            </div>
            <div className="w-full sm:w-auto hero-anim" style={{ ["--hero-delay" as string]: "1.25s" }}>
              <Button href="/services" variant="secondary" className="w-full sm:w-auto">
                Наши услуги
              </Button>
            </div>
          </div>
        </div>

        <div className="hero-visual" ref={visualRef}>
          <div className="hero-divider-v origin-top hero-anim-rule-v" aria-hidden="true" />
          <div className="hero-divider-h origin-left hero-anim-rule-h" aria-hidden="true" />
          <div className="hero-visual-frame overflow-hidden hero-anim-clip">
            <motion.div
              className="h-full w-full origin-center"
              style={{ y: imageY, x: imageX, scale: imageScale }}
            >
              <Image
                src="/assets/boilers/boiler-cutout-repair.png"
                alt="Промышленный котёл на раме с площадкой и обвязкой"
                width={1200}
                height={1400}
                priority
                className="h-full w-full object-contain"
                sizes="(max-width: 1023px) 100vw, 52vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
