"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { company, hasPhone, phoneHref } from "@/config/company";
import { services } from "@/data/services";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";
import { Button } from "@/components/ui/Button";

const nav = [
  { label: "О компании", href: "/about" },
  { label: "Услуги", href: "/services", hasDropdown: true },
  { label: "Документы", href: "/documents", fullLabel: "Разрешительные документы" },
  { label: "Контакты", href: "/contacts" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [servicesMobileOpen, setServicesMobileOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const dropdownId = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`site-header sticky top-0 z-50 border-b bg-[var(--background)] ${
        scrolled ? "site-header--scrolled" : ""
      }`}
      initial={reduce ? false : { opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: easeOutExpo }}
    >
      <div className="container header-bar flex items-center justify-between">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.08, ease: easeOutExpo }}
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 sm:gap-3"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/assets/brand/logo.png"
              alt={company.legalName}
              width={56}
              height={56}
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
              priority
            />
            <span className="block font-[family-name:var(--font-display)] text-[0.68rem] uppercase tracking-[0.06em] leading-tight max-w-[7.5rem] sm:max-w-[9.5rem] sm:text-[0.72rem] xl:max-w-[11rem] xl:text-[0.78rem]">
              {company.shortName}
            </span>
          </Link>
        </motion.div>

        <nav
          className="header-nav hidden min-[1100px]:flex items-center"
          aria-label="Основная навигация"
        >
          {nav.map((item, index) =>
            item.hasDropdown ? (
              <motion.div
                key={item.href}
                className="relative"
                ref={dropdownRef}
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.16 + index * 0.06, ease: easeOutExpo }}
              >
                <button
                  type="button"
                  className="nav-link inline-flex items-center gap-1.5"
                  aria-expanded={servicesOpen}
                  aria-controls={dropdownId}
                  onClick={() => setServicesOpen((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setServicesOpen(true);
                    }
                  }}
                >
                  {item.label}
                  <motion.span
                    aria-hidden="true"
                    className="text-[0.65rem] opacity-70 inline-block"
                    animate={{ rotate: servicesOpen ? 180 : 0, y: servicesOpen ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: easeOutExpo }}
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {servicesOpen ? (
                    <motion.div
                      id={dropdownId}
                      className="absolute left-0 top-[calc(100%+0.7rem)] w-[21.5rem] border border-[var(--line)] bg-[var(--surface)] p-2 overflow-hidden"
                      role="menu"
                      initial={
                        reduce
                          ? false
                          : { opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }
                      }
                      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                      exit={{ opacity: 0, y: -6, clipPath: "inset(0 0 100% 0)" }}
                      transition={{ duration: 0.32, ease: easeOutExpo }}
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: {},
                          visible: {
                            transition: { staggerChildren: 0.04, delayChildren: 0.04 },
                          },
                        }}
                      >
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <Link
                            href="/services"
                            className="block px-3 py-2 text-sm font-medium text-[var(--blue)] hover:bg-[var(--blue-light)]"
                            role="menuitem"
                            onClick={() => setServicesOpen(false)}
                          >
                            Все услуги
                          </Link>
                        </motion.div>
                        <div className="my-1 h-px bg-[var(--line)]" />
                        {services.map((service) => (
                          <motion.div
                            key={service.slug}
                            variants={{
                              hidden: { opacity: 0, y: 8 },
                              visible: { opacity: 1, y: 0 },
                            }}
                          >
                            <Link
                              href={service.href}
                              className="block px-3 py-2.5 text-[0.95rem] hover:bg-[var(--blue-light)] transition-colors duration-150"
                              role="menuitem"
                              onClick={() => setServicesOpen(false)}
                            >
                              {service.navTitle}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key={item.href}
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.16 + index * 0.06, ease: easeOutExpo }}
              >
                <Link
                  href={item.href}
                  className="nav-link"
                  title={"fullLabel" in item ? item.fullLabel : undefined}
                >
                  {"fullLabel" in item ? (
                    <>
                      <span className="xl:hidden">{item.label}</span>
                      <span className="hidden xl:inline">{item.fullLabel}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </Link>
              </motion.div>
            ),
          )}
        </nav>

        <motion.div
          className="hidden min-[1100px]:flex items-center gap-3 xl:gap-4 shrink-0"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.42, ease: easeOutExpo }}
        >
          {hasPhone() ? (
            <a
              href={phoneHref() ?? undefined}
              className="font-[family-name:var(--font-display)] tracking-wide text-[var(--blue)] text-sm xl:text-base"
            >
              {company.phoneDisplay || company.phone}
            </a>
          ) : null}
          <Button href="/contacts#request" variant="primary" className="header-cta">
            Заказать звонок
          </Button>
        </motion.div>

        <button
          type="button"
          className="min-[1100px]:hidden inline-flex h-11 w-11 items-center justify-center border border-[var(--line)]"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Меню</span>
          <span aria-hidden="true" className="flex flex-col gap-1.5">
            <span
              className={`block h-px w-5 bg-[var(--text)] transition duration-200 ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-[var(--text)] transition duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-[var(--text)] transition duration-200 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="min-[1100px]:hidden fixed inset-0 top-[var(--header-h)] z-40 bg-[var(--background)] overflow-y-auto"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: easeOutExpo }}
          >
            <div className="container flex min-h-full flex-col py-5">
              {[
                { href: "/about", label: "О компании" },
                null,
                { href: "/documents", label: "Разрешительные документы" },
                { href: "/contacts", label: "Контакты" },
              ].map((item, i) =>
                item === null ? (
                  <div key="services" className="border-b border-[var(--line)] py-4">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-1 text-left"
                      aria-expanded={servicesMobileOpen}
                      onClick={() => setServicesMobileOpen((v) => !v)}
                    >
                      <span className="text-[1.35rem] font-[family-name:var(--font-display)] uppercase tracking-wide">
                        Услуги
                      </span>
                      <span className="text-[var(--blue)] text-xl" aria-hidden="true">
                        {servicesMobileOpen ? "−" : "+"}
                      </span>
                    </button>
                    <div className="accordion-panel" data-open={servicesMobileOpen}>
                      <div>
                        <div className="grid gap-1 pb-2 pt-3">
                          <Link
                            href="/services"
                            className="py-2.5 text-[var(--blue)]"
                            onClick={() => setOpen(false)}
                          >
                            Все услуги
                          </Link>
                          {services.map((service) => (
                            <Link
                              key={service.slug}
                              href={service.href}
                              className="py-2.5 text-[1.05rem]"
                              onClick={() => setOpen(false)}
                            >
                              {service.navTitle}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: easeOutExpo }}
                  >
                    <Link
                      href={item.href}
                      className="border-b border-[var(--line)] py-5 block text-[1.35rem] font-[family-name:var(--font-display)] uppercase tracking-wide"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ),
              )}
              {hasPhone() ? (
                <a href={phoneHref() ?? undefined} className="py-5 text-lg text-[var(--blue)]">
                  {company.phoneDisplay || company.phone}
                </a>
              ) : null}
              <div className="mt-auto pt-8 pb-6">
                <Link
                  href="/contacts#request"
                  className="btn btn-primary w-full"
                  onClick={() => setOpen(false)}
                >
                  Заказать звонок
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
