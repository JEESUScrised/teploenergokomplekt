"use client";

import Link from "next/link";
import { ProjectGallery } from "@/components/gallery/ProjectGallery";
import { GeographyMap } from "@/components/sections/GeographyMap";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { Button } from "@/components/ui/Button";
import { company } from "@/config/company";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

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

export function AboutContent() {
  return (
    <>
      <section className="border-b border-[var(--line)]">
        <div className="container py-12 lg:py-16">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">ООО «Теплоэнергокомплект»</p>
          </Reveal>
          <RevealHeading
            as="h1"
            className="display text-[clamp(2.8rem,7vw,5rem)]"
            mode="lines"
          >
            О компании
          </RevealHeading>
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <RevealText className="lg:col-span-6 text-[1.08rem] text-[var(--muted)]" delay={0.1}>
              <p>
                ООО «Теплоэнергокомплект» имеет многолетний опыт в ремонте, строительстве и
                обслуживании котельных, паровых и водогрейных котлов и котельно-вспомогательного
                оборудования.
              </p>
            </RevealText>
            <RevealText className="lg:col-span-6 text-[1.08rem] text-[var(--muted)]" delay={0.18}>
              <p>
                Компания предоставляет сервис полного цикла — от обследования и дефектации до
                пусконаладки, документального сопровождения и планового обслуживания.
              </p>
            </RevealText>
          </div>
        </div>
      </section>

      <section className="section border-b border-[var(--line)]">
        <div className="container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealHeading className="display text-[clamp(2rem,4vw,3rem)]" mode="lines">
              {"Направления\nдеятельности"}
            </RevealHeading>
          </div>
          <Stagger className="lg:col-span-8 border-t border-[var(--line)]" as="ul" fast>
            {services.map((service) => (
              <StaggerItem key={service.slug} as="li">
                <Link
                  href={service.href}
                  className="group flex items-baseline justify-between gap-4 border-b border-[var(--line)] py-4 transition-colors duration-200 hover:bg-[var(--surface)]"
                >
                  <span className="flex min-w-0 items-baseline gap-4">
                    <span className="shrink-0 font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1">
                      {service.number}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide transition-transform duration-300 group-hover:translate-x-0.5">
                      {service.title}
                    </span>
                  </span>
                  <span
                    className="shrink-0 text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealHeading className="display text-[clamp(2rem,4vw,3rem)]" mode="clip">
              {"Типы\nкотлов"}
            </RevealHeading>
          </div>
          <div className="lg:col-span-8">
            <RevealText className="mb-6 text-[var(--muted)]" delay={0.08}>
              <p>
                Работаем с паровыми и водогрейными котлами отечественного производства и
                котельно-вспомогательным оборудованием.
              </p>
            </RevealText>
            <Stagger className="flex flex-wrap gap-2" as="ul" fast>
              {boilerTypes.map((type) => (
                <StaggerItem key={type} as="li">
                  <span className="inline-block border border-[var(--line)] bg-[var(--background)] px-3 py-2 transition-colors duration-200 hover:border-[var(--blue)]">
                    {type}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="section border-b border-[var(--line)] overflow-x-clip" id="geography">
        <div className="container grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal variant="fade">
              <p className="eyebrow mb-3">География</p>
            </Reveal>
            <RevealHeading className="display text-[clamp(2rem,4.5vw,3.4rem)]" mode="lines">
              {"География\nработ"}
            </RevealHeading>
            <RevealText className="mt-5 text-[var(--muted)] prose-max" delay={0.1}>
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
      </section>

      <section className="section border-b border-[var(--line)]">
        <div className="container grid gap-10 lg:grid-cols-2">
          {[
            {
              title: "Квалификация специалистов",
              text: "Специалисты компании имеют действующую аттестацию НАКС по группе КО и необходимые допуски для работ на опасных производственных объектах.",
            },
            {
              title: "Технологии и контроль качества",
              text: "Применяем аттестованные технологии сварки, выполняем неразрушающий контроль и гидравлические испытания. По итогам работ передаём исполнительную документацию и протоколы.",
            },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <article className="group border border-[var(--line)] p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)]">
                <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
                  {card.title}
                </h2>
                <p className="mt-4 text-[var(--muted)]">{card.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section border-b border-[var(--line)]">
        <div className="container">
          <RevealHeading className="display mb-8 text-[clamp(2rem,4vw,3.2rem)]" mode="up">
            Фотографии объектов
          </RevealHeading>
          <Reveal variant="up">
            <ProjectGallery projects={projects.slice(0, 8)} />
          </Reveal>
        </div>
      </section>

      <section className="section bg-[var(--blue)] text-white">
        <div className="container flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <RevealHeading className="display text-[clamp(2rem,4vw,3.2rem)]" mode="lines">
              {"Разрешительные\nдокументы"}
            </RevealHeading>
            <RevealText className="mt-4 max-w-xl text-white/85" delay={0.1}>
              <p>
                {company.legalName} располагает комплектом допусков и разрешительных документов для
                работ на ОПО.
              </p>
            </RevealText>
          </div>
          <Reveal delay={0.16}>
            <Button href="/documents" variant="light">
              Смотреть документы
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
