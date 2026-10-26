"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { services } from "@/data/services";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Labels from the live services catalog (short titles). */
const TICKER_LABELS = services.map((service) => service.shortTitle);

/** Constant visual speed: distance scrolled per second. */
const SPEED_PX_PER_SEC = 48;

function MarqueeItems({ labels, keyPrefix }: { labels: string[]; keyPrefix: string }) {
  return labels.map((item, index) => (
    <span key={`${keyPrefix}-${index}`} className="marquee-item">
      {item}
      <span className="mx-2 text-[var(--line)]" aria-hidden="true">
        •
      </span>
    </span>
  ));
}

export function ServiceTicker() {
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  /** How many full label cycles fit inside one animated group (≥ viewport width). */
  const [cyclesPerGroup, setCyclesPerGroup] = useState(2);
  const [durationSec, setDurationSec] = useState(36);

  useLayoutEffect(() => {
    if (reduce) return;

    const update = () => {
      const viewport = viewportRef.current;
      const measure = measureRef.current;
      if (!viewport || !measure) return;

      const unitWidth = measure.scrollWidth;
      const viewWidth = viewport.clientWidth;
      if (unitWidth <= 0 || viewWidth <= 0) return;

      // One group must be at least as wide as the viewport so the strip never shows a gap.
      const cycles = Math.max(1, Math.ceil((viewWidth + 1) / unitWidth));
      setCyclesPerGroup(cycles);
      setDurationSec((unitWidth * cycles) / SPEED_PX_PER_SEC);
    };

    update();

    const ro = new ResizeObserver(update);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [reduce]);

  const groupLabels = Array.from({ length: cyclesPerGroup }, () => TICKER_LABELS).flat();

  return (
    <div
      ref={viewportRef}
      className="marquee"
      aria-label="Основные услуги"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Off-screen probe: width of one catalog cycle (used to size groups). */}
      <div ref={measureRef} className="marquee-measure" aria-hidden="true">
        <MarqueeItems labels={TICKER_LABELS} keyPrefix="measure" />
      </div>

      {reduce ? (
        <div className="marquee-track is-static">
          <MarqueeItems labels={TICKER_LABELS} keyPrefix="static" />
        </div>
      ) : (
        <div
          className={`marquee-track ${paused ? "is-paused" : ""}`}
          style={{ ["--marquee-duration" as string]: `${durationSec}s` }}
        >
          <div className="marquee-group">
            <MarqueeItems labels={groupLabels} keyPrefix="a" />
          </div>
          <div className="marquee-group" aria-hidden="true">
            <MarqueeItems labels={groupLabels} keyPrefix="b" />
          </div>
        </div>
      )}
    </div>
  );
}
