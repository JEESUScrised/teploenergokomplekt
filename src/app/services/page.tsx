import { CtaRequest } from "@/components/sections/CtaRequest";
import { ServicesIndexContent } from "@/components/services/ServicesIndexContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Услуги — диагностика, ремонт и модернизация котлов",
  description:
    "Основные услуги ООО «Теплоэнергокомплект»: диагностика и обследование, ремонт котлов и КВО, обмуровка, пусконаладка, реконструкция и поставка комплектующих.",
  path: "/services",
});

export default function ServicesIndexPage() {
  return (
    <>
      <ServicesIndexContent />
      <CtaRequest heading={"Какая услуга\nнужна на вашем\nобъекте?"} />
    </>
  );
}
