import type { ReactNode } from "react";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
