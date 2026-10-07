"use client";

import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";

type Props = {
  src: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  offset?: number;
  axis?: "y" | "x";
};

/** Subtle technical-layer decor — opacity kept low, motion slow */
export function PipeDecor({
  src,
  className = "",
  alt = "",
  width = 220,
  height = 220,
  offset = 36,
  axis = "y",
}: Props) {
  return (
    <Parallax offset={offset} axis={axis} className={`pointer-events-none select-none ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full object-contain opacity-[0.12] grayscale"
        sizes="220px"
        aria-hidden={alt ? undefined : true}
      />
    </Parallax>
  );
}
