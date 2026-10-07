"use client";

import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionIndex";
import { Button } from "@/components/ui/Button";

const registry = [
  {
    number: "01",
    category: "Лицензия Ростехнадзора",
    meta: "Эксплуатация ОПО",
  },
  {
    number: "02",
    category: "СРО",
    meta: "Строительно-монтажные работы",
  },
  {
    number: "03",
    category: "НАКС",
    meta: "Аттестация специалистов · группа КО",
  },
  {
    number: "04",
    category: "НАКС",
    meta: "Аттестованные технологии сварки",
  },
  {
    number: "05",
    category: "Промбезопасность",
    meta: "Аттестация специалистов",
  },
  {
    number: "06",
    category: "Страхование",
    meta: "Гражданская ответственность ОПО",
  },
];

export function DocumentRegistry() {
  return (
    <section className="section border-b border-[var(--line)]" id="documents-home">
      <div className="container">
        <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            index="12"
            title={"Разрешительные\nдокументы"}
            lead="Полный комплект допусков для работ на ОПО. По запросу — заверенные копии для тендеров и экспертизы."
            className="mb-0"
            rule={false}
          />
          <Button href="/documents" variant="secondary" className="w-full sm:w-auto shrink-0">
            Все документы
          </Button>
        </div>

        <Stagger className="editorial-rows border-t border-[var(--line)]" as="ul" fast>
          {registry.map((item) => (
            <StaggerItem key={`${item.number}-${item.category}`} as="li">
              <Link href="/documents" className="editorial-row group">
                <span className="editorial-row-num">{item.number}</span>
                <span className="editorial-row-title">{item.category}</span>
                <span className="editorial-row-meta">{item.meta}</span>
                <span className="editorial-row-dest">
                  Подробнее
                  <span className="editorial-row-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
