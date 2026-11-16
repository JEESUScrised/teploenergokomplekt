"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import {
  naksEquipment,
  naksOrganization,
  naksPersonnel,
  naksQualityItems,
  naksRegistryLinks,
  naksSectionCopy,
  type NaksClaimsStatus,
} from "@/data/naks";

function ClaimsBadge({ status }: { status: NaksClaimsStatus }) {
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
      {naksSectionCopy.claimsLabels[status]}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-[var(--line)] py-2.5 last:border-b-0 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wide text-[var(--muted)]">
        {label}
      </dt>
      <dd className="text-[0.98rem] text-[var(--text)]">{value}</dd>
    </div>
  );
}

export function NaksSection() {
  const org = naksOrganization;
  const equipment = naksEquipment;
  const showEquipment = equipment.publicVisible;

  return (
    <>
      <section
        id="naks"
        className="section border-b border-[var(--line)]"
        aria-labelledby="naks-heading"
      >
        <div className="container">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">{naksSectionCopy.eyebrow}</p>
          </Reveal>
          <RevealHeading
            id="naks-heading"
            className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide md:text-4xl"
            mode="up"
          >
            {naksSectionCopy.heading}
          </RevealHeading>
          <RevealText className="mt-5 max-w-3xl text-[var(--muted)]" delay={0.08}>
            <p>{naksSectionCopy.lead}</p>
          </RevealText>

          <div className={`mt-10 grid gap-4 ${showEquipment ? "lg:grid-cols-2" : ""}`}>
            <Reveal
              className="border border-[var(--line)] bg-[var(--background)] p-5 md:p-6"
              delay={0.06}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)]">
                  01 · Организация
                </p>
                <ClaimsBadge status={org.claimsStatus} />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide leading-snug text-balance">
                {naksSectionCopy.orgHeading}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{org.title}</p>
              <dl className="mt-5">
                <MetaRow label="Организация" value={org.organizationName} />
                <MetaRow label="Свидетельство" value={`№ ${org.certificateNumber}`} />
                <MetaRow
                  label="Период"
                  value={
                    org.validFrom && org.validUntil
                      ? `${org.validFrom} — ${org.validUntil}`
                      : org.validUntil
                        ? `до ${org.validUntil}`
                        : "уточняется"
                  }
                />
              </dl>
              <div className="mt-5">
                <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  Область применения
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--text)]">
                  {org.scope.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--blue)]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-5 text-sm text-[var(--muted)]">{org.verificationNote}</p>
              <div className="mt-5 flex flex-wrap gap-4">
                <a
                  href={org.registryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-arrow"
                >
                  Проверить в реестре НАКС
                </a>
                {org.fileApprovalStatus === "approved" && org.file ? (
                  <a href={org.file} target="_blank" rel="noreferrer" className="link-arrow">
                    Скачать документ
                  </a>
                ) : (
                  <span className="text-sm text-[var(--muted)]">{naksSectionCopy.noScanNote}</span>
                )}
              </div>
            </Reveal>

            {showEquipment ? (
              <Reveal
                className="border border-[var(--line)] bg-[var(--background)] p-5 md:p-6"
                delay={0.1}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)]">
                    02 · Оборудование
                  </p>
                  <ClaimsBadge status={equipment.claimsStatus} />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide leading-snug text-balance">
                  {naksSectionCopy.equipmentHeading}
                </h3>
                <p className="mt-3 text-sm text-[var(--muted)]">{equipment.title}</p>
                <dl className="mt-5">
                  <MetaRow label="Модель" value={equipment.model} />
                  <MetaRow label="Заводской №" value={equipment.serialNumber} />
                  <MetaRow label="Свидетельство" value={`№ ${equipment.certificateNumber}`} />
                  <MetaRow
                    label="Срок действия"
                    value={
                      equipment.validFrom && equipment.validUntil
                        ? `${equipment.validFrom} — ${equipment.validUntil}`
                        : equipment.validUntil
                          ? `до ${equipment.validUntil}`
                          : "уточняется"
                    }
                  />
                  <MetaRow label="Аттестационный центр" value={equipment.attestationCenter} />
                </dl>
                <div className="mt-5">
                  <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wide text-[var(--muted)]">
                    Группы технических устройств
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Группы технических устройств">
                    {equipment.technicalDeviceGroups.map((group) => (
                      <li
                        key={group}
                        className="border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 font-[family-name:var(--font-display)] text-xs tracking-wide text-[var(--text)]"
                      >
                        {group}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-5 text-sm text-[var(--muted)]">{equipment.verificationNote}</p>
                <div className="mt-5 flex flex-wrap gap-4">
                  <a
                    href={equipment.registryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-arrow"
                  >
                    Реестр сварочного оборудования
                  </a>
                  {equipment.fileApprovalStatus === "approved" && equipment.file ? (
                    <a
                      href={equipment.file}
                      target="_blank"
                      rel="noreferrer"
                      className="link-arrow"
                    >
                      Скачать документ
                    </a>
                  ) : (
                    <span className="text-sm text-[var(--muted)]">{naksSectionCopy.noScanNote}</span>
                  )}
                </div>
              </Reveal>
            ) : null}
          </div>

          <div className="mt-4 border border-[var(--line)] bg-[var(--surface)] p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--blue)]">
                  02 · Персонал
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl uppercase tracking-wide">
                  {naksSectionCopy.personnelHeading}
                </h3>
              </div>
              <ClaimsBadge status="client_provided" />
            </div>
            <Stagger className="mt-6 grid gap-3 sm:grid-cols-2" as="ul" fast>
              {naksPersonnel.map((card) => (
                <StaggerItem key={card.id} as="li">
                  <article className="h-full border border-[var(--line)] bg-[var(--background)] p-4 md:p-5">
                    <p className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide">
                      {card.roleLabel}
                    </p>
                    <p className="mt-2 text-[var(--blue)]">{card.levelLabel}</p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-5 max-w-3xl text-sm text-[var(--muted)]">
              {naksSectionCopy.personnelPrivacy}
            </p>
          </div>
        </div>
      </section>

      <section
        className="section border-b border-[var(--line)] bg-[var(--surface)]"
        aria-labelledby="naks-check-heading"
      >
        <div className="container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealHeading
              id="naks-check-heading"
              className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
              mode="up"
            >
              {naksSectionCopy.checkHeading}
            </RevealHeading>
          </div>
          <div className="lg:col-span-8">
            <RevealText className="text-[var(--muted)]" delay={0.08}>
              <p>{naksSectionCopy.checkLead}</p>
            </RevealText>
            <Stagger className="mt-6 grid gap-3 sm:grid-cols-2" as="ul" fast>
              {naksRegistryLinks.map((link) => (
                <StaggerItem key={link.id} as="li">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col border border-[var(--line)] bg-[var(--background)] p-4 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--blue)] md:p-5"
                  >
                    <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-wide text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-0.5">
                      {link.label}
                    </p>
                    <p className="mt-2 flex-1 text-sm text-[var(--muted)]">{link.note}</p>
                    <span className="link-arrow mt-3 inline-block">Открыть →</span>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section
        className="section border-b border-[var(--line)]"
        aria-labelledby="naks-quality-heading"
      >
        <div className="container">
          <RevealHeading
            id="naks-quality-heading"
            className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide"
            mode="up"
          >
            {naksSectionCopy.qualityHeading}
          </RevealHeading>
          <RevealText className="mt-4 max-w-3xl text-[var(--muted)]" delay={0.08}>
            <p>{naksSectionCopy.qualityLead}</p>
          </RevealText>
          <Stagger className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3" as="ul">
            {naksQualityItems.map((item, index) => (
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
