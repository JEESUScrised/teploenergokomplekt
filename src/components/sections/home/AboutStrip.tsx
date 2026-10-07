"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading } from "@/components/motion/RevealHeading";
import { RevealImage } from "@/components/motion/RevealImage";
import { company } from "@/config/company";

export function AboutStrip() {
  return (
    <section className="section-tight border-b border-[var(--line)]">
      <div className="container">
        <Reveal variant="fade">
          <p className="eyebrow mb-3">Компания</p>
        </Reveal>
        <RevealHeading
          className="display mb-8 text-[clamp(2.3rem,4.8vw,3.8rem)] lg:mb-12"
          mode="clip"
        >
          О нас
        </RevealHeading>

        <Stagger className="grid gap-5 lg:grid-cols-12 lg:gap-6" fast>
          <StaggerItem
            as="article"
            className="group border border-[var(--line)] bg-[var(--surface)] p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] lg:col-span-3 lg:p-7"
          >
            <div className="mb-8 flex min-h-[9.5rem] items-center justify-center bg-[var(--pale-blue)] px-4 py-8 overflow-hidden">
              <Image
                src="/assets/brand/logo.png"
                alt={company.legalName}
                width={112}
                height={112}
                className="h-24 w-24 object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <p className="text-[var(--muted)] leading-relaxed prose-max transition-transform duration-300 group-hover:translate-y-[-2px]">
              ООО «Теплоэнергокомплект» имеет многолетний опыт в ремонте, строительстве и
              обслуживании котельных, паровых и водогрейных котлов и котельно-вспомогательного
              оборудования.
            </p>
          </StaggerItem>

          <StaggerItem
            as="article"
            className="group border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] lg:col-span-5"
          >
            <RevealImage className="relative aspect-[16/11]" hoverZoom>
              <Image
                src="/assets/projects/hq-boiler-blue-green.jpg"
                alt="Промышленный котёл с трубопроводами на объекте"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </RevealImage>
            <div className="p-6 lg:p-7 transition-transform duration-300 group-hover:translate-y-[-2px]">
              <h3 className="font-[family-name:var(--font-display)] text-[1.55rem] uppercase tracking-wide text-balance">
                Компания
              </h3>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                Компания предоставляет сервис полного цикла — от обследования и дефектации до
                пусконаладки, документального сопровождения и планового обслуживания.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem
            as="article"
            className="group border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] lg:col-span-4"
          >
            <RevealImage className="relative aspect-[4/3]" hoverZoom delay={0.08}>
              <Image
                src="/assets/projects/hq-heatex-copper-tubes.jpg"
                alt="Поверхности нагрева котла на объекте"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </RevealImage>
            <div className="p-6 lg:p-7 transition-transform duration-300 group-hover:translate-y-[-2px]">
              <h3 className="font-[family-name:var(--font-display)] text-[1.55rem] uppercase tracking-wide text-balance">
                Обслуживаемое оборудование
              </h3>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                Ремонт котлов паровых и водогрейных отечественного производства — ДКВР, ДЕ, КЕ,
                ДСЕ, ДЕВ, КВЕ, КВМ, КВ-ГМ (ПТВМ), КВ-Р (КВТС) и других типов.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
