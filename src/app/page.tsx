import { AboutStrip } from "@/components/sections/home/AboutStrip";
import { Advantages } from "@/components/sections/home/Advantages";
import { HomeDirections } from "@/components/sections/home/HomeDirections";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { LicensesBand } from "@/components/sections/home/LicensesBand";
import { ProjectsSection } from "@/components/sections/home/ProjectsSection";
import { RepairStages } from "@/components/sections/home/RepairStages";
import { RepairTypes } from "@/components/sections/home/RepairTypes";
import { ServiceTicker } from "@/components/sections/home/ServiceTicker";
import { ServicesEditorial } from "@/components/sections/home/ServicesEditorial";
import { CtaRequest } from "@/components/sections/CtaRequest";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ремонт промышленных котлов",
  description:
    "Ремонт паровых и водогрейных котлов, реконструкция котельных, пусконаладка, обмуровка, диагностика и обслуживание. Выезд по России.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ServiceTicker />
      <AboutStrip />
      <ServicesEditorial />
      <RepairTypes />
      <HomeDirections />
      <RepairStages />
      <ProjectsSection />
      <Advantages />
      <LicensesBand />
      <CtaRequest />
    </>
  );
}
