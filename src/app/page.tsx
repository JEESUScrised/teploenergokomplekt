import { AboutStrip } from "@/components/sections/home/AboutStrip";
import { Advantages } from "@/components/sections/home/Advantages";
import { GeographyQualityBand } from "@/components/sections/home/GeographyQualityBand";
import { LicensesBand } from "@/components/sections/home/LicensesBand";
import { ProjectsSection } from "@/components/sections/home/ProjectsSection";
import { ServiceTicker } from "@/components/sections/home/ServiceTicker";
import { ServicesEditorial } from "@/components/sections/home/ServicesEditorial";
import { CtaRequest } from "@/components/sections/CtaRequest";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ремонт промышленных котлов",
  description:
    "ООО «Теплоэнергокомплект» — ремонт, строительство и обслуживание котельных, паровых и водогрейных котлов. Полный цикл работ по России — от Белгорода до Находки.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <AboutStrip />
      <ServiceTicker />
      <ServicesEditorial />
      <GeographyQualityBand />
      <ProjectsSection />
      <Advantages />
      <LicensesBand />
      <CtaRequest />
    </>
  );
}
