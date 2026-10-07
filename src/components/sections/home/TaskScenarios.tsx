"use client";

import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionIndex";

const tasks = [
  {
    number: "01",
    problem: "Котёл требует ремонта или остановлен",
    dest: "Ремонт котлов",
    href: "/services/remont-kotlov",
  },
  {
    number: "02",
    problem: "Оборудование устарело или требуется повысить эффективность",
    dest: "Реконструкция и модернизация",
    href: "/services/rekonstruktsiya-i-modernizatsiya",
  },
  {
    number: "03",
    problem: "Необходимо запустить котёл после монтажа или ремонта",
    dest: "Пусконаладочные работы",
    href: "/services/puskonaladochnye-raboty",
  },
  {
    number: "04",
    problem: "Разрушается футеровка или теплоизоляция",
    dest: "Обмуровка и теплоизоляция",
    href: "/services/obmurovka-i-teploizolyatsiya",
  },
  {
    number: "05",
    problem: "Необходимо определить техническое состояние",
    dest: "Диагностика и обследование",
    href: "/services/diagnostika-i-obsledovanie",
  },
  {
    number: "06",
    problem: "Нужно регулярное сопровождение котельной",
    dest: "Обслуживание",
    href: "/services/obsluzhivanie-kotelnyh",
  },
  {
    number: "07",
    problem: "Нужны запасные части или узлы",
    dest: "Комплектующие",
    href: "/services/postavka-komplektuyushchih",
  },
];

export function TaskScenarios() {
  return (
    <section className="section border-b border-[var(--line)]" id="tasks">
      <div className="container">
        <SectionHead
          index="03"
          title={"С какой\nзадачей вы\nпришли"}
          lead="Типовые ситуации на объекте — и направление работ, которое им соответствует."
        />

        <Stagger className="editorial-rows border-t border-[var(--line)]" as="ul" fast>
          {tasks.map((task) => (
            <StaggerItem key={task.number} as="li">
              <Link href={task.href} className="editorial-row group">
                <span className="editorial-row-num">{task.number}</span>
                <span className="editorial-row-title">{task.problem}</span>
                <span className="editorial-row-dest">
                  {task.dest}
                  <span className="editorial-row-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
