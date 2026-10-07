"use client";

import type { ReactNode } from "react";
import { useRevealGate } from "@/hooks/useRevealGate";

type Props = {
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  mode?: "lines" | "clip" | "up";
  delay?: number;
};

export function RevealHeading({
  children,
  as: Tag = "h2",
  className = "",
  mode = "clip",
  delay = 0,
}: Props) {
  const [ref, show] = useRevealGate<HTMLHeadingElement>();
  const lines = children.split("\n");

  if (mode === "lines") {
    return (
      <Tag ref={ref} className={className}>
        {lines.map((line, i) => (
          <span key={`${line}-${i}`} className="block overflow-hidden py-[0.06em]">
            <span
              className={`block reveal-line ${show ? "is-in" : ""}`}
              style={{ ["--reveal-delay" as string]: `${delay + i * 0.08}s` }}
            >
              {line || "\u00A0"}
            </span>
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={`${className} reveal-${mode} ${show ? "is-in" : ""}`.trim()}
      style={{ ["--reveal-delay" as string]: `${delay}s` }}
    >
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="block">
          {line || "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}

type RevealTextProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function RevealText({ children, className, delay = 0 }: RevealTextProps) {
  const [ref, show] = useRevealGate<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal-up ${show ? "is-in" : ""} ${className ?? ""}`.trim()}
      style={{ ["--reveal-delay" as string]: `${delay}s` }}
    >
      {children}
    </div>
  );
}
