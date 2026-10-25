import type { Metadata } from "next";
import Link from "next/link";
import { serviceRedirects } from "@/data/services";
import { absoluteUrl } from "@/lib/site";

const TARGET = serviceRedirects["obsluzhivanie-kotelnyh"];

export const metadata: Metadata = {
  title: {
    absolute: "Страница перемещена | Теплоэнергокомплект",
  },
  description:
    "Раздел «Обслуживание котельных» объединён с услугами диагностики и обследования.",
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl(TARGET) },
  // Meta refresh for static hosting where HTTP 301 may be configured separately.
  other: {
    "refresh": `0;url=${TARGET}`,
  },
};

export default function ObsluzhivanieKotelnyhRedirectPage() {
  return (
    <main className="container py-16 lg:py-24">
      <p className="eyebrow mb-3">Перенаправление</p>
      <h1 className="display text-[clamp(1.8rem,4vw,2.8rem)]">
        Раздел «Обслуживание котельных» перемещён
      </h1>
      <p className="mt-5 max-w-2xl text-[var(--muted)]">
        Услуга больше не публикуется как отдельное направление. Актуальные работы по обследованию
        и диагностике доступны на странице диагностики и обследования.
      </p>
      <p className="mt-8">
        <Link href={TARGET} className="btn btn-primary">
          Перейти к диагностике и обследованию
        </Link>
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(TARGET)});`,
        }}
      />
    </main>
  );
}
