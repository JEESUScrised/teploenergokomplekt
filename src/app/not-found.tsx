"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

export default function NotFound() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="section">
      <div className="container max-w-2xl py-16">
        <motion.p
          className="eyebrow mb-3"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
        >
          404
        </motion.p>
        <motion.h1
          className="display text-[clamp(2.8rem,7vw,4.5rem)]"
          initial={reduce ? false : { opacity: 0, y: 20, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.7, delay: 0.08, ease: easeOutExpo }}
        >
          Страница не найдена
        </motion.h1>
        <motion.p
          className="mt-5 text-[var(--muted)]"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22, ease: easeOutExpo }}
        >
          Возможно, ссылка устарела или страница была перемещена. Перейдите на главную или в
          раздел услуг.
        </motion.p>
        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: easeOutExpo }}
        >
          <Button href="/">На главную</Button>
          <Button href="/services" variant="secondary">
            Услуги
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
