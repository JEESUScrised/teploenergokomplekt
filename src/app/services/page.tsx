import { CtaRequest } from "@/components/sections/CtaRequest";
import { ServicesIndexContent } from "@/components/services/ServicesIndexContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Услуги — ремонт, модернизация и обслуживание котлов",
  description:
    "Полный перечень услуг ООО «Теплоэнергокомплект»: ремонт котлов, реконструкция, пусконаладка, обмуровка, диагностика, обслуживание и поставка комплектующих.",
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
