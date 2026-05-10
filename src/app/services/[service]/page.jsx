import Link from "next/link";
import { notFound } from "next/navigation";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  FaqCards,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  getServiceBySlug,
  getServiceMetaDescription,
  getServiceSlugs,
  getRolloutLocationsByService,
  getLocationBySlug,
  buildServiceLocationPath,
  buildServicePath,
} from "@/lib/services-seo";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceSlugs().map((service) => ({ service }));
}

export async function generateMetadata({ params }) {
  const { service: serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return {
      title: "Service Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: `${service.agencyTitle}`,
    description: getServiceMetaDescription(service),
    path: buildServicePath(serviceSlug),
  });
}

export default async function ServicePage({ params }) {
  const { service: serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    notFound();
  }

  const locationSlugs = getRolloutLocationsByService(serviceSlug);
  const locationLinks = locationSlugs
    .map((locationSlug) => {
      const location = getLocationBySlug(locationSlug);
      if (!location) return null;
      return {
        label: `${service.name} in ${location.name}`,
        href: buildServiceLocationPath(serviceSlug, locationSlug),
      };
    })
    .filter(Boolean);

  const processItems = service.process.map(
    (step, index) => `Step ${index + 1}: ${step.title} - ${step.body}`,
  );

  const schemas = buildStandardSchemas({
    path: buildServicePath(serviceSlug),
    title: service.agencyTitle,
    description: getServiceMetaDescription(service),
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.name, path: buildServicePath(serviceSlug) },
    ],
    faqs: service.faqs,
    serviceType: service.agencyTitle,
    areaServed: locationSlugs
      .map((locationSlug) => getLocationBySlug(locationSlug)?.name)
      .filter(Boolean),
  });

  return (
    <ChunkySeoLayout
      eyebrow="Service"
      title={service.agencyTitle}
      intro={`${service.heroPromise} ${service.whoFor}`}
      proofPoints={service.whyUs.slice(0, 4)}
      primaryCta={{ label: "Book strategy call", href: "https://cal.com/usatii/onboarding" }}
      secondaryCta={{ label: "Browse all services", href: "/services" }}
      sidebar={(
        <div className="space-y-3 rounded-md border border-[#dbe0eb] bg-white p-4">
          <p className="text-sm font-bold text-[#17203a]">Service Scope Snapshot</p>
          <p className="text-sm leading-6 text-[#58617a]">{service.outcome}</p>
          <Link
            href={buildServicePath(serviceSlug)}
            className="inline-flex text-sm font-semibold text-[#5f41ea] transition hover:text-[#4a32cb]"
          >
            View full service details
          </Link>
        </div>
      )}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="What USATII does for this service">
        {service.whatWeDo.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </ChunkSection>

      <ChunkSection title="Deliverables">
        <BulletGrid items={service.deliverables} />
      </ChunkSection>

      <ChunkSection title="Execution process">
        <BulletGrid items={processItems} />
      </ChunkSection>

      <ChunkSection title="Best fit teams">
        <BulletGrid items={service.bestFor} />
      </ChunkSection>

      <ChunkSection title="Why USATII">
        <BulletGrid items={service.whyUs} />
      </ChunkSection>

      <ChunkSection title="FAQs">
        <FaqCards faqs={service.faqs} />
      </ChunkSection>

      <ChunkSection title="Popular locations for this service">
        <PageLinkGrid links={locationLinks} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
