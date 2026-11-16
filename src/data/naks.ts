/**
 * NAKS qualification catalog for /documents/.
 *
 * Publication rules:
 * - `claimsStatus` separates client-provided text from registry-verified facts.
 * - `fileApprovalStatus` gates download/view of public redacted scans.
 * - Existing `approvedForPublication` in documents.ts remains the gate for the
 *   legacy document-card catalog (scans). Do not flip it based on NAKS text alone.
 * - Never store personnel certificate numbers, FIO, photos, or QR payloads here.
 */

export type NaksClaimsStatus =
  | "client_provided"
  | "registry_partial"
  | "registry_verified"
  | "registry_mismatch";

export type NaksFileApprovalStatus = "none" | "pending_review" | "approved";

export type NaksRegistryLink = {
  id: string;
  label: string;
  href: string;
  note: string;
};

export type NaksOrganizationAttestation = {
  id: string;
  organizationName: string;
  /** Official attestation title — not a license */
  title: string;
  certificateNumber: string;
  validFrom?: string;
  validUntil?: string;
  scope: string[];
  registryUrl: string;
  claimsStatus: NaksClaimsStatus;
  fileApprovalStatus: NaksFileApprovalStatus;
  /** Redacted public copy path when approved */
  file?: string;
  verificationNote: string;
};

export type NaksEquipmentAttestation = {
  id: string;
  title: string;
  model: string;
  serialNumber: string;
  certificateNumber: string;
  validFrom?: string;
  validUntil?: string;
  attestationCenter: string;
  technicalDeviceGroups: string[];
  registryUrl: string;
  claimsStatus: NaksClaimsStatus;
  fileApprovalStatus: NaksFileApprovalStatus;
  file?: string;
  verificationNote: string;
  /**
   * Closed draft until ownership/use by ООО «Теплоэнергокомплект» is confirmed.
   * Keep source data; do not render in the public section while false.
   */
  publicVisible: boolean;
};

export type NaksPersonnelCard = {
  id: string;
  roleLabel: string;
  levelLabel: string;
  claimsStatus: NaksClaimsStatus;
};

export type NaksQualityItem = {
  id: string;
  title: string;
  description: string;
};

export const naksRegistryLinks: NaksRegistryLink[] = [
  {
    id: "org-readiness",
    label: "Реестр организаций (технологии сварки)",
    href: "https://naks.ru/registry/reg/st/",
    note: "Проверка готовности организации к применению аттестованных технологий сварки.",
  },
  {
    id: "equipment",
    label: "Реестр аттестованного сварочного оборудования",
    href: "https://naks.ru/registry/reg/so/",
    note: "Проверка свидетельств на сварочное оборудование по номеру и заводским данным.",
  },
  {
    id: "personnel",
    label: "Реестр аттестаций персонала",
    href: "https://naks.ru/registry/personal/",
    note: "Проверка аттестаций сварщиков и специалистов сварочного производства.",
  },
  {
    id: "registry-list",
    label: "Все реестры НАКС",
    href: "https://naks.ru/registry-list/",
    note: "Официальный перечень реестров СРО Ассоциация «НАКС».",
  },
];

/**
 * Organization attestation — registry check on 2026-11-16 confirmed
 * ООО «ТЕПЛОЭНЕРГОКОМПЛЕКТ», № АЦСТ-43-01475, valid until 28.01.2030, group КО.
 * Official title is readiness for certified welding technologies, not a license.
 */
export const naksOrganization: NaksOrganizationAttestation = {
  id: "naks-org-acst-43-01475",
  organizationName: "ООО «ТЕПЛОЭНЕРГОКОМПЛЕКТ»",
  title:
    "Свидетельство о проверке готовности организации к применению аттестованных технологий сварки",
  certificateNumber: "АЦСТ-43-01475",
  validFrom: "28.01.2026",
  validUntil: "28.01.2030",
  scope: [
    "Паровые котлы с давлением свыше 0,07 МПа",
    "Водогрейные котлы с температурой свыше 115 °С",
    "Трубопроводы пара и горячей воды",
  ],
  registryUrl: "https://naks.ru/registry/reg/st/",
  claimsStatus: "registry_verified",
  fileApprovalStatus: "pending_review",
  verificationNote:
    "Номер свидетельства, наименование организации и срок действия сверены с реестром организаций НАКС. Статус «Действует» на карточке не выводится отдельно: актуальный статус уточняйте в реестре.",
};

