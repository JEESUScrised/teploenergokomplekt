/**
 * SRO membership catalog for /documents/.
 *
 * Public cards use registry-verified facts only.
 * Client-provided numbers that diverge from the registry are kept in notes/report,
 * not as public claims.
 */

export type SroClaimsStatus =
  | "client_provided"
  | "registry_verified"
  | "registry_mismatch";

export type SroFileApprovalStatus = "none" | "pending_review" | "approved";

export type SroResponsibilityLevel = {
  fund: "vv" | "odo";
  fundLabel: string;
  levelLabel: string;
  limitLabel: string;
  note?: string;
};

export type SroMembership = {
  id: string;
  category: "design" | "construction";
  categoryLabel: string;
  sroName: string;
  sroShortName?: string;
  sroRegistryNumber: string;
  memberNumber: string;
  joinedAt: string;
  membershipStatus?: string;
  activity: string;
  rights: string[];
  responsibilityLevels: SroResponsibilityLevel[];
  registryUrl: string;
  registryRecordUrl?: string;
  claimsStatus: SroClaimsStatus;
  fileApprovalStatus: SroFileApprovalStatus;
  file?: string;
  verificationNote: string;
  publicVisible: boolean;
};

export const sroMemberships: SroMembership[] = [
  {
    id: "sro-design-apps",
    category: "design",
    categoryLabel: "Проектирование",
    sroName:
      "Саморегулируемая организация Ассоциация профессиональных проектировщиков Сибири",
    sroShortName: "СРО АППС",
    sroRegistryNumber: "СРО-П-201-04062018",
    memberNumber: "П-201-005401310390-0058",
    joinedAt: "03.07.2018",
    membershipStatus: "Является членом",
    activity:
      "Подготовка проектной документации для объектов капитального строительства (кроме особо опасных, технически сложных и уникальных объектов и объектов использования атомной энергии).",
    rights: [
      "Право на подготовку проектной документации объектов капитального строительства (кроме особо опасных, технически сложных и уникальных объектов и объектов использования атомной энергии) — с 03.07.2018.",
      "Право в отношении особо опасных, технически сложных и уникальных объектов — отсутствует.",
      "Право в отношении объектов использования атомной энергии — отсутствует.",
    ],
    responsibilityLevels: [
      {
        fund: "vv",
        fundLabel: "КФ ВВ",
        levelLabel: "Первый уровень ответственности",
        limitLabel: "не превышает 25 млн ₽",
        note: "По обязательствам по договору подряда на подготовку проектной документации.",
      },
      {
        fund: "odo",
        fundLabel: "КФ ОДО",
        levelLabel: "Второй уровень ответственности",
        limitLabel: "не превышает 50 млн ₽",
        note: "По договорам, заключаемым с использованием конкурентных способов; предельный размер обязательств, а не стоимость каждого отдельного договора.",
      },
    ],
    registryUrl: "https://reestr.nopriz.ru/",
    registryRecordUrl: "https://reestr.nopriz.ru/member/19367760",
    claimsStatus: "registry_verified",
    fileApprovalStatus: "pending_review",
    publicVisible: true,
    verificationNote:
      "Сверено с Единым реестром НОПРИЗ и официальной выпиской. Актуальный статус и уровни ответственности уточняйте по карточке в реестре.",
  },
  {
    id: "sro-construction-asono",
    category: "construction",
    categoryLabel: "Строительство",
    sroName: "Ассоциация строительных организаций Новосибирской области",
    sroShortName: "АСОНО",
    sroRegistryNumber: "СРО-С-284-21062017",
    memberNumber: "728",
    joinedAt: "21.08.2017",
    membershipStatus: "Является членом",
    activity:
      "Выполнение работ по строительству, реконструкции, капитальному ремонту и сносу объектов капитального строительства в пределах прав, подтверждённых реестром.",
    rights: [
      "Право в отношении объектов капитального строительства (кроме особо опасных, технически сложных и уникальных объектов и объектов использования атомной энергии) — действует.",
      "Право в отношении особо опасных, технически сложных и уникальных объектов (кроме объектов использования атомной энергии) — действует.",
      "Право в отношении объектов использования атомной энергии — отсутствует.",
    ],
    responsibilityLevels: [
      {
        fund: "vv",
        fundLabel: "КФ ВВ",
        levelLabel: "Второй уровень ответственности",
        limitLabel: "не превышает 500 млн ₽",
        note: "По обязательствам по договору строительного подряда / подряда на снос и стоимости работ по одному договору.",
      },
      {
        fund: "odo",
        fundLabel: "КФ ОДО",
        levelLabel: "Первый уровень ответственности",
        limitLabel: "не превышает 90 млн ₽",
        note: "По договорам, заключаемым с использованием конкурентных способов; предельный размер обязательств по таким договорам.",
      },
    ],
    registryUrl: "https://reestr.nostroy.ru/sro/all/member/list/",
    registryRecordUrl: "https://reestr.nostroy.ru/member/3809157",
    claimsStatus: "registry_verified",
    fileApprovalStatus: "pending_review",
    publicVisible: true,
    verificationNote:
      "Сверено с Единым реестром НОСТРОЙ и официальной выпиской. Актуальный статус и уровни ответственности уточняйте по карточке в реестре.",
  },
];

export const sroCapabilities = [
  {
    id: "construction-works",
    title: "Строительно-монтажные работы",
    description:
      "Выполнение работ в пределах прав, подтверждённых сведениями реестра СРО и установленными уровнями ответственности.",
  },
  {
    id: "tenders",
    title: "Участие в закупках",
    description:
      "Участие в государственных и коммерческих закупках при соответствии требованиям конкретной закупки и подтверждённому статусу членства.",
  },
  {
    id: "construction-control",
    title: "Строительный контроль",
    description:
      "Осуществление строительного контроля в рамках подтверждённых прав и применимых требований.",
  },
  {
    id: "documentation",
    title: "Проектная и строительная документация",
    description:
      "Подготовка документации в пределах прав члена СРО проектирования и/или строительства.",
  },
] as const;

export const sroSectionCopy = {
  eyebrow: "Саморегулирование",
  heading: "Членство в саморегулируемых организациях",
  lead:
    "Актуальный статус членства и уровни ответственности подтверждаются сведениями единых реестров НОПРИЗ и НОСТРОЙ. Исторические свидетельства о допуске сами по себе не заменяют действующую запись реестра.",
  capabilitiesHeading: "Возможности членства в СРО",
  capabilitiesLead:
    "Ниже — типовые возможности в рамках подтверждённого членства. Это не каталог услуг и не гарантия допуска к любым закупкам или работам любой сложности.",
  noScanNote: "Публичная копия выписки готовится к размещению после проверки содержимого.",
  claimsLabels: {
    client_provided: "Сведения заказчика",
    registry_verified: "Сверено с реестром",
    registry_mismatch: "Требует уточнения",
  } satisfies Record<SroClaimsStatus, string>,
} as const;

export function getPublicSroMemberships(): SroMembership[] {
  return sroMemberships.filter((item) => item.publicVisible);
}
