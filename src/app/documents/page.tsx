import { DocumentsContent } from "@/components/documents/DocumentsContent";
import { CtaRequest } from "@/components/sections/CtaRequest";
import { documentsSection } from "@/data/documents";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: documentsSection.metaTitle,
  description: documentsSection.metaDescription,
  path: "/documents",
});

export default function DocumentsPage() {
  return (
    <>
      <DocumentsContent />
      <CtaRequest heading={"Нужны сведения\nо допусках\nили копии?"} />
    </>
  );
}
