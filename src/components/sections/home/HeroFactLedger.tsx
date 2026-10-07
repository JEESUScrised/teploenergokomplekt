"use client";

const facts = [
  {
    label: "Полный цикл",
    value: "от диагностики до пусконаладки",
  },
  {
    label: "География",
    value: "Россия",
  },
  {
    label: "Квалификация",
    value: "НАКС · группа КО",
  },
  {
    label: "Объекты",
    value: "ОПО",
  },
];

export function HeroFactLedger() {
  return (
    <aside
      className="hero-ledger hero-anim"
      aria-label="Ключевые факты"
      style={{ ["--hero-delay" as string]: "1.35s" }}
    >
      <dl className="hero-ledger-grid">
        {facts.map((fact, i) => (
          <div key={fact.label} className="hero-ledger-row">
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
            {i < facts.length - 1 ? (
              <span className="hero-ledger-sep" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </dl>
    </aside>
  );
}
