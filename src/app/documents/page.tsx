import { DocumentsContent } from "@/components/documents/DocumentsContent";
import { CtaRequest } from "@/components/sections/CtaRequest";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Разрешительные документы",
  description:
    "Лицензии и допуски ООО «Теплоэнергокомплект»: Ростехнадзор, СРО, НАКС, промышленная безопасность и страхование ОПО.",
  path: "/documents",
});

export default function DocumentsPage() {
  return (
    <>
      <DocumentsContent />
      <CtaRequest heading={"Нужны копии\nдокументов\nдля тендера?"} />
    </>
  );
}
