"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ProjectLightbox } from "@/components/projects/ProjectLightbox";
import type { GallerySlide } from "@/data/projects";

type Props = {
  projects: GallerySlide[];
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
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!projects.length) return null;

  const sequence = reduceMotion ? projects : [...projects, ...projects];
  const lightboxImages = projects.map((p) => ({
    src: p.src,
    alt: p.alt,
    caption: p.caption,
  }));

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
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setActive(realIndex);
                }}
                className="project-marquee-card group"
                aria-label={project.caption}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 768px) 80vw, 360px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
                </div>
                <div className="project-marquee-caption transition-transform duration-300 group-hover:-translate-y-0.5">
                  <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-wide">
                    {project.equipment}
                  </p>
                  {(project.location || project.year) && project.year ? (
                    <p className="text-sm text-[var(--muted)]">
                      {[project.location, project.year].filter(Boolean).join(" · ")}
                    </p>
                  ) : project.location ? (
                    <p className="text-sm text-[var(--muted)]">{project.location}</p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {active !== null ? (
        <ProjectLightbox
          images={lightboxImages}
          index={active}
          onIndexChange={setActive}
          onClose={() => setActive(null)}
          returnFocusRef={lastTrigger}
        />
      ) : null}
    </>
  );
}
