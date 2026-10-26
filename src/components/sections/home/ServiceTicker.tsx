"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { services } from "@/data/services";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Live catalog short titles — keeps ticker in sync with services. */
const TICKER_LABELS = services.map((service) => service.shortTitle);

/** Target visual speed (px / second), independent of viewport width. */
const SPEED_PX_PER_SEC = 48;

const MAX_CYCLES = 24;

type LayoutState = {
  cycles: number;
  shiftPx: number;
  durationSec: number;
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
  const [layout, setLayout] = useState<LayoutState>({
    cycles: 2,
    shiftPx: 0,
    durationSec: 36,
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

      const viewWidth = viewport.clientWidth;
      const unitWidth = measureEl.getBoundingClientRect().width;
      if (viewWidth < 1 || unitWidth < 1) return;

      // Group width = cycles × unit ≥ viewport. Two such groups on the track →
      // animating by exactly one group width (-shiftPx) is a seamless loop.
      const cycles = Math.min(MAX_CYCLES, Math.max(1, Math.ceil(viewWidth / unitWidth)));
      const shiftPx = unitWidth * cycles;
      const durationSec = shiftPx / SPEED_PX_PER_SEC;

      setLayout((prev) => {
        if (
          prev.cycles === cycles &&
          Math.abs(prev.shiftPx - shiftPx) < 0.5 &&
          Math.abs(prev.durationSec - durationSec) < 0.05
        ) {
          return prev;
        }
        return { cycles, shiftPx, durationSec };
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

  const groupLabels = Array.from({ length: layout.cycles }, () => TICKER_LABELS).flat();

  return (
    <div
      ref={viewportRef}
      className="marquee"
      aria-label="Основные услуги"
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
          <div className="marquee-group">
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
