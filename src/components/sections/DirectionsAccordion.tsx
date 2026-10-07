"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

export type DirectionItem = {
  id: string;
  title: string;
  items: string[];
  href: string;
};

type Props = {
  items: DirectionItem[];
};

export function DirectionsAccordion({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const reduce = usePrefersReducedMotion();

  return (
    <div className="border-y border-[var(--line)]">
      {items.map((item, index) => {
        const open = openId === item.id;
        return (
          <motion.div
            key={item.id}
            className="direction-row border-b border-[var(--line)] last:border-b-0"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: easeOutExpo, delay: index * 0.05 }}
          >
            <button
              type="button"
              className="group flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span className="flex min-w-0 items-baseline gap-3 sm:gap-4">
                <span className="shrink-0 font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[clamp(1.15rem,2.4vw,1.7rem)] uppercase tracking-wide text-balance">
                  {item.title}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="accordion-icon shrink-0 text-[var(--blue)] text-xl transition-transform duration-300 group-hover:translate-x-0.5"
              >
                {open ? "−" : "+"}
              </span>
            </button>
            <div className="accordion-panel" data-open={open}>
              <div>
                <div className="pb-6 pl-0 sm:pl-12">
                  <ul className="grid gap-2 text-[var(--muted)] md:grid-cols-2">
                    {item.items.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 bg-[var(--blue)]" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={item.href} className="link-arrow mt-5">
                    Подробнее об услуге →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
