import type { Transition, Variants } from "motion/react";

/** Industrial / editorial easing — confident, no bounce */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1];
export const easeInOutCubic: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const duration = {
  fast: 0.28,
  base: 0.45,
  slow: 0.7,
  reveal: 0.85,
} as const;

export const transitionBase: Transition = {
  duration: duration.base,
  ease: easeOutExpo,
};

export const transitionReveal: Transition = {
  duration: duration.reveal,
  ease: easeOutExpo,
};

/** Loose viewport so above-the-fold content always triggers */
export const viewportOnce = {
  once: true,
  amount: 0.05 as const,
  margin: "0px 0px -5% 0px" as const,
};

export const viewportTight = {
  once: true,
  amount: 0.15 as const,
  margin: "0px 0px 0px 0px" as const,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionBase,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.base, ease: easeOutQuart },
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0.85 },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: transitionReveal,
  },
};

export const clipRevealLeft: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0.9 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: transitionReveal,
  },
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionReveal,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionBase,
  },
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.22, ease: easeInOutCubic },
  },
};

export const reducedMotionTransition: Transition = {
  duration: 0.01,
};
