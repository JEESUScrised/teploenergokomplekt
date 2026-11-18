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

    // Layout-box check (ignores paint clip-path). Above-the-fold headings
    // with `.reveal-clip` otherwise stay at opacity 0 until the failsafe.
    const layoutVisible = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top < vh * 0.95 &&
        rect.bottom > 0
      );
    };

    let raf = 0;
    if (layoutVisible()) {
      raf = window.requestAnimationFrame(() => {
        raf = window.requestAnimationFrame(reveal);
      });
      return () => {
        window.cancelAnimationFrame(raf);
      };
    }

    // Never leave content invisible if IO fails / HMR race
    const failsafe = window.setTimeout(reveal, 1200);

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
      window.cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [once, threshold]);

  return [ref, show];
}
