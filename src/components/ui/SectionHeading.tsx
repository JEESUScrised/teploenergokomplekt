"use client";

import { Reveal } from "@/components/motion/Reveal";
import { RevealHeading, RevealText } from "@/components/motion/RevealHeading";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  mode?: "lines" | "clip" | "up";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className = "",
  mode = "clip",
}: Props) {
  return (
    <div
      className={`${align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl"} ${className}`.trim()}
    >
      {eyebrow ? (
        <Reveal variant="fade">
          <p className="eyebrow mb-3">{eyebrow}</p>
        </Reveal>
      ) : null}
      <RevealHeading
        as={Tag}
        className="display text-[clamp(2.4rem,6vw,4.5rem)] whitespace-pre-line"
        mode={mode}
      >
        {title}
      </RevealHeading>
      {description ? (
        <RevealText className="mt-5 text-[1.05rem] text-[var(--muted)] leading-relaxed" delay={0.1}>
          <p>{description}</p>
        </RevealText>
      ) : null}
    </div>
  );
}
