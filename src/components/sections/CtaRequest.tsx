"use client";

import Image from "next/image";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { RevealImage } from "@/components/motion/RevealImage";
import { company, emailHref, hasEmail, hasPhone, phoneHref } from "@/config/company";

type Props = {
  heading?: string;
  text?: string;
  id?: string;
};

export function CtaRequest({
  id = "request",
  heading = "Нужен ремонт\nили обслуживание\nкотельного оборудования?",
  text = "Оставьте заявку — инженер проконсультирует, оценит объём работ и подготовит коммерческое предложение.",
}: Props) {
  return (
    <section id={id} className="section border-b border-[var(--line)]">
      <div className="container grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <RevealHeading
            className="display whitespace-pre-line text-[clamp(2.2rem,5vw,3.8rem)] text-balance"
            mode="lines"
          >
            {heading}
          </RevealHeading>
          <RevealText className="mt-5 max-w-md text-[var(--muted)]" delay={0.1}>
            <p>{text}</p>
          </RevealText>
          <Reveal className="mt-6 grid gap-2 text-[var(--muted)]" delay={0.16}>
            {hasPhone() ? (
              <a
                href={phoneHref() ?? undefined}
                className="text-[var(--text)] transition-colors duration-200 hover:text-[var(--blue)]"
              >
                {company.phoneDisplay || company.phone}
              </a>
            ) : null}
            {hasEmail() ? (
              <a
                href={emailHref() ?? undefined}
                className="transition-colors duration-200 hover:text-[var(--blue)]"
              >
                {company.email}
              </a>
            ) : null}
          </Reveal>
          <RevealImage
            className="relative mt-8 hidden aspect-[16/10] border border-[var(--line)] lg:block"
            parallax
            hoverZoom
            delay={0.12}
          >
            <Image
              src="/assets/projects/hq-boiler-yellow-pipes.jpg"
              alt="Котельное оборудование с газовой обвязкой на объекте"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </RevealImage>
        </div>
        <Reveal
          className="border border-[var(--line)] bg-[var(--surface)] p-6 lg:col-span-7 lg:p-8"
          variant="up"
          delay={0.1}
        >
          <LeadForm />
        </Reveal>
      </div>
    </section>
  );
}
