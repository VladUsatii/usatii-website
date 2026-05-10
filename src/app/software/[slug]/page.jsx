import { notFound } from "next/navigation";
import Link from "next/link";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  FaqCards,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  SOFTWARE_PAGE_DATA,
  getSoftwarePageBySlug,
  TRADE_AUDIT_BOOKING_URL,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SOFTWARE_PAGE_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getSoftwarePageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/software/${page.slug}`,
  });
}

export default async function SoftwareDetailPage({ params }) {
  const { slug } = await params;
  const page = getSoftwarePageBySlug(slug);

  if (!page) {
    notFound();
  }

  const relatedLinks = Object.values(SOFTWARE_PAGE_DATA)
    .filter((item) => item.slug !== page.slug)
    .map((item) => ({
      label: item.title,
      href: `/software/${item.slug}`,
    }));

  const schemas = buildStandardSchemas({
    path: `/software/${page.slug}`,
    title: page.title,
    description: page.description,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Software", path: "/software" },
      { name: page.title, path: `/software/${page.slug}` },
    ],
    faqs: page.faqs,
    serviceType: page.title,
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
  });

  return (
    <ChunkySeoLayout
      eyebrow={page.heroEyebrow}
      title={page.title}
      intro={page.heroIntro}
      proofPoints={page.proofPoints}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View all software pages", href: "/software" }}
      sidebar={
        <div className="rounded-xl border border-[#e4e7f2] bg-white p-5 shadow-[0_12px_30px_rgba(74,58,255,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d4dff]">
            Audit-first rollout
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5a6178]">
            Every build starts with a software waste audit so we can protect what
            works and replace what slows your team down.
          </p>
          <Link
            href="/software/software-waste-audit"
            className="mt-4 inline-flex rounded-md border border-[#d7d9e6] bg-[#f5f3ff] px-4 py-2 text-sm font-semibold text-[#5b3fd0] transition hover:border-[#b9a8ff] hover:text-[#4c33b8]"
          >
            See audit page
          </Link>
        </div>
      }
    >
      <SchemaScripts schemas={schemas} />

      {page.sections.map((section) => (
        <ChunkSection key={section.heading} title={section.heading}>
          <p>{section.body}</p>
          {section.bullets?.length ? <BulletGrid items={section.bullets} /> : null}
        </ChunkSection>
      ))}

      <ChunkSection title="Frequently asked questions" eyebrow="FAQ">
        <FaqCards faqs={page.faqs} />
      </ChunkSection>

      <ChunkSection title="Related software pages" eyebrow="Next steps">
        <PageLinkGrid links={relatedLinks} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
