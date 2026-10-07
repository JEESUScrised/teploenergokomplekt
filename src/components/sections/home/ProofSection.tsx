"use client";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionIndex";

const cells = [
  {
    mark: "НАКС",
    text: "Аттестованные специалисты по группе КО",
  },
  {
    mark: "ОПО",
    text: "Допуски для выполнения соответствующих работ на опасных производственных объектах",
  },
  {
    mark: "НК",
    text: "Неразрушающий контроль сварных соединений",
  },
  {
    mark: "ГИДРО",
    text: "Гидравлические испытания оборудования после ремонта",
  },
  {
    mark: "ДОКУМЕНТЫ",
    text: "Исполнительные документы, протоколы и режимные карты",
  },
  {
    mark: "РОССИЯ",
    text: "Выезд специалистов в регионы",
  },
  {
    mark: "ЗАПЧАСТИ",
    text: "Поставка необходимых энергозапчастей",
  },
];

export function ProofSection() {
  return (
    <section className="section-loose bg-[var(--blue)] text-white" id="proof">
      <div className="container">
        <SectionHead
          index="11"
          title={"Почему\nнам доверяют"}
          lead="Не маркетинговые обещания — конкретные элементы организации работ."
          light
        />

        <Stagger className="proof-grid" fast>
          {cells.map((cell) => (
            <StaggerItem key={cell.mark} as="article" className="proof-cell">
              <p className="proof-mark">{cell.mark}</p>
              <p className="proof-text">{cell.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
