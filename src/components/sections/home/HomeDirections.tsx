"use client";

import { PipeDecor } from "@/components/motion/PipeDecor";
import { Reveal } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { DirectionsAccordion, type DirectionItem } from "@/components/sections/DirectionsAccordion";

const directions: DirectionItem[] = [
  {
    id: "nodes",
    title: "Ремонт и замена узлов котлов",
    href: "/services/remont-kotlov",
    items: [
      "перевод парового котла на водогрейный режим (с проектом и разрешением завода-изготовителя)",
      "замена барабанов, камер экранов, экранных труб, трубных систем, конвективных труб, поверхностей нагрева",
      "замена чугунных экономайзеров",
      "ремонт, чистка, наплавка и восстановление барабанов",
    ],
  },
  {
    id: "aux",
    title: "Тягодутьевые машины и вспомогательное оборудование",
    href: "/services/remont-kotlov",
    items: [
      "замена направляющих аппаратов и рабочих колёс дымососов и вентиляторов с балансировкой",
      "демонтаж-монтаж ХВО, деаэраторов, топок, циклонов, подогревателей",
      "насосное оборудование, трубопроводы и КИПиА",
    ],
  },
  {
    id: "commissioning",
    title: "Пусконаладочные работы",
    href: "/services/puskonaladochnye-raboty",
    items: [
      "пусконаладка паровых и водогрейных котлов на газе, жидком и твёрдом топливах",
      "ремонт котельной автоматики, систем контроля и защиты",
      "настройка горелок, снятие характеристик, составление режимных карт",
      "оформление протоколов испытаний и актов готовности",
    ],
  },
  {
    id: "gas",
    title: "Газовые тракты и трубопроводы",
    href: "/services/rekonstruktsiya-i-modernizatsiya",
    items: [
      "монтаж и ремонт газовых трактов котельных",
      "монтаж и ремонт трубопроводов горячей воды и пара",
    ],
  },
  {
    id: "lining",
    title: "Обмуровка и теплоизоляция",
    href: "/services/obmurovka-i-teploizolyatsiya",
    items: [
      "ремонт и замена внутренней и наружной обмуровки котла",
      "замена тяжёлой обмуровки на лёгкую и наоборот",
      "установка огнеупорных и теплоизоляционных ограждений",
      "подбор материалов под температурный режим и функционал защитной оболочки",
    ],
  },
  {
    id: "diagnostics",
    title: "Диагностика и обследование",
    href: "/services/diagnostika-i-obsledovanie",
    items: [
      "диагностика и дефектовка с фотоотчётом и заключением",
      "выезд инженера на объект для оценки объёма работ",
    ],
  },
  {
    id: "maintenance",
    title: "Обслуживание",
    href: "/services/obsluzhivanie-kotelnyh",
    items: [
      "ежемесячное плановое обслуживание по согласованному графику",
      "оперативный выезд при внеплановых и аварийных ситуациях",
    ],
  },
  {
    id: "parts",
    title: "Поставка комплектующих",
    href: "/services/postavka-komplektuyushchih",
    items: [
      "полная номенклатура энергозапчастей для ремонта паровых и водогрейных котлов",
      "сокращение сроков ремонта и упрощение логистики",
    ],
  },
];

export function HomeDirections() {
  return (
    <section className="section relative overflow-x-clip border-b border-[var(--line)]">
      <div className="pointer-events-none absolute -right-8 top-16 hidden w-40 lg:block xl:w-48">
        <PipeDecor src="/assets/pipes/pipe-elbow-gauge.png" offset={42} className="rotate-[-8deg]" />
      </div>
      <div className="pointer-events-none absolute -left-10 bottom-10 hidden w-36 lg:block">
        <PipeDecor
          src="/assets/pipes/pipe-t-valve.png"
          offset={28}
          axis="x"
          className="rotate-[6deg]"
        />
      </div>

      <div className="container relative">
        <Reveal variant="fade">
          <p className="eyebrow mb-3">Компетенции</p>
        </Reveal>
        <RevealHeading className="display mb-4 text-[clamp(2.2rem,5vw,3.8rem)]" mode="lines">
          {"Основные\nнаправления работ"}
        </RevealHeading>
        <RevealText className="mb-10 max-w-2xl text-[var(--muted)] prose-max" delay={0.1}>
          <p>Подробное описание каждого вида работ — на отдельной странице «Услуги».</p>
        </RevealText>
        <Reveal variant="up" delay={0.08}>
          <DirectionsAccordion items={directions} />
        </Reveal>
      </div>
    </section>
  );
}
