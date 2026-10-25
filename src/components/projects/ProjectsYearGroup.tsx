"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectYearGroup } from "@/data/projects";

type Props = {
  group: ProjectYearGroup;
};

export function ProjectsYearGroup({ group }: Props) {
  return (
    <div className="border-t border-[var(--line)] pt-10 lg:pt-14">
      <Reveal variant="fade">
        <h3 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3rem)] tracking-wide text-[var(--blue)]">
          {group.year}
        </h3>
      </Reveal>
      <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6" fast>
        {group.projects.map((project) => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} hideYearInCaption />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
