import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { company } from "@/config/company";
import { organizationJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${company.legalName} — ремонт и модернизация котлов`,
    template: `%s | ${company.shortName}`,
  },
  description: company.tagline,
  icons: {
    icon: "/assets/brand/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <JsonLd data={organizationJsonLd()} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
