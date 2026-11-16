/**
 * Central catalog of licenses and permits.
 *
 * Publishing rules (152-FZ / client policy):
 * - Only items with `approvedForPublication: true` appear in the public UI.
 * - Public `file` / `thumbnail` must be redacted copies under `public/` — never originals with PII.
 * - Missing numbers, dates, or registry links must stay undefined (do not invent).
 */

export type DocumentType =
  | "license"
  | "permit"
  | "naks"
  | "attestation"
  | "insurance"
  | "other";

export type DocumentItem = {
  id: string;
  type: DocumentType;
  title: string;
  description: string;
  /** Issuing body or attestation system, if known */
  issuer?: string;
  /** Document number — only when verified from the real document */
  number?: string;
  /** ISO date (YYYY-MM-DD) or human-readable date when known */
  issuedAt?: string;
  /** ISO date or human-readable validity end when known */
  validUntil?: string;
  /** Path to a redacted public copy under /public (e.g. /documents/…). */
  file?: string;
  thumbnail?: string;
  /** Official registry record URL when confirmed for this document */
  registryUrl?: string;
  /**
   * Explicit approval to show on the public site.
   * Must stay false until a redacted scan is ready and claims are verified.
   */
  approvedForPublication: boolean;
};

/**
 * Draft catalog of expected document types.
 * All entries are unpublished until redacted scans and verification are ready.
 */
export const documents: DocumentItem[] = [
  {
    id: "rostehnadzor",
    type: "license",
    title: "Лицензия Ростехнадзора на эксплуатацию ОПО",
    description:
      "Отдельная лицензия организации на эксплуатацию ОПО. Не путать с аттестацией специалистов по промышленной безопасности — см. подраздел «Промышленная безопасность».",
    issuer: "Ростехнадзор",
    approvedForPublication: false,
  },
  {
    id: "sro-design",
    type: "permit",
    title: "Членство в СРО проектирования",
    description:
      "Саморегулируемая организация Ассоциация профессиональных проектировщиков Сибири. Подтверждённые сведения — в подразделе «Членство в СРО».",
    issuer: "НОПРИЗ / СРО-П-201-04062018",
    number: "П-201-005401310390-0058",
    issuedAt: "03.07.2018",
    registryUrl: "https://reestr.nopriz.ru/member/19367760",
    approvedForPublication: false,
  },
  {
    id: "sro",
    type: "permit",
    title: "Членство в СРО строительства",
    description:
      "Ассоциация строительных организаций Новосибирской области (АСОНО). Подтверждённые сведения — в подразделе «Членство в СРО».",
    issuer: "НОСТРОЙ / СРО-С-284-21062017",
    number: "728",
    issuedAt: "21.08.2017",
    registryUrl: "https://reestr.nostroy.ru/member/3809157",
    approvedForPublication: false,
  },
  {
    id: "naks-ko",
    type: "naks",
    title: "Аттестация сварщиков и специалистов НАКС по группе КО",
    description:
      "Аттестация специалистов по группе КО для работ на котельном оборудовании. Публичные сканы и персональные реквизиты не размещаются без отдельного одобрения.",
    issuer: "НАКС",
    registryUrl: "https://naks.ru/registry-list/",
    approvedForPublication: false,
  },
  {
    id: "naks-tech",
    type: "naks",
    title:
      "Свидетельство о проверке готовности организации к применению аттестованных технологий сварки",
    description:
      "Аттестация организации в системе НАКС (не лицензия). Карточка и статус сверки — в подразделе «НАКС: квалификация и допуски».",
    issuer: "НАКС",
    number: "АЦСТ-43-01475",
    issuedAt: "28.01.2026",
    validUntil: "28.01.2030",
    registryUrl: "https://naks.ru/registry/reg/st/",
    approvedForPublication: false,
  },
  {
    id: "naks-equipment",
    type: "naks",
    title: "Свидетельство об аттестации сварочного оборудования",
    description:
      "Черновик. Запись найдена в реестре оборудования НАКС, но заявитель не совпадает с ООО «Теплоэнергокомплект». Публичная карточка скрыта до подтверждения заказчиком.",
    issuer: "НАКС / ООО «НАКС-Тверь»",
    number: "АЦСО-129-02440/6",
    issuedAt: "18.09.2025",
    validUntil: "18.09.2028",
    registryUrl: "https://naks.ru/registry/reg/so/",
    approvedForPublication: false,
  },
  {
    id: "prombez",
    type: "attestation",
    title: "Аттестация специалистов по промышленной безопасности",
    description:
      "Нормативная рамка и сервис проверки протоколов — в подразделе «Промышленная безопасность». Персональные протоколы не публикуются.",
    issuer: "Ростехнадзор",
    registryUrl: "https://qr.gosnadzor.ru/",
    approvedForPublication: false,
  },
  {
    id: "insurance",
    type: "insurance",
    title: "Страхование гражданской ответственности ОПО",
    description:
      "Страхование гражданской ответственности при эксплуатации опасных производственных объектов.",
    approvedForPublication: false,
  },
];

