"use client";

import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";
import { AnimatedLine } from "@/components/motion/AnimatedLine";
import { useRevealGate } from "@/hooks/useRevealGate";

type SectionIndexProps = {
  index: string;
  light?: boolean;
  className?: string;
};

/** Document-style section index: 01, 02… — not a badge */
export function SectionIndex({ index, light = false, className = "" }: SectionIndexProps) {
  const [ref, show] = useRevealGate<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      className={`section-index reveal-fade ${show ? "is-in" : ""} ${light ? "section-index--light" : ""} ${className}`.trim()}
    >
      {index}
    </span>
  );
}

type SectionHeadProps = {
  index: string;
  title: string;
  lead?: string;
  light?: boolean;
  mode?: "lines" | "clip" | "up";
  className?: string;
  rule?: boolean;
  as?: "h1" | "h2";
};

export function SectionHead({
  index,
  title,
  lead,
  light = false,
  mode = "lines",
  className = "",
  rule = true,
  as = "h2",
}: SectionHeadProps) {
  return (
    <div className={`section-head ${className}`.trim()}>
      <SectionIndex index={index} light={light} />
      <RevealHeading
        as={as}
        className={`display text-[clamp(2.2rem,5vw,3.8rem)] ${light ? "text-white" : ""}`}
        mode={mode}
      >
        {title}
      </RevealHeading>
      {lead ? (
        <RevealText
          className={`mt-4 max-w-xl prose-max ${light ? "text-white/80" : "text-[var(--muted)]"}`}
          delay={0.1}
        >
          <p>{lead}</p>
        </RevealText>
      ) : null}
      {rule ? (
        <AnimatedLine
          className={`tech-rule mt-6 ${light ? "tech-rule--light" : ""}`}
          delay={0.15}
        />
      ) : null}
    </div>
  );
}
