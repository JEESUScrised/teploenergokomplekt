"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { industrialSafetySection } from "@/data/industrialSafety";

export function IndustrialSafetySection() {
  const section = industrialSafetySection;

  return (
    <section
      id={section.id}
      className="section border-b border-[var(--line)]"
      aria-labelledby="industrial-safety-heading"
    >
      <div className="container grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">{section.eyebrow}</p>
          </Reveal>
          <RevealHeading
            id="industrial-safety-heading"
            className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide md:text-4xl"
            mode="up"
          >
            {section.heading}
          </RevealHeading>
          <RevealText className="mt-5 text-[var(--muted)]" delay={0.08}>
            <p>{section.lead}</p>
          </RevealText>
          <RevealText className="mt-4 text-sm text-[var(--muted)]" delay={0.12}>
            <p>{section.clarification}</p>
          </RevealText>
          <RevealText className="mt-4 text-sm text-[var(--muted)]" delay={0.16}>
            <p>{section.clientNote}</p>
          </RevealText>
        </div>

        <div className="lg:col-span-7">
          <Reveal
            className="border border-[var(--line)] bg-[var(--background)] p-5 md:p-6"
            delay={0.08}
          >
            <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)]">
              Проверка документов
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide">
              Единый портал тестирования
            </h3>
            <p className="mt-3 text-sm text-[var(--muted)]">{section.protocolCheck.note}</p>
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-[var(--text)]">
              {section.protocolCheck.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <a
              href={section.protocolCheck.href}
              target="_blank"
              rel="noreferrer"
              className="link-arrow mt-6 inline-block"
            >
              {section.protocolCheck.label}
            </a>
          </Reveal>

          <Stagger className="mt-4 grid gap-3 sm:grid-cols-2" as="ul" fast>
            <StaggerItem as="li">
              <article className="h-full border border-[var(--line)] bg-[var(--surface)] p-4 md:p-5">
                <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  Нормативная база
                </p>
                <p className="mt-2 text-sm text-[var(--text)]">{section.normativeBasis.law}</p>
              </article>
            </StaggerItem>
            <StaggerItem as="li">
              <article className="h-full border border-[var(--line)] bg-[var(--surface)] p-4 md:p-5">
                <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  Постановление № 13
                </p>
                <p className="mt-2 text-sm text-[var(--text)]">{section.normativeBasis.regulation}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {section.normativeBasis.regulationNote}
                </p>
              </article>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
