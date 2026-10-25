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
      "Разрешительный документ, необходимый для выполнения соответствующих работ на опасных производственных объектах.",
    issuer: "Ростехнадзор",
    approvedForPublication: false,
  },
  {
    id: "sro",
    type: "permit",
    title: "Допуск СРО на строительно-монтажные работы",
    description:
      "Подтверждение права на выполнение строительно-монтажных работ в рамках требований саморегулируемой организации.",
    approvedForPublication: false,
  },
  {
    id: "naks-ko",
    type: "naks",
    title: "Аттестация сварщиков и специалистов НАКС по группе КО",
    description:
      "Аттестация специалистов по группе КО для работ на котельном оборудовании.",
    issuer: "НАКС",
    registryUrl: "https://naks.ru/registry-list/",
    approvedForPublication: false,
  },
  {
    id: "naks-tech",
    type: "naks",
    title: "Свидетельство НАКС о готовности к применению аттестованных технологий сварки",
    description:
      "Подтверждение готовности организации к применению аттестованных сварочных технологий.",
    issuer: "НАКС",
    registryUrl: "https://naks.ru/registry-list/",
    approvedForPublication: false,
  },
  {
    id: "prombez",
    type: "attestation",
    title: "Аттестация специалистов по промышленной безопасности",
    description: "Аттестация специалистов, необходимая для организации работ на ОПО.",
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
    note: "Проверка аттестаций сварщиков, специалистов и технологий сварки.",
  },
  {
    id: "rostehnadzor",
    label: "Официальный сайт Ростехнадзора",
    href: "https://www.gosnadzor.ru/",
    note: "Справочная информация ведомства. Прямую ссылку на реестровую запись добавим после подтверждения вида и номера документа.",
  },
] as const;

export const documentsSection = {
  navLabel: "Лицензии и допуски",
  href: "/documents",
  h1: "Лицензии и допуски",
  metaTitle: "Лицензии и допуски",
  metaDescription:
    "Лицензии, допуски и документы ООО «Теплоэнергокомплект». Информация о промышленной безопасности, разрешительной документации и аттестации специалистов.",
} as const;

/**
 * Client-approved copy. Closing sentences that refer to on-page scans
 * are only used when published documents exist (state B).
 */
export const documentsPageCopy = {
  lead: "ООО «Теплоэнергокомплект» имеет все необходимые разрешительные документы и допуски для выполнения работ на опасных производственных объектах (ОПО).",
  normative:
    "Соответствие требованиям промышленной безопасности обеспечено в рамках Федерального закона № 116-ФЗ «О промышленной безопасности опасных производственных объектов», федеральных норм и правил (ФНП) Ростехнадзора, а также отраслевых нормативов — в том числе СП 89.13330.2016 «Котельные установки» и Правил технической эксплуатации объектов теплоснабжения.",
  naks:
    "Квалификация специалистов и готовность сварочных технологий подтверждены аттестацией в системе НАКС.",
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
