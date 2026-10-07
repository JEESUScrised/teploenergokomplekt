export const company = {
  legalName: "ООО «Теплоэнергокомплект»",
  shortName: "Теплоэнергокомплект",
  tagline:
    "Ремонт, реконструкция и монтаж энергетических паровых и водогрейных котлов и вспомогательного оборудования",
  /** Replace placeholders with real contact data when available */
  phone: "",
  phoneDisplay: "",
  email: "",
  address: "",
  year: 2026,
} as const;

export function hasPhone(): boolean {
  return Boolean(company.phone.trim());
}

export function hasEmail(): boolean {
  return Boolean(company.email.trim());
}

export function hasAddress(): boolean {
  return Boolean(company.address.trim());
}

export function phoneHref(): string | null {
  if (!hasPhone()) return null;
  const digits = company.phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function emailHref(): string | null {
  if (!hasEmail()) return null;
  return `mailto:${company.email}`;
}
