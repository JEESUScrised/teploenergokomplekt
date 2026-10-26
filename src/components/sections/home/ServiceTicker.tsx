"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { services } from "@/data/services";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Live catalog short titles — keeps ticker in sync with services. */
const TICKER_LABELS = services.map((service) => service.shortTitle);

/** Constant visual speed (px / second). */
const SPEED_PX_PER_SEC = 60;

const MAX_REPEAT = 32;

type LayoutState = {
  repeatCount: number;
  shiftPx: number;
  durationSec: number;
  ready: boolean;
};

function ItemRow({
  labels,
  keyPrefix,
}: {
  labels: readonly string[];
  keyPrefix: string;
}) {
  return labels.map((label, index) => (
    <span key={`${keyPrefix}-${index}`} className="marquee-item">
      {label}
      <span className="marquee-sep" aria-hidden="true">
        ·
      </span>
    </span>
  ));
}

export function ServiceTicker() {
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<LayoutState>({
    // Safe initial fill for wide screens before first measure.
    repeatCount: 4,
    shiftPx: 0,
    durationSec: 40,
    ready: false,
  });

  useLayoutEffect(() => {
    if (reduce) return;

    const viewport = viewportRef.current;
    const measureEl = measureRef.current;
    if (!viewport || !measureEl) return;

    let cancelled = false;
    let raf = 0;

    const recompute = () => {
      if (cancelled) return;

      const containerWidth = viewport.clientWidth;
      const sequenceWidth = measureEl.getBoundingClientRect().width;
      if (containerWidth < 1 || sequenceWidth < 1) return;

      // Guaranteed overfill: ceil coverage + one extra full sequence.
      const repeatCount = Math.min(
        MAX_REPEAT,
        Math.max(2, Math.ceil(containerWidth / sequenceWidth) + 1),
      );
      const estimatedShift = sequenceWidth * repeatCount;
      const durationSec = estimatedShift / SPEED_PX_PER_SEC;

      setLayout((prev) => {
        if (
          prev.ready &&
          prev.repeatCount === repeatCount &&
          Math.abs(prev.shiftPx - estimatedShift) < 0.5
        ) {
          return prev;
        }
        return {
          repeatCount,
          shiftPx: estimatedShift,
          durationSec,
          ready: true,
        };
      });
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(recompute);
      });
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(viewport);
    ro.observe(measureEl);

    const onFonts = () => schedule();
    void document.fonts?.ready.then(() => {
      if (!cancelled) schedule();
    });
    document.fonts?.addEventListener?.("loadingdone", onFonts);
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.fonts?.removeEventListener?.("loadingdone", onFonts);
      window.removeEventListener("resize", schedule);
    };
  }, [reduce]);

  // After repeatCount paints, lock shift to the real group width (subpixel-accurate).
  useLayoutEffect(() => {
    if (reduce || !layout.ready) return;
    const group = groupRef.current;
    if (!group) return;

    const painted = group.getBoundingClientRect().width;
    if (painted < 1) return;

    setLayout((prev) => {
      if (Math.abs(prev.shiftPx - painted) < 0.5) return prev;
      return {
        ...prev,
        shiftPx: painted,
        durationSec: painted / SPEED_PX_PER_SEC,
      };
    });
  }, [reduce, layout.ready, layout.repeatCount]);

  const groupLabels = Array.from({ length: layout.repeatCount }, () => TICKER_LABELS).flat();

  return (
    <div
      ref={viewportRef}
      className="marquee"
      aria-label="Основные услуги"
      data-ticker-ready={layout.ready ? "1" : "0"}
      data-ticker-repeat={String(layout.repeatCount)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={measureRef} className="marquee-measure" aria-hidden="true">
        <ItemRow labels={TICKER_LABELS} keyPrefix="m" />
      </div>

      {reduce ? (
        <div className="marquee-track is-static">
          <ItemRow labels={TICKER_LABELS} keyPrefix="static" />
        </div>
      ) : (
        <div
          className={`marquee-track ${paused ? "is-paused" : ""}`}
          style={{
            ["--marquee-duration" as string]: `${layout.durationSec}s`,
            ["--marquee-shift" as string]:
              layout.shiftPx > 0 ? `-${layout.shiftPx}px` : "-50%",
          }}
        >
          <div ref={groupRef} className="marquee-group">
            <ItemRow labels={groupLabels} keyPrefix="a" />
          </div>
          <div className="marquee-group" aria-hidden="true">
            <ItemRow labels={groupLabels} keyPrefix="b" />
          </div>
        </div>
      )}
    </div>
  );
}
