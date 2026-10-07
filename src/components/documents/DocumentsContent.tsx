"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { documents } from "@/data/documents";

export function DocumentsContent() {
  return (
    <>
      <section className="border-b border-[var(--line)]">
        <div className="container py-12 lg:py-16">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">Допуски и лицензии</p>
          </Reveal>
          <RevealHeading
            as="h1"
            className="display text-[clamp(2.8rem,7vw,5rem)]"
            mode="lines"
          >
            {"Разрешительные\nдокументы"}
          </RevealHeading>
          <RevealText className="mt-6 max-w-3xl text-[1.08rem] text-[var(--muted)]" delay={0.12}>
            <p>
              ООО «Теплоэнергокомплект» располагает полным комплектом допусков и разрешительных
              документов для выполнения работ на опасных производственных объектах (ОПО) в
              соответствии с требованиями ФЗ № 116-ФЗ и ФНП Ростехнадзора.
            </p>
          </RevealText>
        </div>
      </section>

      <section className="section border-b border-[var(--line)]">
        <Stagger className="container grid gap-4 md:grid-cols-2" as="ul">
          {documents.map((doc, index) => (
            <StaggerItem key={doc.id} as="li">
              <article className="group flex h-full flex-col border border-[var(--line)] bg-[var(--background)] p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] md:p-6">
                <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide leading-snug text-balance">
                  {doc.title}
                </h2>
                <p className="mt-3 flex-1 text-[var(--muted)]">{doc.description}</p>
                {doc.file ? (
                  <div className="mt-5 flex flex-wrap gap-4">
                    <a href={doc.file} target="_blank" rel="noreferrer" className="link-arrow">
                      Смотреть
                    </a>
                    <a href={doc.file} download className="link-arrow">
                      Скачать
                    </a>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-[var(--muted)]">По запросу</p>
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="container mt-10 max-w-3xl" delay={0.1}>
          <p className="border-t border-[var(--line)] pt-6 text-[var(--muted)]">
            Все разрешения и допуски имеют действующий срок. По запросу предоставляются заверенные
            копии для тендерной документации и прохождения экспертизы. Свяжитесь через раздел{" "}
            <Link href="/contacts" className="text-[var(--blue)] underline-offset-2 hover:underline">
              Контакты
            </Link>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}
