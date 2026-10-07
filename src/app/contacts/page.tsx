import { ContactsContent } from "@/components/contacts/ContactsContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Контакты",
  description:
    "Контакты ООО «Теплоэнергокомплект». Заявка на консультацию по ремонту, модернизации и обслуживанию котельного оборудования.",
  path: "/contacts",
});

export default function ContactsPage() {
  return <ContactsContent />;
}