import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
};

export function Container({ children, className = "", as: Tag = "div" }: Props) {
  return <Tag className={`container ${className}`.trim()}>{children}</Tag>;
}
