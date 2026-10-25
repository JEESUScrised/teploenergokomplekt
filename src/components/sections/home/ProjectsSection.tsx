"use client";

import { Reveal } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { ProjectsYearGroup } from "@/components/projects/ProjectsYearGroup";
import {
  getProjectsGroupedByYear,
  hasPublishedProjects,
  projectsSectionCopy,
} from "@/data/projects";

export function ProjectsSection() {
  const groups = getProjectsGroupedByYear();
  const published = hasPublishedProjects();

  return (
    <section className="section-loose overflow-x-clip border-b border-[var(--line)]">
      <div className="container">
        <Reveal variant="fade">
          <p className="eyebrow mb-3">{projectsSectionCopy.eyebrow}</p>
        </Reveal>
        <RevealHeading
          className="display mb-4 text-[clamp(2.2rem,5vw,3.8rem)] text-balance"
          mode="clip"
        >
          {projectsSectionCopy.title}
        </RevealHeading>
        <RevealText className="mb-8 max-w-2xl text-[var(--muted)] prose-max lg:mb-12" delay={0.1}>
          <p>{projectsSectionCopy.lead}</p>
        </RevealText>

        {published ? (
          <div className="grid gap-12 lg:gap-16">
            {groups.map((group) => (
              <ProjectsYearGroup key={group.year} group={group} />
            ))}
          </div>
        ) : (
          <Reveal
            className="border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8"
            delay={0.12}
          >
            <p className="max-w-2xl text-[1.05rem] text-[var(--muted)]">
              {projectsSectionCopy.empty}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
