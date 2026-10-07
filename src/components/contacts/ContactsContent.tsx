"use client";

import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import {
  company,
  emailHref,
  hasAddress,
  hasEmail,
  hasPhone,
  phoneHref,
} from "@/config/company";

export function ContactsContent() {
  return (
    <>
      <section className="border-b border-[var(--line)]">
        <div className="container py-12 lg:py-16">
          <RevealHeading className="display text-[clamp(2.8rem,7vw,5rem)]" mode="lines">
            Контакты
          </RevealHeading>
          <RevealText className="mt-6 max-w-2xl text-[1.08rem] text-[var(--muted)]" delay={0.12}>
            <p>
              Свяжитесь с нами для консультации, выезда специалиста или подготовки коммерческого
              предложения.
            </p>
          </RevealText>
        </div>
      </section>

      <section className="section border-b border-[var(--line)]">
        <div className="container grid gap-10 lg:grid-cols-12">
          <Stagger className="lg:col-span-5 grid gap-6" fast>
            <StaggerItem>
              <div className="border border-[var(--line)] p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--blue)]">
                <p className="eyebrow mb-2">Телефон</p>
                {hasPhone() ? (
                  <a href={phoneHref() ?? undefined} className="text-2xl text-[var(--blue)]">
                    {company.phoneDisplay || company.phone}
                  </a>
                ) : (
                  <p className="text-[var(--muted)]">
                    Укажите номер в <code className="text-[var(--text)]">src/config/company.ts</code>
                  </p>
                )}
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="border border-[var(--line)] p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--blue)]">
                <p className="eyebrow mb-2">E-mail</p>
                {hasEmail() ? (
                  <a href={emailHref() ?? undefined} className="text-xl text-[var(--blue)]">
                    {company.email}
                  </a>
                ) : (
                  <p className="text-[var(--muted)]">
                    Укажите e-mail в <code className="text-[var(--text)]">src/config/company.ts</code>
                  </p>
                )}
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="border border-[var(--line)] p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--blue)]">
                <p className="eyebrow mb-2">Адрес</p>
                {hasAddress() ? (
                  <p className="text-xl">{company.address}</p>
                ) : (
                  <p className="text-[var(--muted)]">
                    Укажите адрес в <code className="text-[var(--text)]">src/config/company.ts</code>.
                    Карта будет подключена после заполнения адреса.
                  </p>
                )}
              </div>
            </StaggerItem>
          </Stagger>

          <Reveal
            id="request"
            className="border border-[var(--line)] bg-[var(--surface)] p-6 lg:col-span-7 lg:p-8"
            delay={0.1}
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide">
              Заказать звонок
            </h2>
            <p className="mt-3 mb-6 text-[var(--muted)]">
              Оставьте заявку — инженер свяжется с вами для уточнения задачи.
            </p>
            <LeadForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
