import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServicePage } from "@/components/services/ServicePage";
import { getService, services } from "@/data/services";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.href,
  });
}

export default async function ServiceRoutePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Услуги", path: "/services" },
            { name: service.title, path: service.href },
          ]),
          serviceJsonLd({
            name: service.h1,
            description: service.metaDescription,
            path: service.href,
          }),
        ]}
      />
      <ServicePage service={service} />
    </>
  );
}
