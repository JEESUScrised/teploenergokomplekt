import { AboutStrip } from "@/components/sections/home/AboutStrip";
import { Advantages } from "@/components/sections/home/Advantages";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { LicensesBand } from "@/components/sections/home/LicensesBand";
import { ProjectsSection } from "@/components/sections/home/ProjectsSection";
import { ServiceTicker } from "@/components/sections/home/ServiceTicker";
import { ServicesEditorial } from "@/components/sections/home/ServicesEditorial";
import { CtaRequest } from "@/components/sections/CtaRequest";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ремонт промышленных котлов",
  description:
    "Ремонт паровых и водогрейных котлов, реконструкция котельных, пусконаладка, обмуровка и диагностика. Выезд по России.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutStrip />
      <ServiceTicker />
      <ServicesEditorial />
      <ProjectsSection />
      <Advantages />
      <LicensesBand />
      <CtaRequest />
    </>
  );
}
