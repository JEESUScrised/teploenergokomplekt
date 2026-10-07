"use client";

import { useRevealGate } from "@/hooks/useRevealGate";

type Props = {
  className?: string;
  delay?: number;
  vertical?: boolean;
};

export function AnimatedLine({ className = "", delay = 0, vertical = false }: Props) {
  const [ref, show] = useRevealGate<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${vertical ? "tech-rule-v" : "tech-rule"} ${show ? "is-in" : ""} ${className}`.trim()}
      aria-hidden="true"
      style={{ ["--reveal-delay" as string]: `${delay}s`, transitionDelay: `${delay}s` }}
    />
  );
}
