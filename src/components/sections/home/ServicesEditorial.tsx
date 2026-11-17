"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { services } from "@/data/services";

const photoBySlug: Record<string, { src: string; alt: string }> = {
  "diagnostika-i-obsledovanie": {
    src: "/assets/projects/hq-techs-water-tubes.jpg",
    alt: "Обследование котельного оборудования",
  },
  "remont-kotlov": {
    src: "/assets/projects/hq-welder-boiler.jpg",
    alt: "Сварочные работы на котле",
  },
  "obmurovka-i-teploizolyatsiya": {
    src: "/assets/boilers/boiler-complete-platform.png",
    alt: "Котёл с обмуровкой и обвязкой на площадке",
  },
  "puskonaladochnye-raboty": {
    src: "/assets/projects/hq-boiler-row-gas.jpg",
    alt: "Котельная после пусконаладки",
  },
  "rekonstruktsiya-i-modernizatsiya": {
    src: "/assets/projects/hq-boiler-red-plate.jpg",
    alt: "Модернизированное котельное оборудование",
  },
  "postavka-komplektuyushchih": {
    src: "/assets/projects/hq-pipes-yellow-network.jpg",
    alt: "Трубопроводы и комплектующие",
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
              Основные виды работ и услуг — от диагностики и обследования до пусконаладки и
              поставки комплектующих с полным комплектом разрешительной и исполнительной
              документации. Подробное описание — на отдельных страницах услуг.
            </p>
          </RevealText>
        </div>

        <Stagger className="border-t border-[var(--line)]" fast>
          {services.map((service) => {
            const photo = photoBySlug[service.slug];
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
                    <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.15rem,1.8vw,1.65rem)] uppercase tracking-wide text-balance">
                      <span className="service-row-title relative">{service.title}</span>
                    </h3>
                  </div>
                  <div className="md:col-span-5">
                    <p className="text-[var(--muted)]">{service.cardDescription}</p>
                    <span className="mt-2 inline-block text-sm text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-0.5">
                      Полное описание →
                    </span>
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
