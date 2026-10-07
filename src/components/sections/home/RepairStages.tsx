"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealHeading } from "@/components/motion/RevealHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo, viewportOnce } from "@/lib/motion";

const stages = [
  {
    number: "01",
    title: "Диагностика и осмотр",
    text: "Проверка всех компонентов котла и вспомогательного оборудования, выявление неисправностей; дефектовка с фотоотчётом и заключением.",
  },
  {
    number: "02",
    title: "Замена изношенных деталей",
    text: "Установка новых или восстановленных деталей, соответствующих техническим требованиям и стандартам безопасности.",
  },
  {
    number: "03",
    title: "Профилактическое обслуживание",
    text: "Чистка, смазка и настройка механизмов для предотвращения износа и продления срока службы.",
  },
  {
    number: "04",
    title: "Проверка систем управления",
    text: "Настройка систем автоматического управления, ремонт котельной автоматики, систем контроля и защиты.",
  },
  {
    number: "05",
    title: "Испытания и ввод в эксплуатацию",
    text: "Тестовые запуски, гидравлические испытания, подтверждение исправной работы оборудования.",
  },
];

export function RepairStages() {
  const reduce = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 50%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="section border-b border-[var(--line)]">
      <div className="container">
        <Reveal variant="fade">
          <p className="eyebrow mb-3">Процесс</p>
        </Reveal>
        <RevealHeading
          className="display mb-10 text-[clamp(2.2rem,5vw,3.6rem)] lg:mb-14"
          mode="up"
        >
          Этапы ремонта
        </RevealHeading>

        <div ref={trackRef} className="relative grid gap-8 lg:gap-10">
          <div
            className="pointer-events-none absolute left-[0.85rem] top-2 bottom-2 w-px bg-[var(--line)] md:left-[1.1rem]"
            aria-hidden="true"
          />
          {!reduce ? (
            <motion.div
              className="pointer-events-none absolute left-[0.85rem] top-2 bottom-2 w-px origin-top bg-[var(--blue)] md:left-[1.1rem]"
              style={{ scaleY: lineScale }}
              aria-hidden="true"
            />
          ) : null}

          {stages.map((stage, index) => (
            <motion.div
              key={stage.number}
              className="relative grid gap-3 md:grid-cols-12 md:gap-8"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.55, ease: easeOutExpo, delay: index * 0.04 }}
            >
              <div className="md:col-span-2">
                <span className="display text-[clamp(2.5rem,5vw,4rem)] text-[var(--blue)]">
                  {stage.number}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.4vw,1.9rem)] uppercase tracking-wide">
                  {stage.title}
                </h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-[var(--muted)] text-[1.05rem]">{stage.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
