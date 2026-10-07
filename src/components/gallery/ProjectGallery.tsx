"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Project } from "@/data/projects";

type Props = {
  projects: Project[];
};

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function ProjectGallery({ projects }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % projects.length));
      if (e.key === "ArrowLeft")
        setActive((i) => (i === null ? i : (i - 1 + projects.length) % projects.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, projects.length]);

  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  const sequence = reduceMotion ? projects : [...projects, ...projects];

  return (
    <>
      <div
        className="project-marquee"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
        }}
      >
        <div
          className={`project-marquee-track ${paused || reduceMotion ? "is-paused" : ""} ${reduceMotion ? "is-static" : ""}`}
          style={{ ["--marquee-duration" as string]: `${Math.max(32, projects.length * 7)}s` }}
        >
          {sequence.map((project, index) => {
            const realIndex = index % projects.length;
            return (
              <button
                key={`${project.id}-${index}`}
                type="button"
                onClick={() => setActive(realIndex)}
                className="project-marquee-card group"
                aria-label={`${project.equipment}${project.location ? `, ${project.location}` : ""}${project.year ? `, ${project.year}` : ""}`}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 768px) 80vw, 360px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
                </div>
                <div className="project-marquee-caption transition-transform duration-300 group-hover:-translate-y-0.5">
                  <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-wide">
                    {project.equipment}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {[project.location, project.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {active !== null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр объекта"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-5xl border border-[var(--line)] bg-[var(--surface)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-[var(--background)]">
              <Image
                src={projects[active].src}
                alt={projects[active].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-[var(--line)] px-4 py-3">
              <p className="font-[family-name:var(--font-display)] uppercase tracking-wide">
                {projects[active].caption}
              </p>
              <button
                type="button"
                className="btn btn-secondary min-h-10 px-3"
                onClick={() => setActive(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
