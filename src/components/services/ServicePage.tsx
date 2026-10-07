"use client";

import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaRequest } from "@/components/sections/CtaRequest";
import { ProjectGallery } from "@/components/gallery/ProjectGallery";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { RevealImage } from "@/components/motion/RevealImage";
import { getRelatedServices, type Service } from "@/data/services";
import { projectsForTags } from "@/data/projects";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

type Props = {
  service: Service;
};

export function ServicePage({ service }: Props) {
  const related = getRelatedServices(service);
  const projectImages = projectsForTags(service.projectTags);
  const reduce = usePrefersReducedMotion();

  return (
    <>
      <section className="overflow-x-clip border-b border-[var(--line)]">
        <div className="container py-8 lg:py-12">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <Breadcrumbs
              items={[
                { label: "Главная", href: "/" },
                { label: "Услуги", href: "/services" },
                { label: service.title },
              ]}
            />
          </motion.div>
          <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6 xl:col-span-7">
              <motion.p
                className="eyebrow mb-3"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: easeOutExpo }}
              >
                {service.number}
              </motion.p>
              <motion.h1
                className="display text-[clamp(2rem,4.6vw,3.6rem)] leading-[0.98] text-balance"
                initial={reduce ? false : { opacity: 0, y: 22, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: 0.75, delay: 0.18, ease: easeOutExpo }}
              >
                {service.h1}
              </motion.h1>
              <motion.p
                className="mt-5 max-w-2xl text-[1.05rem] text-[var(--muted)] prose-max"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.4, ease: easeOutExpo }}
              >
                {service.intro}
              </motion.p>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.55, ease: easeOutExpo }}
              >
                <Link href="/contacts#request" className="btn btn-primary mt-7 w-full sm:w-auto">
                  Получить консультацию
                </Link>
              </motion.div>
            </div>
            <div className="service-hero-visual lg:col-span-6 xl:col-span-5">
              <RevealImage
                className="service-hero-visual-inner relative"
                direction="scale"
                parallax
                delay={0.25}
              >
                <Image
                  src={service.heroImage}
                  alt={service.heroImageAlt}
                  width={900}
                  height={900}
                  priority
                  className="mx-auto h-full w-full object-contain"
                  sizes="(max-width: 1023px) 110vw, 42vw"
                />
              </RevealImage>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-b border-[var(--line)]">
        <div className="container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealHeading
              className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
              mode="up"
            >
              Обзор услуги
            </RevealHeading>
          </div>
          <Stagger className="lg:col-span-8 grid gap-4" fast>
            {service.overview.map((paragraph) => (
              <StaggerItem key={paragraph}>
                <p className="text-[1.05rem] text-[var(--muted)]">{paragraph}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <RevealHeading
              className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
              mode="clip"
            >
              Состав работ
            </RevealHeading>
            <Stagger className="mt-6 grid gap-3" as="ul" fast>
              {service.scope.map((item) => (
                <StaggerItem key={item} as="li" className="flex gap-3 border-b border-[var(--line)] pb-3">
                  <span className="mt-2 size-1.5 shrink-0 bg-[var(--blue)]" />
                  <span>{item}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div>
            <RevealHeading
              className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
              mode="up"
            >
              Применимое оборудование
            </RevealHeading>
            <Stagger className="mt-6 flex flex-wrap gap-2" as="ul" fast>
              {service.equipment.map((item) => (
                <StaggerItem key={item} as="li">
                  <span className="inline-block border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-sm transition-colors duration-200 hover:border-[var(--blue)]">
                    {item}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="section border-b border-[var(--line)]">
        <div className="container">
          <RevealHeading className="display mb-10 text-[clamp(2rem,4vw,3.2rem)]" mode="lines">
            Процесс работы
          </RevealHeading>
          <div className="grid gap-6">
            {service.process.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.06}>
                <div className="grid gap-3 border border-[var(--line)] p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--blue)] md:grid-cols-12">
                  <div className="md:col-span-2">
                    <span className="display text-4xl text-[var(--blue)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-wide">
                      {step.title}
                    </h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-[var(--muted)]">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {service.sections.map((section) => (
        <section key={section.title} className="section border-b border-[var(--line)]">
          <div className="container grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <RevealHeading
                className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
                mode="up"
              >
                {section.title}
              </RevealHeading>
            </div>
            <div className="lg:col-span-8">
              {section.paragraphs?.map((p, i) => (
                <RevealText key={p} className="mb-4 text-[var(--muted)]" delay={i * 0.05}>
                  <p>{p}</p>
                </RevealText>
              ))}
              {section.list ? (
                <Stagger className="grid gap-2 md:grid-cols-2" as="ul" fast>
                  {section.list.map((item) => (
                    <StaggerItem key={item} as="li" className="flex gap-2 border-b border-[var(--line)] pb-2">
                      <span className="mt-2 size-1.5 shrink-0 bg-[var(--blue)]" />
                      <span>{item}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      <section className="section border-b border-[var(--line)]">
        <div className="container">
          <RevealHeading className="display mb-4 text-[clamp(2rem,4vw,3.2rem)]" mode="clip">
            Объекты
          </RevealHeading>
          <RevealText className="mb-8 max-w-2xl text-[var(--muted)]" delay={0.08}>
            <p>Фотографии с объектов компании. Подписи содержат оборудование, город и год.</p>
          </RevealText>
          <Reveal variant="up">
            <ProjectGallery projects={projectImages} />
          </Reveal>
        </div>
      </section>

      <section className="section border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealHeading
              className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
              mode="up"
            >
              Что получает заказчик
            </RevealHeading>
          </div>
          <Stagger className="lg:col-span-8 grid gap-3" as="ul" fast>
            {service.deliverables.map((item) => (
              <StaggerItem key={item} as="li">
                <span className="block border border-[var(--line)] bg-[var(--background)] px-4 py-3 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--blue)]">
                  {item}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section border-b border-[var(--line)]">
        <div className="container">
          <RevealHeading className="display mb-8 text-[clamp(2rem,4vw,3rem)]" mode="lines">
            Смежные услуги
          </RevealHeading>
          <Stagger className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <StaggerItem key={item.slug}>
                <Link
                  href={item.href}
                  className="group block border border-[var(--line)] p-5 transition-[background-color,transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] hover:bg-[var(--surface)]"
                >
                  <p className="text-sm text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1">
                    {item.number}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--muted)]">{item.cardDescription}</p>
                  <span className="link-arrow mt-4">Подробнее →</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaRequest heading={service.ctaHeading} />
    </>
  );
}
