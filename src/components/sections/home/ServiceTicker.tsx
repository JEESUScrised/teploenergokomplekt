"use client";

import { useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const items = [
  "Ремонт котлов",
  "Реконструкция",
  "Пусконаладка",
  "Обмуровка",
  "Диагностика",
  "Обслуживание",
  "Комплектующие",
];

export function ServiceTicker() {
  const sequence = [...items, ...items];
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="marquee"
      aria-label="Основные услуги"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`marquee-track ${paused || reduce ? "is-paused" : ""} ${reduce ? "is-static" : ""}`}
      >
        {sequence.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item} <span className="mx-2 text-[var(--line)]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}