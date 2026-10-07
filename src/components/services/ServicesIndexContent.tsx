"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { RevealImage } from "@/components/motion/RevealImage";
import { services } from "@/data/services";

export function ServicesIndexContent() {
  return (
    <>
      <section className="border-b border-[var(--line)]">
        <div className="container py-12 lg:py-16">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">Полный цикл</p>
          </Reveal>
          <RevealHeading className="display text-[clamp(2.8rem,7vw,5rem)]" mode="lines">
            Услуги
          </RevealHeading>
          <RevealText className="mt-6 max-w-2xl text-[1.08rem] text-[var(--muted)]" delay={0.12}>
            <p>
              Ремонт, реконструкция, пусконаладка, обмуровка, диагностика, обслуживание котельных и
              поставка комплектующих — с выездом специалистов по России.
            </p>
          </RevealText>
        </div>
      </section>

      {services.map((service, index) => {
        const reverse = index % 2 === 1;
        return (
          <section key={service.slug} className="border-b border-[var(--line)]">
            <div
              className={`container grid items-center gap-8 py-12 lg:grid-cols-12 lg:py-16 ${
                reverse ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className={`lg:col-span-6 ${reverse ? "lg:[direction:ltr]" : ""}`}>
                <Reveal variant="fade">
                  <p className="eyebrow mb-3">{service.number}</p>
                </Reveal>
                <RevealHeading
                  className="display text-[clamp(2rem,4vw,3.2rem)]"
                  mode={index % 2 === 0 ? "clip" : "up"}
                >
                  {service.title}
                </RevealHeading>
                <RevealText className="mt-5 text-[var(--muted)]" delay={0.08}>
                  <p>{service.intro}</p>
                </RevealText>
                <RevealText className="mt-4 text-[var(--muted)]" delay={0.14}>
                  <p>{service.cardDescription}</p>
                </RevealText>
                <Reveal delay={0.18}>
                  <Link href={service.href} className="link-arrow mt-6">
                    Подробнее →
                  </Link>
                </Reveal>
              </div>
              <div className={`lg:col-span-6 ${reverse ? "lg:[direction:ltr]" : ""}`}>
                <RevealImage
                  direction={reverse ? "left" : "scale"}
                  hoverZoom
                  className="mx-auto w-full max-w-md"
                >
                  <Image
                    src={service.heroImage}
                    alt={service.heroImageAlt}
                    width={900}
                    height={700}
                    className="mx-auto w-full max-w-md object-contain"
                    sizes="(max-width: 1024px) 80vw, 40vw"
                  />
                </RevealImage>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
