import Link from "next/link";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  COMPARE_PAGE_DATA,
  INDUSTRY_PAGE_DATA,
  LOCATION_PAGE_DATA,
  PRIMARY_TRADES,
  RESOURCE_PAGE_DATA,
  TRADE_AUDIT_BOOKING_URL,
  TRADE_AUDIT_CTA_HREF,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/trades";

export const metadata = buildPageMetadata({
  title: "Custom Software, Websites & Marketing Systems for Trade Businesses",
  description:
    "USATII builds custom in-house software, websites, and marketing systems for Rochester trade businesses to replace software sprawl and improve operations.",
  path: PATH,
});

export default function TradesHubPage() {
  const keySoftwareLinks = [
    {
      label: "Custom Software for Contractors",
      href: "/software/custom-software-for-contractors",
    },
    {
      label: "Free Software Waste Audit",
      href: "/software/software-waste-audit",
    },
    {
      label: "Contractor Operating System",
      href: "/software/contractor-operating-system",
    },
    {
      label: "Replace Contractor Subscriptions",
      href: "/software/replace-contractor-software-subscriptions",
    },
    {
      label: "Contractor Websites",
      href: "/websites/contractor-websites",
    },
    {
      label: "Contractor Marketing Systems",
      href: "/marketing/contractor-marketing-systems",
    },
  ];

  const locationLinks = LOCATION_PAGE_DATA.map((location) => ({
    label: `${location.city}, ${location.state}`,
    href: `/locations/${location.slug}`,
  }));

  const industryLinks = INDUSTRY_PAGE_DATA.map((industry) => ({
    label: industry.title.replace("Custom Software for ", ""),
    href: `/industries/${industry.slug}`,
  }));

  const compareLinks = COMPARE_PAGE_DATA.slice(0, 6).map((item) => ({
    label: item.title,
    href: `/compare/${item.slug}`,
  }));

  const resourceLinks = RESOURCE_PAGE_DATA.slice(0, 6).map((item) => ({
    label: item.title,
    href: `/resources/${item.slug}`,
  }));

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Custom Software, Websites & Marketing Systems for Trade Businesses",
    description:
      "USATII builds custom in-house software systems for Rochester trade businesses with lead intake, estimates, scheduling, job tracking, invoicing, and follow-up workflows.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: PATH },
    ],
    serviceType: "Custom Contractor Software Development",
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Trades Systems"
      title="Custom Software, Websites & Marketing Systems for Trade Businesses"
      intro="USATII helps trade companies in Rochester replace software sprawl with one in-house operating system. We improve lead intake, estimates, scheduling, job tracking, invoicing, crew communication, client portals, and marketing follow-up."
      proofPoints={[
        "Primary offer: custom in-house systems for trades",
        "Secondary proof: high-output content and paid ad execution",
        "Built in Rochester for local service businesses",
      ]}
      primaryCta={{
        label: "Book free software waste audit",
        href: TRADE_AUDIT_BOOKING_URL,
      }}
      secondaryCta={{
        label: "View audit page",
        href: TRADE_AUDIT_CTA_HREF,
      }}
      sidebar={
        <div className="rounded-xl border border-[#e4e7f2] bg-white p-5 shadow-[0_12px_30px_rgba(74,58,255,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d4dff]">
            Core promise
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5a6178]">
            We build systems that reduce tool overlap and improve speed from first lead to paid invoice.
          </p>
          <Link
            href="/software/software-waste-audit"
            className="mt-4 inline-flex rounded-md border border-[#d7d9e6] bg-[#f5f3ff] px-4 py-2 text-sm font-semibold text-[#5b3fd0] transition hover:border-[#b9a8ff] hover:text-[#4c33b8]"
          >
            Start with audit
          </Link>
        </div>
      }
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="What USATII Builds for Trade Businesses" eyebrow="Core Offering">
        <p>
          USATII builds contractor operating systems that connect lead intake,
          estimating, scheduling, dispatch, invoicing, and follow-up in one
          workflow. Website and marketing services are implemented to support that
          system and increase qualified demand.
        </p>
        <BulletGrid
          items={[
            "Custom software tailored to office and field workflows",
            "Contractor websites built to capture and convert qualified leads",
            "Marketing systems tied to response speed and pipeline quality",
            "Rochester-based, founder-led implementation with technical oversight",
          ]}
        />
      </ChunkSection>

      <ChunkSection title="Target trades" eyebrow="Industries">
        <p>
          USATII supports the trades below with workflow design, reporting, and
          automation tailored to each service model.
        </p>
        <BulletGrid items={PRIMARY_TRADES} />
      </ChunkSection>

      <ChunkSection title="Most Requested Services" eyebrow="Start Here">
        <p>
          These are the services contractors most often start with when they want
          to reduce software waste and tighten operations.
        </p>
        <PageLinkGrid links={keySoftwareLinks} />
      </ChunkSection>

      <ChunkSection title="Local Rochester SEO coverage" eyebrow="Locations">
        <p>
          USATII serves Rochester and surrounding markets with location-specific
          pages that reflect real coverage areas and local service demand.
        </p>
        <PageLinkGrid links={locationLinks} />
      </ChunkSection>

      <ChunkSection title="Comparison pages" eyebrow="Build vs Buy">
        <p>
          These comparisons help you evaluate when to keep existing SaaS tools and
          when a custom build offers better operational leverage.
        </p>
        <PageLinkGrid links={compareLinks} />
      </ChunkSection>

      <ChunkSection title="Resource pages" eyebrow="Authority">
        <p>
          These guides and calculators give owners practical frameworks to evaluate
          software spend, workflow bottlenecks, and implementation priorities.
        </p>
        <PageLinkGrid links={resourceLinks} />
      </ChunkSection>

      <ChunkSection title="Industry Software Guides" eyebrow="By Trade">
        <p>
          Each industry guide outlines common operational bottlenecks, what to keep
          or replace in your stack, and clear next steps for implementation.
        </p>
        <PageLinkGrid links={industryLinks} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
