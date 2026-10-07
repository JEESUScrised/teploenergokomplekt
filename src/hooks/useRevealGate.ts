"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  amount?: "default" | "tight";
  once?: boolean;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scroll-triggered reveal gate. Adds visibility when the element enters
 * the viewport. Includes a failsafe so content never stays at opacity 0.
 */
export function useRevealGate<T extends HTMLElement = HTMLElement>(
  options: Options = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [show, setShow] = useState(prefersReducedMotion);
  const once = options.once ?? true;
  const threshold = options.amount === "tight" ? 0.18 : 0.08;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

    let settled = false;
    const reveal = () => {
      if (settled) return;
      settled = true;
      setShow(true);
    };

    // Never leave content invisible if IO fails / HMR race
    const failsafe = window.setTimeout(reveal, 2800);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        window.clearTimeout(failsafe);
        reveal();
        if (once) io.disconnect();
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    io.observe(el);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, [once, threshold]);

  return [ref, show];
}
