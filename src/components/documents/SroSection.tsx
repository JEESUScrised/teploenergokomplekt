"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import {
  getPublicSroMemberships,
  sroCapabilities,
  sroSectionCopy,
  type SroClaimsStatus,
  type SroMembership,
} from "@/data/sro";

function ClaimsBadge({ status }: { status: SroClaimsStatus }) {
  const tone =
    status === "registry_verified"
      ? "border-[var(--blue)] text-[var(--blue)]"
      : status === "registry_mismatch"
        ? "border-[var(--muted)] text-[var(--muted)]"
        : "border-[var(--line)] text-[var(--muted)]";

  return (
    <span
      className={`inline-flex border px-2 py-0.5 font-[family-name:var(--font-display)] text-[0.68rem] uppercase tracking-[0.08em] ${tone}`}
    >
      {sroSectionCopy.claimsLabels[status]}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-[var(--line)] py-2.5 last:border-b-0 sm:grid-cols-[10.5rem_1fr] sm:gap-4">
      <dt className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wide text-[var(--muted)]">
        {label}
      </dt>
      <dd className="text-[0.98rem] text-[var(--text)]">{value}</dd>
    </div>
  );
}

function SroCard({ item, index }: { item: SroMembership; index: number }) {
  const registryHref = item.registryRecordUrl || item.registryUrl;

  return (
    <article className="flex h-full flex-col border border-[var(--line)] bg-[var(--background)] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)]">
          {String(index + 1).padStart(2, "0")} · {item.categoryLabel}
        </p>
        <ClaimsBadge status={item.claimsStatus} />
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide leading-snug text-balance">
        {item.sroShortName || item.sroName}
      </h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{item.sroName}</p>

      <dl className="mt-5">
        <MetaRow label="Реестровый № СРО" value={item.sroRegistryNumber} />
        <MetaRow label="Номер члена" value={item.memberNumber} />
        <MetaRow label="Дата вступления" value={item.joinedAt} />
        {item.membershipStatus ? (
          <MetaRow label="Статус" value={item.membershipStatus} />
        ) : null}
      </dl>

      <div className="mt-5">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wide text-[var(--muted)]">
          Область деятельности
        </p>
        <p className="mt-2 text-sm text-[var(--text)]">{item.activity}</p>
      </div>

      <div className="mt-5">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wide text-[var(--muted)]">
          Уровни ответственности
        </p>
        <ul className="mt-3 space-y-3">
          {item.responsibilityLevels.map((level) => (
            <li key={`${item.id}-${level.fund}`} className="border border-[var(--line)] bg-[var(--surface)] p-3">
              <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-wide text-[var(--blue)]">
                {level.fundLabel}
              </p>
              <p className="mt-1 text-sm text-[var(--text)]">
                {level.levelLabel}: {level.limitLabel}
              </p>
              {level.note ? <p className="mt-1 text-sm text-[var(--muted)]">{level.note}</p> : null}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-5 space-y-1.5 text-sm text-[var(--muted)]">
        {item.rights.map((right) => (
          <li key={right} className="flex gap-2">
            <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--blue)]" aria-hidden />
            <span>{right}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm text-[var(--muted)]">{item.verificationNote}</p>

      <div className="mt-5 flex flex-wrap gap-4">
        <a href={registryHref} target="_blank" rel="noreferrer" className="link-arrow">
          {item.registryRecordUrl ? "Карточка в реестре" : "Проверить в реестре"}
        </a>
        {item.fileApprovalStatus === "approved" && item.file ? (
          <a href={item.file} target="_blank" rel="noreferrer" className="link-arrow">
            Скачать выписку
          </a>
        ) : (
          <span className="text-sm text-[var(--muted)]">{sroSectionCopy.noScanNote}</span>
        )}
      </div>
    </article>
  );
}

export function SroSection() {
  const memberships = getPublicSroMemberships();

  return (
    <>
      <section
        id="sro"
        className="section border-b border-[var(--line)]"
        aria-labelledby="sro-heading"
      >
        <div className="container">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">{sroSectionCopy.eyebrow}</p>
          </Reveal>
          <RevealHeading
            id="sro-heading"
            className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide md:text-4xl"
            mode="up"
          >
            {sroSectionCopy.heading}
          </RevealHeading>
          <RevealText className="mt-5 max-w-3xl text-[var(--muted)]" delay={0.08}>
            <p>{sroSectionCopy.lead}</p>
          </RevealText>

          <Stagger className="mt-10 grid gap-4 lg:grid-cols-2" as="ul">
            {memberships.map((item, index) => (
              <StaggerItem key={item.id} as="li">
                <SroCard item={item} index={index} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        className="section border-b border-[var(--line)] bg-[var(--surface)]"
        aria-labelledby="sro-capabilities-heading"
      >
        <div className="container">
          <RevealHeading
            id="sro-capabilities-heading"
            className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
            mode="up"
          >
            {sroSectionCopy.capabilitiesHeading}
          </RevealHeading>
          <RevealText className="mt-4 max-w-3xl text-[var(--muted)]" delay={0.08}>
            <p>{sroSectionCopy.capabilitiesLead}</p>
          </RevealText>
          <Stagger className="mt-8 grid gap-3 md:grid-cols-2" as="ul">
            {sroCapabilities.map((item, index) => (
              <StaggerItem key={item.id} as="li">
                <article className="h-full border border-[var(--line)] bg-[var(--background)] p-5">
                  <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
