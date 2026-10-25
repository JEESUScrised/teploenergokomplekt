"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading } from "@/components/motion/RevealHeading";
import { RevealImage } from "@/components/motion/RevealImage";
import { company } from "@/config/company";

export function AboutStrip() {
  return (
    <section className="section-tight border-b border-[var(--line)]" aria-labelledby="about-heading">
      <div className="container">
        <Reveal variant="fade">
          <p className="eyebrow mb-3">Компания</p>
        </Reveal>
        <RevealHeading
          id="about-heading"
          as="h2"
          className="display mb-8 text-[clamp(2.3rem,4.8vw,3.8rem)] lg:mb-12"
          mode="clip"
        >
          О нас
        </RevealHeading>

        <Stagger className="grid items-stretch gap-5 lg:grid-cols-12 lg:gap-6" fast>
          <StaggerItem
            as="article"
            className="group flex h-full flex-col border border-[var(--line)] bg-[var(--surface)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] lg:col-span-3"
          >
            <div className="flex aspect-[16/11] items-center justify-center bg-[var(--pale-blue)] px-4 overflow-hidden">
              <Image
                src="/assets/brand/logo.png"
                alt={company.legalName}
                width={112}
                height={112}
                className="h-24 w-24 object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 lg:p-7">
              <p className="text-[var(--muted)] leading-relaxed prose-max transition-transform duration-300 group-hover:translate-y-[-2px]">
                ООО «Теплоэнергокомплект» работает с 2002 года и имеет многолетний опыт в ремонте,
                строительстве и обслуживании котельных, паровых и водогрейных котлов, а также
                котельно-вспомогательного оборудования. География реализованных проектов охватывает
                всю страну — от Белгорода до Находки.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem
            as="article"
            className="group flex h-full flex-col border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] lg:col-span-5"
          >
            <RevealImage
              className="relative aspect-[16/11] shrink-0 bg-[var(--pale-blue)]"
              hoverZoom
            >
              <Image
                src="/assets/boilers/boiler-cutout-repair.png"
                alt="Промышленный котёл на раме с площадкой и обвязкой"
                fill
                className="object-contain p-4 sm:p-6"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </RevealImage>
            <div className="flex flex-1 flex-col p-6 lg:p-7 transition-transform duration-300 group-hover:translate-y-[-2px]">
              <h3 className="font-[family-name:var(--font-display)] text-[1.55rem] uppercase tracking-wide text-balance">
                Профиль компании
              </h3>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                Полный цикл услуг: диагностика и дефектация, ремонт и модернизация, автоматизация,
                пусконаладочные работы. Выбор и поставка оборудования. Разработка проектной и
                сметной документации в полном объёме — с учётом требований действующих нормативов.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem
            as="article"
            className="group flex h-full flex-col border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] lg:col-span-4"
          >
            <RevealImage className="relative aspect-[16/11] shrink-0" hoverZoom delay={0.08}>
              <Image
                src="/assets/projects/hq-heatex-copper-tubes.jpg"
                alt="Поверхности нагрева котла на объекте"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </RevealImage>
            <div className="flex flex-1 flex-col p-6 lg:p-7 transition-transform duration-300 group-hover:translate-y-[-2px]">
              <h3 className="font-[family-name:var(--font-display)] text-[1.55rem] uppercase tracking-wide text-balance">
                Специализация
              </h3>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                Паровые и водогрейные котлы отечественного производства: ДКВР, ДЕ, КЕ, КВ-ГМ
                (ПТВМ), КВ-Р (КВТС) и других типов.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
