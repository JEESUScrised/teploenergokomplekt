"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { services } from "@/data/services";

const photoByIndex: Record<number, { src: string; alt: string }> = {
  0: {
    src: "/assets/projects/hq-welder-boiler.jpg",
    alt: "Сварочные работы на котле",
  },
  2: {
    src: "/assets/projects/hq-boiler-row-gas.jpg",
    alt: "Ряд котлов с газовой обвязкой",
  },
  5: {
    src: "/assets/projects/hq-boiler-red-plate.jpg",
    alt: "Котельное оборудование на объекте",
  },
};

export function ServicesEditorial() {
  return (
    <section className="section border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal variant="fade">
              <p className="eyebrow mb-3">Специализация</p>
            </Reveal>
            <RevealHeading className="display text-[clamp(2.3rem,4.8vw,3.8rem)]" mode="lines">
              Услуги
            </RevealHeading>
          </div>
          <RevealText className="max-w-md text-[var(--muted)] prose-max" delay={0.12}>
            <p>
              Семь направлений полного цикла — от диагностики и ремонта до пусконаладки и поставки
              комплектующих. Подробное описание — на отдельных страницах услуг.
            </p>
          </RevealText>
        </div>

        <Stagger className="border-t border-[var(--line)]" fast>
          {services.map((service, index) => {
            const photo = photoByIndex[index];
            return (
              <StaggerItem key={service.slug}>
                <Link
                  href={service.href}
                  className="service-row group grid gap-3 border-b border-[var(--line)] py-6 transition-colors duration-200 hover:bg-[var(--background)] md:grid-cols-12 md:items-center md:gap-5 md:py-7"
                >
                  <div className="md:col-span-1">
                    <span className="service-row-num font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)] inline-block transition-transform duration-300 group-hover:translate-x-1">
                      {service.number}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.3rem,2vw,1.75rem)] uppercase tracking-wide text-balance">
                      <span className="service-row-title relative">{service.title}</span>
                    </h3>
                  </div>
                  <div className="md:col-span-5">
                    <p className="text-[var(--muted)]">{service.cardDescription}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                    {photo ? (
                      <span className="relative hidden h-14 w-20 overflow-hidden border border-[var(--line)] md:block">
                        <Image
                          src={photo.src}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          sizes="80px"
                        />
                      </span>
                    ) : (
                      <span className="hidden md:block" />
                    )}
                    <span className="row-arrow link-arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
