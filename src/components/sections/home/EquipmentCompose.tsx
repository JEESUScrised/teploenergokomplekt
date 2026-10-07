"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { SectionHead } from "@/components/ui/SectionIndex";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

type EquipmentItem = {
  name: string;
  note?: string;
};

/** Captions only where classification is known from company materials */
const equipment: EquipmentItem[] = [
  { name: "ДКВР", note: "паровой котёл" },
  { name: "ДЕ", note: "паровой котёл" },
  { name: "КЕ", note: "паровой котёл" },
  { name: "ДСЕ", note: "паровой котёл" },
  { name: "ДЕВ", note: "водогрейный котёл" },
  { name: "КВЕ", note: "водогрейный котёл" },
  { name: "КВМ", note: "водогрейный котёл" },
  { name: "КВ-ГМ", note: "водогрейный котёл" },
  { name: "ПТВМ", note: "водогрейный котёл" },
  { name: "КВ-Р", note: "водогрейный котёл" },
  { name: "КВТС", note: "водогрейный котёл" },
  { name: "Другие типы" },
];

export function EquipmentCompose() {
  const reduce = usePrefersReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="section-loose border-b border-[var(--line)] overflow-x-clip">
      <div className="container">
        <SectionHead
          index="07"
          title={"Оборудование,\nс которым\nмы работаем"}
          lead="Паровые и водогрейные котлы отечественного производства и котельно-вспомогательное оборудование."
        />

        <ul className="equipment-compose" role="list">
          {equipment.map((item, i) => {
            const isActive = active === item.name;
            return (
              <motion.li
                key={item.name}
                className={`equipment-item ${isActive ? "is-active" : ""}`}
                tabIndex={0}
                onMouseEnter={() => setActive(item.name)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(item.name)}
                onBlur={() => setActive(null)}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.01 }}
                transition={{ duration: 0.4, ease: easeOutExpo, delay: i * 0.04 }}
              >
                <span className="equipment-name">{item.name}</span>
                {i < equipment.length - 1 ? (
                  <span className="equipment-dot" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                {item.note && isActive ? (
                  <span className="equipment-note">{item.note}</span>
                ) : null}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
