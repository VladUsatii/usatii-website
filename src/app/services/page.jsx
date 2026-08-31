import Link from "next/link";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  buildServiceLocationPath,
  buildServicePath,
  getLocationBySlug,
  getRolloutLocationsByService,
  getServiceBySlug,
  getServiceSlugs,
} from "@/lib/services-seo";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/services";

export const metadata = buildPageMetadata({
  title: "Website Design Services",
  description:
    "Custom website and landing-page design services by USATII.",
  path: PATH,
});

function getServiceSummaries() {
  return getServiceSlugs()
    .map((slug) => {
      const service = getServiceBySlug(slug);
      if (!service) return null;

      return {
        slug,
        name: service.name,
        outcome: service.outcome,
        whoFor: service.whoFor,
        heroPromise: service.heroPromise,
        href: buildServicePath(slug),
      };
    })
    .filter(Boolean);
}

function getPopularServiceLocationLinks() {
  const locationLinks = [];

  getServiceSlugs().forEach((serviceSlug) => {
    const service = getServiceBySlug(serviceSlug);
    if (!service) return;

    const localRollout = getRolloutLocationsByService(serviceSlug).slice(0, 2);
    localRollout.forEach((locationSlug) => {
      const location = getLocationBySlug(locationSlug);
      if (!location) return;

      locationLinks.push({
        label: `${service.name} in ${location.name}`,
        href: buildServiceLocationPath(serviceSlug, locationSlug),
      });
    });
  });

  return locationLinks.slice(0, 12);
}

export default function ServicesPage() {
  const services = getServiceSummaries();
  const serviceLinks = services.map((service) => ({
    label: service.name,
    href: service.href,
  }));
  const popularServiceLocationLinks = getPopularServiceLocationLinks();

  const architectureBullets = [
    "Discovery: organizational requirements, users, and technical constraints",
    "Architecture: content structure, application boundaries, and integrations",
    "Implementation: accessible interfaces, tested components, and secure deployment",
    "Ownership: documented systems, portable data, and maintainable source code",
    "Operations: monitoring, updates, and accountable technical support",
    "Extension: a clear path from the public website into custom business software",
  ];

  const startHereTracks = [
    {
      title: "Public website",
      body:
        "Design and build a complete public website around the organization, its users, and its operational requirements.",
      links: [
        { label: "Website Design", href: "/services/website-design" },
      ],
    },
    {
      title: "Focused application",
      body:
        "Build a purpose-specific landing page for a program, product, recruitment effort, or operational intake process.",
      links: [
        { label: "Landing Page Design", href: "/services/landing-page-design" },
      ],
    },
  ];

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Website Design Services",
    description:
      "Custom website and landing-page design services delivered as maintainable technical systems.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: PATH },
    ],
    serviceType: "Custom Website Design and Development",
    areaServed: ["Rochester, NY", "United States"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Services"
      title="Website Design and Development"
      intro="USATII designs and builds public websites and focused web applications as maintainable technical systems owned by the organizations that use them."
      proofPoints={[
        "Custom design and implementation",
        "Accessible and responsive interfaces",
        "Documented ownership and maintainable source code",
        "Integration with internal software and operational workflows",
      ]}
      primaryCta={{ label: "Book strategy call", href: "https://cal.com/usatii/onboarding" }}
      secondaryCta={{ label: "Request a quote", href: "/quote-request" }}
      showRecentWork
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Service Catalog">
        <p>
          Each service page outlines scope, process, deliverables, and fit so you
          can choose the right engagement for your current bottleneck.
        </p>
        <PageLinkGrid links={serviceLinks} />
      </ChunkSection>

      <ChunkSection title="What each system is designed to do" eyebrow="Outcomes">
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="border border-[#dbe0eb] bg-[#f7f9fd] p-4">
              <p className="text-lg font-black tracking-tight text-[#1a223a]">{service.name}</p>
              <p className="mt-2 text-sm leading-6 text-[#54607c]">{service.heroPromise}</p>
              <p className="mt-2 text-xs leading-5 text-[#6a738d]">{service.whoFor}</p>
              <Link
                href={service.href}
                className="mt-3 inline-flex text-sm font-semibold text-[#5f41ea] transition hover:text-[#4a32cb]"
              >
                View service page
              </Link>
            </article>
          ))}
        </div>
      </ChunkSection>

      <ChunkSection title="How engagement delivery works" eyebrow="Operating model">
        <BulletGrid items={architectureBullets} />
      </ChunkSection>

      <ChunkSection title="Service Areas by City">
        <p>
          These pages show how each service is adapted to market conditions in
          specific cities.
        </p>
        <PageLinkGrid links={popularServiceLocationLinks} />
      </ChunkSection>

      <ChunkSection title="Start with the right first system" eyebrow="Guidance">
        <div className="grid gap-4 md:grid-cols-3">
          {startHereTracks.map((track) => (
            <article key={track.title} className="border border-[#dbe0eb] bg-[#f7f9fd] p-4">
              <h3 className="text-xl font-black tracking-tight text-[#12182f]">{track.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#58617a]">{track.body}</p>
              <div className="mt-3 flex flex-col gap-1.5 text-sm font-semibold">
                {track.links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-[#5f41ea] transition hover:text-[#4a32cb]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