/** Official check resources (generic portals — not a claim that company docs were verified). */
export const documentVerificationLinks = [
  {
    id: "naks-registry",
    label: "Реестры аттестаций НАКС",
    href: "https://naks.ru/registry-list/",
    note: "Проверка аттестаций сварщиков, специалистов, оборудования и технологий сварки.",
  },
  {
    id: "naks-org",
    label: "Реестр организаций (технологии сварки)",
    href: "https://naks.ru/registry/reg/st/",
    note: "Проверка готовности организации к применению аттестованных технологий сварки.",
  },
  {
    id: "gosnadzor-protocol",
    label: "Проверка протоколов Ростехнадзора",
    href: "https://qr.gosnadzor.ru/",
    note: "Сервис проверки протоколов Единого портала тестирования.",
  },
  {
    id: "nopriz",
    label: "Единый реестр НОПРИЗ",
    href: "https://reestr.nopriz.ru/",
    note: "Проверка членства в СРО проектирования по ИНН / ОГРН.",
  },
  {
    id: "nostroy",
    label: "Единый реестр НОСТРОЙ",
    href: "https://reestr.nostroy.ru/sro/all/member/list/",
    note: "Проверка членства в СРО строительства по ИНН / ОГРН.",
  },
  {
    id: "rostehnadzor",
    label: "Официальный сайт Ростехнадзора",
    href: "https://www.gosnadzor.ru/",
    note: "Справочная информация ведомства. Лицензия на эксплуатацию ОПО публикуется отдельно после подтверждения.",
  },
] as const;

export const documentsSection = {
  navLabel: "Лицензии и допуски",
  href: "/documents",
  h1: "Лицензии и допуски",
  metaTitle: "Лицензии и допуски",
  metaDescription:
    "Лицензии и допуски ООО «Теплоэнергокомплект»: аттестация НАКС, промышленная безопасность, членство в СРО проектирования и строительства.",
} as const;

/**
 * Client-approved copy. Closing sentences that refer to on-page scans
 * are only used when published documents exist (state B).
 */
export const documentsPageCopy = {
  /** Used when published scans are on the page. */
  leadPublished:
    "ООО «Теплоэнергокомплект» располагает разрешительными документами и допусками для выполнения работ на опасных производственных объектах (ОПО). Ниже — актуальные материалы для ознакомления.",
  /** Neutral lead while scans are not yet published. */
  lead:
    "ООО «Теплоэнергокомплект» выполняет работы на объектах теплоэнергетики с документационным сопровождением. Актуальные сведения о лицензиях, допусках и аттестации специалистов уточняйте у представителей компании; сканы готовятся к публикации.",
  normative:
    "Работы планируются и выполняются с учётом требований промышленной безопасности: Федерального закона № 116-ФЗ «О промышленной безопасности опасных производственных объектов», федеральных норм и правил (ФНП) Ростехнадзора, а также отраслевых нормативов — в том числе СП 89.13330.2016 «Котельные установки» и Правил технической эксплуатации объектов теплоснабжения.",
  naks:
    "На странице — аттестация НАКС, промышленная безопасность и членство в СРО. Персональные удостоверения и протоколы предоставляются по запросу.",
  publishedClosing:
    "Представленные ниже документы подтверждают право компании вести работы на особо ответственных объектах, а также допуск конкретных специалистов к выполнению профильных задач. Сканы предоставлены без персональных данных в соответствии с требованиями 152-ФЗ «О персональных данных».",
  emptyState:
    "Документы подготавливаются к публикации. Информацию о действующих разрешениях и допусках можно уточнить у представителей компании.",
  homeTeaserEmpty:
    "Информация о лицензиях, допусках и аттестации специалистов. Документы для публикации подготавливаются; подробности — по запросу.",
  homeTeaserPublished:
    "Лицензии, допуски и аттестация специалистов для работ на ОПО. Заверенные копии — по запросу для тендеров и экспертизы.",
  verificationLead:
    "Аттестации и разрешения можно дополнительно проверить через официальные источники. Мы не утверждаем, что проверка уже проведена за посетителя: используйте реестры по реквизитам документа.",
} as const;

/** Public list: approved items only. Prefer also having a redacted `file` when approving. */
export function getPublishedDocuments(): DocumentItem[] {
  return documents.filter((doc) => doc.approvedForPublication);
}

export function hasPublishedDocuments(): boolean {
  return getPublishedDocuments().length > 0;
}

/** Home band teasers — published documents only. */
export function getLicenseTeasers(): Pick<DocumentItem, "id" | "title">[] {
  return getPublishedDocuments().map((d) => ({ id: d.id, title: d.title }));
}
