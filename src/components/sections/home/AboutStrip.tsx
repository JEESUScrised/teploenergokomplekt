"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { company } from "@/config/company";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function AboutStrip() {
  const reduce = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    isDesktop && !reduce ? [0, 28] : [0, 0],
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    isDesktop && !reduce ? [1, 1.04] : [1, 1],
  );

  return (
    <section
      id="about"
      className={`about-hero border-b border-[var(--line)] ${reduce ? "about-hero--reduced" : ""}`}
      aria-labelledby="about-heading"
    >
      <div className="container about-hero-inner">
        <div className="about-hero-intro">
          <p
            className="eyebrow mb-3 lg:mb-4 about-hero-anim"
            style={{ ["--about-delay" as string]: "0.04s" }}
          >
            ООО «ТЕПЛОЭНЕРГОКОМПЛЕКТ»
          </p>
          <h1
            id="about-heading"
            className="display text-[clamp(2.8rem,8vw,5.4rem)] text-balance about-hero-anim"
            style={{ ["--about-delay" as string]: "0.08s" }}
          >
            О нас
          </h1>
          <div
            className="mt-4 max-w-2xl text-[1.05rem] text-[var(--muted)] lg:mt-5 about-hero-anim"
            style={{ ["--about-delay" as string]: "0.14s" }}
          >
            <p>
              Ремонт, реконструкция и монтаж паровых и водогрейных котлов и вспомогательного
              оборудования. Полный цикл работ по России — от Белгорода до Находки.
            </p>
          </div>
          <div className="about-hero-actions">
            <div
              className="w-full sm:w-auto about-hero-anim"
              style={{ ["--about-delay" as string]: "0.2s" }}
            >
              <Button href="/contacts#request" className="w-full sm:w-auto">
                Получить консультацию
              </Button>
            </div>
            <div
              className="w-full sm:w-auto about-hero-anim"
              style={{ ["--about-delay" as string]: "0.26s" }}
            >
              <Button href="/services" variant="secondary" className="w-full sm:w-auto">
                Наши услуги
              </Button>
            </div>
          </div>
        </div>

        <Stagger
          className="about-hero-grid"
          fast
        >
          <StaggerItem
            as="article"
            className="group about-hero-card about-hero-card--side flex h-full flex-col border border-[var(--line)] bg-[var(--surface)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)]"
          >
            <div className="flex aspect-[16/11] items-center justify-center bg-[var(--pale-blue)] px-4 overflow-hidden lg:aspect-auto lg:min-h-[220px]">
              <Image
                src="/assets/brand/logo.png"
                alt={company.legalName}
                width={128}
                height={128}
                className="h-24 w-24 object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] lg:h-28 lg:w-28"
                priority
              />
            </div>
            <div className="flex flex-1 flex-col p-5 lg:p-6">
              <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-wide">
                Компания
              </h2>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                ООО «Теплоэнергокомплект» работает с 2002 года и имеет многолетний опыт в ремонте,
                строительстве и обслуживании котельных, паровых и водогрейных котлов, а также
                котельно-вспомогательного оборудования. География реализованных проектов охватывает
                всю страну — от Белгорода до Находки.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem
            as="article"
            className="group about-hero-card about-hero-card--center flex h-full flex-col border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)]"
          >
            <div
              ref={visualRef}
              className="relative about-hero-boiler bg-[var(--pale-blue)] overflow-hidden about-hero-anim-clip"
            >
              <div className="about-hero-rule-v origin-top about-hero-anim-rule-v" aria-hidden="true" />
              <div className="about-hero-rule-h origin-left about-hero-anim-rule-h" aria-hidden="true" />
              <motion.div
                className="absolute inset-0 origin-center"
                style={{ y: imageY, scale: imageScale }}
              >
                <Image
                  src="/assets/boilers/boiler-cutout-repair.png"
                  alt="Промышленный котёл на раме с площадкой и обвязкой"
                  fill
                  priority
                  className="object-contain object-center p-3 sm:p-5 lg:p-6"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </motion.div>
            </div>
            <div className="flex flex-1 flex-col p-5 lg:p-7">
              <h2 className="font-[family-name:var(--font-display)] text-[1.55rem] uppercase tracking-wide text-balance">
                Профиль компании
              </h2>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                Полный цикл услуг: диагностика и дефектация, ремонт и модернизация, автоматизация,
                пусконаладочные работы. Выбор и поставка оборудования. Разработка проектной и
                сметной документации в полном объёме — с учётом требований действующих нормативов.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem
            as="article"
            className="group about-hero-card about-hero-card--side flex h-full flex-col border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)]"
          >
            <div className="relative aspect-[16/11] shrink-0 overflow-hidden lg:aspect-auto lg:min-h-[220px]">
              <Image
                src="/assets/projects/hq-heatex-copper-tubes.jpg"
                alt="Поверхности нагрева котла"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1023px) 100vw, 28vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-5 lg:p-6">
              <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-wide">
                Специализация
              </h2>
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
