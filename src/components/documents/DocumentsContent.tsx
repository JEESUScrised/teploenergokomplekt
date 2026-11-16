"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { NaksSection } from "@/components/documents/NaksSection";
import {
  documentVerificationLinks,
  documentsPageCopy,
  documentsSection,
  getPublishedDocuments,
  hasPublishedDocuments,
} from "@/data/documents";

function DocumentMeta({
  number,
  issuedAt,
  validUntil,
  issuer,
}: {
  number?: string;
  issuedAt?: string;
  validUntil?: string;
  issuer?: string;
}) {
  const rows = [
    issuer ? `Орган / система: ${issuer}` : null,
    number ? `Номер: ${number}` : null,
    issuedAt ? `Выдан: ${issuedAt}` : null,
    validUntil ? `Действует до: ${validUntil}` : null,
  ].filter(Boolean);

  if (rows.length === 0) return null;

  return (
    <ul className="mt-3 grid gap-1 text-sm text-[var(--muted)]">
      {rows.map((row) => (
        <li key={row as string}>{row}</li>
      ))}
    </ul>
  );
}

export function DocumentsContent() {
  const published = getPublishedDocuments();
  const showPublished = hasPublishedDocuments();

  return (
    <>
      <section className="border-b border-[var(--line)]">
        <div className="container py-12 lg:py-16">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: documentsSection.navLabel },
            ]}
          />
          <Reveal variant="fade">
            <p className="eyebrow mb-4">Документы компании</p>
          </Reveal>
          <RevealHeading
            as="h1"
            className="display text-[clamp(2.8rem,7vw,5rem)]"
            mode="clip"
          >
            Лицензии и допуски
          </RevealHeading>
          <div className="mt-6 max-w-3xl space-y-4 text-[1.08rem] text-[var(--muted)]">
            <RevealText delay={0.08}>
              <p>
                {showPublished ? documentsPageCopy.leadPublished : documentsPageCopy.lead}
              </p>
            </RevealText>
            <RevealText delay={0.12}>
              <p>{documentsPageCopy.normative}</p>
            </RevealText>
            <RevealText delay={0.16}>
              <p>{documentsPageCopy.naks}</p>
            </RevealText>
            {showPublished ? (
              <RevealText delay={0.2}>
                <p>{documentsPageCopy.publishedClosing}</p>
              </RevealText>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section border-b border-[var(--line)]" aria-labelledby="docs-list-heading">
        <div className="container">
          <RevealHeading
            id="docs-list-heading"
            className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
            mode="up"
          >
            Документы
          </RevealHeading>

          {showPublished ? (
            <Stagger className="mt-8 grid gap-4 md:grid-cols-2" as="ul">
              {published.map((doc, index) => (
                <StaggerItem key={doc.id} as="li">
                  <article className="group flex h-full flex-col border border-[var(--line)] bg-[var(--background)] p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)] md:p-6">
                    <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide leading-snug text-balance">
                      {doc.title}
                    </h2>
                    <p className="mt-3 flex-1 text-[var(--muted)]">{doc.description}</p>
                    <DocumentMeta
                      issuer={doc.issuer}
                      number={doc.number}
                      issuedAt={doc.issuedAt}
                      validUntil={doc.validUntil}
                    />
                    <div className="mt-5 flex flex-wrap gap-4">
                      {doc.file ? (
                        <>
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noreferrer"
                            className="link-arrow"
                          >
                            Смотреть
                          </a>
                          <a href={doc.file} download className="link-arrow">
                            Скачать
                          </a>
                        </>
                      ) : null}
                      {doc.registryUrl ? (
                        <a
                          href={doc.registryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="link-arrow"
                        >
                          Реестр
                        </a>
                      ) : null}
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Reveal className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8" delay={0.08}>
              <p className="text-[1.05rem] text-[var(--muted)]">{documentsPageCopy.emptyState}</p>
              <p className="mt-4 text-sm text-[var(--muted)]">
                Свяжитесь через раздел{" "}
                <Link
                  href="/contacts"
                  className="text-[var(--blue)] underline-offset-2 hover:underline"
                >
                  Контакты
                </Link>
                .
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <NaksSection />

      <section className="section border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealHeading
              className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
              mode="up"
            >
              Проверка подлинности
            </RevealHeading>
          </div>
          <div className="lg:col-span-8">
            <RevealText className="text-[var(--muted)]" delay={0.08}>
              <p>{documentsPageCopy.verificationLead}</p>
            </RevealText>
            <Stagger className="mt-6 grid gap-4" as="ul" fast>
              {documentVerificationLinks.map((link) => (
                <StaggerItem key={link.id} as="li">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group block border border-[var(--line)] bg-[var(--background)] p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--blue)]"
                  >
                    <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-0.5">
                      {link.label}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{link.note}</p>
                    <span className="link-arrow mt-3 inline-block">Открыть →</span>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  );
}
