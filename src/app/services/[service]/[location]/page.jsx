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
  buildCitySpecificServiceNarrative,
  buildLocationDeliverables,
  buildLocationFaqs,
  buildServiceLocationPath,
  buildServicePath,
  getApprovedServiceLocationPairs,
  getLocationBySlug,
  getServiceBySlug,
  getServiceLocationMetaDescription,
  isApprovedServiceLocation,
  pickNearbyServiceLocationLinks,
  pickRelatedServiceLocationLinks,
} from "@/lib/services-seo";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getApprovedServiceLocationPairs().map(({ serviceSlug, locationSlug }) => ({
    service: serviceSlug,
    location: locationSlug,
  }));
}

export async function generateMetadata({ params }) {
  const { service: serviceSlug, location: locationSlug } = await params;

  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locationSlug);

  if (!service || !location || !isApprovedServiceLocation(serviceSlug, locationSlug)) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: `${service.agencyTitle} in ${location.name}`,
    description: getServiceLocationMetaDescription(service, location),
    path: buildServiceLocationPath(serviceSlug, locationSlug),
  });
}

export default async function ServiceLocationPage({ params }) {
  const { service: serviceSlug, location: locationSlug } = await params;

  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locationSlug);

  if (!service || !location || !isApprovedServiceLocation(serviceSlug, locationSlug)) {
    notFound();
  }

  const locationNarrative = buildCitySpecificServiceNarrative(service, location);
  const locationDeliverables = buildLocationDeliverables(service, location);
  const locationFaqs = buildLocationFaqs(service, location);
  const relatedServiceLinks = pickRelatedServiceLocationLinks(serviceSlug, locationSlug);
  const nearbyLocationLinks = pickNearbyServiceLocationLinks(serviceSlug, locationSlug);

  const approachBullets = [
    `Market context: ${location.marketFocus}.`,
    `Operational priority: ${location.deliverablePriority}.`,
    "Positioning and messaging adapted to local demand realities.",
    "Execution and optimization tied to qualified lead quality.",
  ];

  const schemas = buildStandardSchemas({
    path: buildServiceLocationPath(serviceSlug, locationSlug),
    title: `${service.agencyTitle} in ${location.name}`,
    description: getServiceLocationMetaDescription(service, location),
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.name, path: buildServicePath(serviceSlug) },
      { name: location.name, path: buildServiceLocationPath(serviceSlug, locationSlug) },
    ],
    faqs: locationFaqs,
    serviceType: `${service.agencyTitle} in ${location.name}`,
    areaServed: [
      location.name,
      ...location.nearbyMajor
        .map((slug) => getLocationBySlug(slug)?.name)
        .filter(Boolean),
    ],
  });

  return (
    <ChunkySeoLayout
      eyebrow={location.name}
      title={`${service.agencyTitle} in ${location.name}`}
      intro={`USATII helps ${location.name} businesses build ${service.outcome}. ${locationNarrative}`}
      proofPoints={service.whyUs.slice(0, 4)}
      primaryCta={{ label: "Book strategy call", href: "https://cal.com/usatii/onboarding" }}
      secondaryCta={{ label: `View ${service.name} service`, href: buildServicePath(serviceSlug) }}
      sidebar={(
        <div className="space-y-3 rounded-md border border-[#dbe0eb] bg-white p-4">
          <p className="text-sm font-bold text-[#17203a]">Local Service Overview</p>
          <p className="text-sm leading-6 text-[#58617a]">{location.opening}</p>
          <Link
            href={buildServiceLocationPath(serviceSlug, locationSlug)}
            className="inline-flex text-sm font-semibold text-[#5f41ea] transition hover:text-[#4a32cb]"
          >
            View this city service page
          </Link>
        </div>
      )}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title={`${service.name} for ${location.name} businesses`}>
        <p>{locationNarrative}</p>
      </ChunkSection>

      <ChunkSection title="What is included">
        <BulletGrid items={locationDeliverables} />
      </ChunkSection>

      <ChunkSection title={`How USATII approaches ${service.name.toLowerCase()} in ${location.name}`}>
        <BulletGrid items={approachBullets} />
      </ChunkSection>

      <ChunkSection title="Best-fit businesses">
        <BulletGrid items={service.bestFor} />
      </ChunkSection>

      <ChunkSection title="Why work with USATII">
        <BulletGrid items={service.whyUs} />
      </ChunkSection>

      <ChunkSection title="FAQs">
        <FaqCards faqs={locationFaqs} />
      </ChunkSection>

      <ChunkSection title="Related services in this market">
        <PageLinkGrid links={relatedServiceLinks} />
      </ChunkSection>

      {nearbyLocationLinks.length > 0 ? (
        <ChunkSection title={`Nearby markets for ${service.name}`}>
          <PageLinkGrid links={nearbyLocationLinks} />
        </ChunkSection>
      ) : null}
    </ChunkySeoLayout>
  );
}
