"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { formatProjectCaption, type Project } from "@/data/projects";
import { ProjectLightbox } from "@/components/projects/ProjectLightbox";

type Props = {
  project: Project;
  /** Year already shown in group heading — omit from caption if true */
  hideYearInCaption?: boolean;
};

export function ProjectCard({ project, hideYearInCaption = true }: Props) {
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cover = project.images[0];
  const extra = project.images.length - 1;

  const captionParts = [
    project.equipmentModel,
    project.city,
    project.region,
    hideYearInCaption ? undefined : project.year ? String(project.year) : undefined,
  ].filter(Boolean);
  const caption = captionParts.join(" · ");

  if (!cover) return null;

  const lightboxImages = project.images.map((img) => ({
    src: img.src,
    alt: img.alt,
    caption: formatProjectCaption(project),
  }));

  return (
    <>
      <article className="group flex h-full flex-col border border-[var(--line)] bg-[var(--surface)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blue)]">
        <button
          ref={triggerRef}
          type="button"
          className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--background)] text-left"
          onClick={() => {
            setImageIndex(0);
            setOpen(true);
          }}
          aria-label={`Открыть фото: ${caption}`}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          {extra > 0 ? (
            <span className="absolute bottom-3 right-3 bg-[var(--blue)] px-2 py-1 text-xs tracking-wide text-white uppercase">
              +{extra} фото
            </span>
          ) : null}
        </button>
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] uppercase tracking-wide text-balance leading-snug">
            {project.equipmentModel}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)] text-pretty">
            {[project.city, project.region].filter(Boolean).join(", ") || "Место уточняется"}
          </p>
          {!hideYearInCaption && project.year ? (
            <p className="mt-1 text-sm text-[var(--muted)]">{project.year}</p>
          ) : null}
        </div>
      </article>

      {open ? (
        <ProjectLightbox
          images={lightboxImages}
          index={imageIndex}
          onIndexChange={setImageIndex}
          onClose={() => setOpen(false)}
          returnFocusRef={triggerRef}
        />
      ) : null}
    </>
  );
}
