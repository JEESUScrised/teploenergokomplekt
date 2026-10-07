"use client";

import { ProjectGallery } from "@/components/gallery/ProjectGallery";
import { Reveal } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section className="section-loose overflow-x-clip border-b border-[var(--line)]">
      <div className="container">
        <Reveal variant="fade">
          <p className="eyebrow mb-3">География</p>
        </Reveal>
        <RevealHeading
          className="display mb-4 text-[clamp(2.2rem,5vw,3.8rem)] text-balance"
          mode="lines"
        >
          {"Объекты /\nвыполненные работы"}
        </RevealHeading>
        <RevealText className="mb-8 max-w-2xl text-[var(--muted)] prose-max" delay={0.1}>
          <p>
            Реальные фотографии с объектов. В подписях — тип оборудования, город и год по данным
            исходных файлов.
          </p>
        </RevealText>
      </div>
      <Reveal variant="up" delay={0.08} className="mt-2">
        <ProjectGallery projects={projects} />
      </Reveal>
    </section>
  );
}
