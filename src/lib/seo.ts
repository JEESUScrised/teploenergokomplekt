import type { Metadata } from "next";
import { company, hasAddress, hasEmail, hasPhone } from "@/config/company";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({ title, description, path }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(company.shortName)
    ? title
    : `${title} | ${company.shortName}`;
  return {
    title: {
      absolute: fullTitle,
    },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: company.legalName,
      locale: "ru_RU",
      type: "website",
    },
  };
}

export function organizationJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    url: getSiteUrl(),
    logo: absoluteUrl("/assets/brand/logo.png"),
    description: company.tagline,
  };

  if (hasPhone()) data.telephone = company.phone;
  if (hasEmail()) data.email = company.email;
  if (hasAddress()) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressCountry: "RU",
    };
  }

  return data;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  const provider: Record<string, unknown> = {
    "@type": "Organization",
    name: company.legalName,
  };
  if (hasPhone()) provider.telephone = company.phone;
  if (hasEmail()) provider.email = company.email;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider,
    areaServed: "RU",
  };
}
