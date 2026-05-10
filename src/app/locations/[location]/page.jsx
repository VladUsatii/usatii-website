import { notFound } from "next/navigation";
import Link from "next/link";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  getLocationPageBySlug,
  INDUSTRY_PAGE_DATA,
  LOCATION_PAGE_DATA,
  TRADE_AUDIT_BOOKING_URL,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATION_PAGE_DATA.map((location) => ({ location: location.slug }));
}

export async function generateMetadata({ params }) {
  const { location } = await params;
  const page = getLocationPageBySlug(location);

  if (!page) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.intro,
    path: `/locations/${page.slug}`,
  });
}

export default async function LocationDetailPage({ params }) {
  const { location } = await params;
  const page = getLocationPageBySlug(location);

  if (!page) {
    notFound();
  }

  const tradeLinks = INDUSTRY_PAGE_DATA.filter((industry) =>
    page.nearbyTrades.includes(industry.trade),
  ).map((industry) => ({
    label: industry.title,
    href: `/industries/${industry.slug}`,
  }));

  const schemas = buildStandardSchemas({
    path: `/locations/${page.slug}`,
    title: page.title,
    description: page.intro,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Locations", path: "/locations" },
      { name: `${page.city}, ${page.state}`, path: `/locations/${page.slug}` },
    ],
    serviceType: `Custom Software for Trade Businesses in ${page.city}, ${page.state}`,
    areaServed: [`${page.city}, ${page.state}`, "Rochester, NY", "Monroe County, NY"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Local service page"
      title={page.title}
      intro={page.intro}
      proofPoints={[
        "Specific local service-area language",
        "Nearby trades and workflow examples",
        "Direct CTA to software waste audit",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View all locations", href: "/locations" }}
      sidebar={
        <div className="rounded-xl border border-[#e4e7f2] bg-white p-5 shadow-[0_12px_30px_rgba(74,58,255,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d4dff]">
            Local CTA
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5a6178]">{page.cta}</p>
          <Link
            href="/software/software-waste-audit"
            className="mt-4 inline-flex rounded-md border border-[#d7d9e6] bg-[#f5f3ff] px-4 py-2 text-sm font-semibold text-[#5b3fd0] transition hover:border-[#b9a8ff] hover:text-[#4c33b8]"
          >
            Book free audit
          </Link>
        </div>
      }
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Local proof and context" eyebrow="Real service area intent">
        <BulletGrid items={page.localProof} />
      </ChunkSection>

      <ChunkSection title="Nearby trades served">
        <BulletGrid items={page.nearbyTrades} />
      </ChunkSection>

      <ChunkSection title="Service-area language">
        <p>{page.serviceAreaLanguage}</p>
        <p>
          Service areas should stay specific and accurate to where your team can
          consistently deliver work.
        </p>
      </ChunkSection>

      <ChunkSection title="Related industry pages">
        <PageLinkGrid links={tradeLinks} />
      </ChunkSection>

      <ChunkSection title="Specific call to action">
        <p>{page.cta}</p>
        <Link
          href="/software/software-waste-audit"
          className="inline-flex rounded-md border border-[#b8abff] bg-[#eee9ff] px-5 py-3 text-sm font-semibold text-[#4d34b8] transition hover:bg-[#e6deff]"
        >
          Start free software waste audit
        </Link>
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
