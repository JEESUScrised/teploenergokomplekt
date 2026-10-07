"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { Button } from "@/components/ui/Button";
import { licenseTeasers } from "@/data/documents";

export function LicensesBand() {
  return (
    <section className="section-loose bg-[var(--blue)] text-white">
      <div className="container">
        <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <RevealHeading
              className="display text-[clamp(2.4rem,5vw,4.2rem)] text-balance"
              mode="lines"
            >
              {"Разрешительные\nдокументы"}
            </RevealHeading>
            <RevealText className="mt-5 text-white/80" delay={0.12}>
              <p>
                Полный комплект допусков для работ на ОПО в соответствии с требованиями ФЗ № 116-ФЗ и
                ФНП Ростехнадзора. По запросу — заверенные копии для тендеров и экспертизы.
              </p>
            </RevealText>
          </div>
          <Reveal delay={0.2}>
            <Button href="/documents" variant="light" className="w-full sm:w-auto shrink-0">
              Все документы
            </Button>
          </Reveal>
        </div>
        <Stagger className="grid gap-0 border-t border-white/25 md:grid-cols-2 xl:grid-cols-3">
          {licenseTeasers.map((item, index) => (
            <StaggerItem key={item.id}>
              <article className="license-card group border-b border-white/25 p-5 transition-transform duration-300 hover:-translate-y-1 md:border-r md:odd:border-r xl:[&:nth-child(3n)]:border-r-0">
                <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.14em] text-white/55 transition-transform duration-300 group-hover:translate-x-1">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg uppercase tracking-wide leading-snug text-balance">
                  {item.title}
                </h3>
                <Link
                  href="/documents"
                  className="mt-5 inline-flex items-center gap-2 border-b border-white/40 pb-0.5 text-sm tracking-wide uppercase transition-[border-color,transform] duration-200 hover:border-white hover:translate-x-0.5"
                >
                  Подробнее <span aria-hidden="true">→</span>
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
