import { AboutContent } from "@/components/about/AboutContent";
import { CtaRequest } from "@/components/sections/CtaRequest";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "О компании",
  description:
    "ООО «Теплоэнергокомплект» — ремонт, строительство и обслуживание котельных, паровых и водогрейных котлов. Полный цикл работ по России.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutContent />
      <CtaRequest heading={"Обсудить задачу\nпо котельному\nоборудованию?"} />
    </>
  );
}
