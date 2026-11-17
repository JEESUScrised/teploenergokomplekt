"use client";

import { motion } from "motion/react";
import { GeographyMap } from "@/components/sections/GeographyMap";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { AnimatedLine } from "@/components/motion/AnimatedLine";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

const boilerTypes = [
  "ДКВР",
  "ДЕ",
  "КЕ",
  "ДСЕ",
  "ДЕВ",
  "КВЕ",
  "КВМ",
  "КВ-ГМ (ПТВМ)",
  "КВ-Р (КВТС)",
];

const qualityCards = [
  {
    title: "Квалификация специалистов",
    text: "Работы выполняют специалисты сварочного производства. Актуальные сведения об аттестации НАКС и допусках к работам на ОПО предоставляем по запросу.",
  },
  {
    title: "Технологии и контроль качества",
    text: "Применяем технологии сварки с контролем качества соединений, выполняем неразрушающий контроль и гидравлические испытания. По итогам работ передаём исполнительную документацию и протоколы.",
  },
];

export function GeographyQualityBand() {
  const reduce = usePrefersReducedMotion();

  return (
    <>
      <section
        className="section border-b border-[var(--line)] overflow-x-clip"
        id="geography"
        aria-labelledby="geography-heading"
      >
        <div className="container grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="relative lg:col-span-5">
            <Reveal variant="fade">
              <p className="eyebrow mb-3">География</p>
            </Reveal>
            <RevealHeading
              id="geography-heading"
              className="display text-[clamp(2rem,4.5vw,3.4rem)]"
              mode="lines"
            >
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
                Выезд специалистов в различные регионы России — от Белгорода до Находки. На объектах
                компании — от Поволжья и Урала до Сибири и юга страны.
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

      <section
        className="section border-b border-[var(--line)] bg-[var(--surface)]"
        aria-labelledby="tech-quality-heading"
        id="technologies"
      >
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal variant="fade">
                <p className="eyebrow mb-3">Производство</p>
              </Reveal>
              <RevealHeading
                id="tech-quality-heading"
                className="display text-[clamp(2rem,4vw,3rem)]"
                mode="lines"
              >
                {"Технологии\nи качество"}
              </RevealHeading>
              <RevealText className="mt-5 text-[var(--muted)]" delay={0.08}>
                <p>
                  Работаем с паровыми и водогрейными котлами отечественного производства и
                  котельно-вспомогательным оборудованием.
                </p>
              </RevealText>
            </div>
            <div className="lg:col-span-8">
              <Stagger className="flex flex-wrap gap-2" as="ul" fast>
                {boilerTypes.map((type) => (
                  <StaggerItem key={type} as="li">
                    <span className="inline-block border border-[var(--line)] bg-[var(--background)] px-3 py-2 transition-colors duration-200 hover:border-[var(--blue)]">
                      {type}
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
              <Stagger className="mt-6 grid gap-4 md:grid-cols-2" as="ul">
                {qualityCards.map((card) => (
                  <StaggerItem key={card.title} as="li">
                    <article className="group h-full border border-[var(--line)] bg-[var(--background)] p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] md:p-6">
                      <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-wide">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm text-[var(--muted)]">{card.text}</p>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
