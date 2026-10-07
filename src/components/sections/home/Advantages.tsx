"use client";

import { motion } from "motion/react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading } from "@/components/motion/RevealHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

const items = [
  {
    title: "Аттестованные специалисты",
    text: "Действующая аттестация НАКС по группе КО.",
  },
  {
    title: "Полный пакет допусков для работы на ОПО",
    text: "Лицензия Ростехнадзора, допуск СРО, страхование ответственности.",
  },
  {
    title: "Неразрушающий контроль и гидроиспытания",
    text: "Обязательная проверка качества каждого сварного соединения.",
  },
  {
    title: "Документальное сопровождение",
    text: "Исполнительная документация, протоколы, режимные карты, проекты перевода.",
  },
  {
    title: "Гарантия на работы",
    text: "Испытания после ремонта и гарантийные обязательства.",
  },
  {
    title: "Выезд в любую точку России",
    text: "Круглый год, в кратчайшие сроки при аварийных ситуациях.",
  },
  {
    title: "Поставка комплектующих",
    text: "Своя номенклатура энергозапчастей, сокращение сроков ремонта.",
  },
];

export function Advantages() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="section-tight border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="container">
        <Reveal variant="fade">
          <p className="eyebrow mb-3">Почему мы</p>
        </Reveal>
        <RevealHeading
          className="display mb-8 text-[clamp(2.2rem,5vw,3.6rem)] lg:mb-10"
          mode="clip"
        >
          Преимущества
        </RevealHeading>
        <Stagger className="grid gap-0 border-t border-[var(--line)] md:grid-cols-2" fast>
          {items.map((item, index) => (
            <StaggerItem key={item.title}>
              <article className="advantage-card group border-b border-[var(--line)] p-5 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[var(--background)] md:p-6 md:odd:border-r">
                <motion.p
                  className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)] origin-left"
                  initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, ease: easeOutExpo, delay: index * 0.03 }}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide text-balance transition-transform duration-300 group-hover:translate-x-0.5">
                  {item.title}
                </h3>
                <p className="mt-3 text-[var(--muted)] max-w-md">{item.text}</p>
                <span
                  className="mt-4 block h-px w-0 bg-[var(--blue)] transition-[width] duration-400 group-hover:w-12"
                  aria-hidden="true"
                />
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
