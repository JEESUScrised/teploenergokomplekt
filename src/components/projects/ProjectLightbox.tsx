"use client";

import Image from "next/image";
import { useEffect, useId, useRef, type RefObject } from "react";

export type LightboxImage = {
  src: string;
  alt: string;
  caption: string;
};

type Props = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function ProjectLightbox({
  images,
  index,
  onClose,
  onIndexChange,
  returnFocusRef,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const current = images[index];
  const multi = images.length > 1;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (!multi) return;
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        onIndexChange((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, multi, onClose, onIndexChange]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    const focusBack = returnFocusRef?.current ?? null;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      focusBack?.focus();
    };
  }, [returnFocusRef]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col border border-[var(--line)] bg-[var(--surface)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative min-h-0 flex-1 bg-[var(--background)]">
          <div className="relative mx-auto aspect-[16/10] max-h-[min(70vh,720px)] w-full">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-[var(--line)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p id={titleId} className="font-[family-name:var(--font-display)] uppercase tracking-wide text-balance">
            {current.caption}
            {multi ? (
              <span className="ml-2 text-sm font-normal normal-case tracking-normal text-[var(--muted)]">
                {index + 1} / {images.length}
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {multi ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary min-h-10 px-3"
                  onClick={() =>
                    onIndexChange((index - 1 + images.length) % images.length)
                  }
                >
                  Назад
                </button>
                <button
                  type="button"
                  className="btn btn-secondary min-h-10 px-3"
                  onClick={() => onIndexChange((index + 1) % images.length)}
                >
                  Далее
                </button>
              </>
            ) : null}
            <button
              ref={closeRef}
              type="button"
              className="btn btn-secondary min-h-10 px-3"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
