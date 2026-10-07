"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";

const types = [
  {
    number: "01",
    title: "Плановый",
    text: "Регламентные наладка и ремонт по заранее согласованному с заказчиком графику (в т. ч. ежемесячное обслуживание).",
  },
  {
    number: "02",
    title: "Внеплановый",
    text: "Выход из строя или необходимость регулировки котла, когда неисправность не препятствует эксплуатации остальной системы.",
  },
  {
    number: "03",
    title: "Аварийный",
    text: "Поломка, угрожающая безопасности людей или делающая невозможной корректную работу всей системы; выезд бригады в кратчайшие сроки.",
  },
  {
    number: "04",
    title: "Капремонт и модернизация",
    text: "Реставрация оборудования, внесение изменений в проект, усовершенствование системы.",
  },
];

export function RepairTypes() {
  return (
    <section className="section border-b border-[var(--line)]">
      <div className="container">
        <div className="mb-8 grid gap-6 lg:mb-12 lg:grid-cols-12 lg:items-end">
          <RevealHeading
            className="display text-[clamp(2.5rem,5.5vw,4.5rem)] lg:col-span-7"
            mode="lines"
          >
            {"Виды\nремонта"}
          </RevealHeading>
          <RevealText className="text-[var(--muted)] lg:col-span-5 lg:pb-2 prose-max" delay={0.12}>
            <p>
              Формат работ определяется состоянием оборудования, срочностью и согласованным графиком
              с заказчиком.
            </p>
          </RevealText>
        </div>

        <Reveal variant="fade">
          <div className="border-t border-[var(--line)]" />
        </Reveal>

        <Stagger fast>
          {types.map((type) => (
            <StaggerItem key={type.number}>
              <div className="repair-type-row group grid gap-2 border-b border-[var(--line)] py-5 transition-colors duration-250 hover:bg-[var(--surface)] md:grid-cols-12 md:items-baseline md:gap-6 md:py-6 md:px-2">
                <div className="md:col-span-1">
                  <span className="inline-block font-[family-name:var(--font-display)] text-[var(--blue)] tracking-wide transition-transform duration-300 group-hover:translate-x-1">
                    {type.number}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,2vw,1.5rem)] uppercase tracking-wide text-balance">
                    {type.title}
                  </h3>
                </div>
                <div className="md:col-span-8">
                  <p className="text-[var(--muted)] max-w-3xl">{type.text}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