/**
 * Equipment card kept as a closed draft.
 * Registry match exists for model/serial/certificate, but applicant org in
 * the NAKS equipment registry is НПО «АВАНГАРД», not ООО «Теплоэнергокомплект».
 * Do not claim ownership or use until the client confirms.
 */
export const naksEquipment: NaksEquipmentAttestation = {
  id: "naks-equipment-ultraarc-220s",
  title: "Аттестованное сварочное оборудование",
  model: "КЕДР UltraARC-220S Pulse Digital",
  serialNumber: "NAA220SPD2508005",
  certificateNumber: "АЦСО-129-02440/6",
  validFrom: "18.09.2025",
  validUntil: "18.09.2028",
  attestationCenter: "ООО «НАКС-Тверь»",
  technicalDeviceGroups: [
    "КО",
    "ГО",
    "ПТО",
    "ГДО",
    "НГДО",
    "МО",
    "ОХНВП",
    "ОТОГ",
    "СК",
  ],
  registryUrl: "https://naks.ru/registry/reg/so/",
  claimsStatus: "registry_mismatch",
  fileApprovalStatus: "pending_review",
  publicVisible: false,
  verificationNote:
    "Черновик. Модель, заводской номер и номер свидетельства совпали с записью реестра оборудования НАКС, однако организация-заявитель в реестре — НПО «АВАНГАРД». Принадлежность / использование оборудования ООО «Теплоэнергокомплект» не подтверждены заказчиком.",
};

/**
 * Role-level cards only. No FIO, certificate numbers, photos, or personal registry deep-links.
 */
export const naksPersonnel: NaksPersonnelCard[] = [
  {
    id: "naks-personnel-specialist-iii",
    roleLabel: "Технический директор",
    levelLabel: "III уровень НАКС",
    claimsStatus: "client_provided",
  },
  {
    id: "naks-personnel-welder-i",
    roleLabel: "Сварщик 6-го разряда",
    levelLabel: "I уровень НАКС",
    claimsStatus: "client_provided",
  },
];

export const naksQualityItems: NaksQualityItem[] = [
  {
    id: "fz-116",
    title: "116-ФЗ",
    description:
      "Работы на ОПО планируются с учётом требований Федерального закона № 116-ФЗ о промышленной безопасности.",
  },
  {
    id: "naks-standards",
    title: "Стандарты НАКС",
    description:
      "Сварочное производство сопровождается аттестацией в системе НАКС в пределах подтверждённых областей.",
  },
  {
    id: "weld-qc",
    title: "Контроль качества сварки",
    description:
      "Контроль качества сварных соединений выполняется в рамках принятой производственной практики и требований НД.",
  },
  {
    id: "equipment-service",
    title: "Обслуживание оборудования",
    description:
      "Сварочное оборудование проходит регулярное обслуживание для поддержания работоспособности.",
  },
  {
    id: "permits-currency",
    title: "Актуальность допусков",
    description:
      "Актуальность аттестаций и допускающих документов поддерживается и уточняется по официальным реестрам.",
  },
];

export const naksSectionCopy = {
  eyebrow: "Система аттестации сварочного производства",
  heading: "НАКС: квалификация и допуски",
  lead:
    "Сведения об аттестации организации и квалификации персонала в системе НАКС. Статус сверки указан по официальным реестрам. Сведения об оборудовании публикуются только после подтверждения принадлежности компании.",
  orgHeading: "Аттестация организации",
  equipmentHeading: "Аттестованное сварочное оборудование",
  personnelHeading: "Квалификация персонала",
  personnelPrivacy:
    "Сведения об аттестации специалистов и подтверждающие документы предоставляются по запросу в соответствии с требованиями законодательства о персональных данных.",
  checkHeading: "Как проверить документы",
  checkLead:
    "Используйте официальные реестры НАКС по реквизитам свидетельства. Прямые ссылки на персональные записи персонала на сайте не публикуются.",
  qualityHeading: "Контроль качества и аттестация",
  qualityLead:
    "Направления внутреннего контроля. Формулировки описывают принятую практику и не заменяют собой полный перечень разрешений на любые виды работ.",
  noScanNote: "Публичная копия документа готовится к размещению после проверки содержимого.",
  claimsLabels: {
    client_provided: "Сведения заказчика",
    registry_partial: "Частичная сверка",
    registry_verified: "Сверено с реестром",
    registry_mismatch: "Требует уточнения",
  } satisfies Record<NaksClaimsStatus, string>,
} as const;
