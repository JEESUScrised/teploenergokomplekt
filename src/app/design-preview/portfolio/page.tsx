import { notFound } from "next/navigation";
import { ProjectsYearGroup } from "@/components/projects/ProjectsYearGroup";
import {
  getDesignPreviewProjectsGroupedByYear,
  projectsSectionCopy,
} from "@/data/projects";

/**
 * Build-time gated design mock for client visual review.
 * Included in static export only when DESIGN_PREVIEW=1.
 * Staging/production builds omit the flag → notFound.
 * Does not mutate approvedForPublication.
 */
const ENABLED = process.env.DESIGN_PREVIEW === "1";

export const metadata = {
  title: "Демонстрация макета портфолио",
  robots: { index: false, follow: false },
};

export default function DesignPreviewPortfolioPage() {
  if (!ENABLED) notFound();

  const groups = getDesignPreviewProjectsGroupedByYear();

  return (
    <main>
      <div className="border-b border-[var(--line)] bg-[#8a1f1f] px-4 py-3 text-center text-sm text-white md:text-base">
        ДЕМОНСТРАЦИЯ МАКЕТА — карточки собраны из файлов репозитория для проверки сетки.
        Годы и локации не подтверждены заказчиком и не публикуются на основном сайте.
      </div>
      <section className="section-loose overflow-x-clip border-b border-[var(--line)]">
        <div className="container">
          <p className="eyebrow mb-3">{projectsSectionCopy.eyebrow}</p>
          <h1 className="display mb-4 text-[clamp(2.2rem,5vw,3.8rem)] text-balance">
            {projectsSectionCopy.title}
          </h1>
          <p className="mb-8 max-w-2xl text-[var(--muted)] prose-max lg:mb-12">
            {projectsSectionCopy.lead} Ниже — только визуальный предпросмотр заполненного
            раздела.
          </p>
          <div className="grid gap-12 lg:gap-16">
            {groups.map((group) => (
              <ProjectsYearGroup key={group.year} group={group} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
