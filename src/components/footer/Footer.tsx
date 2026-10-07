"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { company, emailHref, hasEmail, hasPhone, phoneHref } from "@/config/company";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="container grid gap-10 py-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="flex items-start gap-4">
            <Image
              src="/assets/brand/logo.png"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl uppercase tracking-wide">
                {company.legalName}
              </p>
              <p className="mt-3 max-w-md text-[var(--muted)]">{company.tagline}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-3" delay={0.08}>
          <p className="eyebrow mb-4">Навигация</p>
          <ul className="grid gap-2">
            {[
              { href: "/about", label: "О компании" },
              { href: "/services", label: "Услуги" },
              { href: "/documents", label: "Разрешительные документы" },
              { href: "/contacts", label: "Контакты" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-[var(--blue)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="lg:col-span-4">
          <Reveal delay={0.12}>
            <p className="eyebrow mb-4">Услуги</p>
          </Reveal>
          <Stagger className="grid gap-2" as="ul" fast>
            {services.map((service) => (
              <StaggerItem key={service.slug} as="li">
                <Link
                  href={service.href}
                  className="inline-block transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-[var(--blue)]"
                >
                  {service.navTitle}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          {(hasPhone() || hasEmail()) && (
            <Reveal className="mt-6 grid gap-1 text-[var(--muted)]" delay={0.16}>
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
          )}
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="container flex flex-col gap-2 py-5 text-sm text-[var(--muted)] sm:flex-row sm:justify-between">
          <p>
            © {company.legalName}, {company.year}.
          </p>
          <p>Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
