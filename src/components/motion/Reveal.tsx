"use client";

import type { ReactNode, RefObject } from "react";
import { useRevealGate } from "@/hooks/useRevealGate";

type RevealVariant = "up" | "fade" | "clip" | "clipLeft" | "scale";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  amount?: "default" | "tight";
  id?: string;
};

const variantClass: Record<RevealVariant, string> = {
  up: "reveal-up",
  fade: "reveal-fade",
  clip: "reveal-clip",
  clipLeft: "reveal-clip-left",
  scale: "reveal-scale",
};

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  amount = "default",
  id,
}: RevealProps) {
  const [ref, show] = useRevealGate<HTMLDivElement>({ amount });

  return (
    <div
      ref={ref}
      id={id}
      className={`${variantClass[variant]} ${show ? "is-in" : ""} ${className ?? ""}`.trim()}
      style={{ ["--reveal-delay" as string]: `${delay}s` }}
    >
      {children}
    </div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  fast?: boolean;
  as?: "div" | "ul" | "ol" | "section";
};

export function Stagger({ children, className, fast = false, as = "div" }: StaggerProps) {
  const [ref, show] = useRevealGate<HTMLElement>({ amount: "default" });
  const cls = `stagger-root ${fast ? "stagger-root--fast" : ""} ${show ? "is-in" : ""} ${className ?? ""}`.trim();

  if (as === "ul") {
    return (
      <ul ref={ref as RefObject<HTMLUListElement | null>} className={cls}>
        {children}
      </ul>
    );
  }
  if (as === "ol") {
    return (
      <ol ref={ref as RefObject<HTMLOListElement | null>} className={cls}>
        {children}
      </ol>
    );
  }
  if (as === "section") {
    return (
      <section ref={ref as RefObject<HTMLElement | null>} className={cls}>
        {children}
      </section>
    );
  }
  return (
    <div ref={ref as RefObject<HTMLDivElement | null>} className={cls}>
      {children}
    </div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
};

export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const cls = `stagger-item ${className ?? ""}`.trim();
  if (as === "article") return <article className={cls}>{children}</article>;
  if (as === "li") return <li className={cls}>{children}</li>;
  return <div className={cls}>{children}</div>;
}
