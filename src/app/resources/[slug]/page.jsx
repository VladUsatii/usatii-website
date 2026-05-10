import { notFound } from "next/navigation";
import Link from "next/link";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import SoftwareWasteCalculator from "@/app/_components/trades/software-waste-calculator";
import {
  getResourcePageBySlug,
  RESOURCE_GUIDE_SECTIONS,
  RESOURCE_PAGE_DATA,
  TRADE_AUDIT_BOOKING_URL,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return RESOURCE_PAGE_DATA.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getResourcePageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/resources/${page.slug}`,
  });
}

export default async function ResourceDetailPage({ params }) {
  const { slug } = await params;
  const page = getResourcePageBySlug(slug);

  if (!page) {
    notFound();
  }

  const sections = RESOURCE_GUIDE_SECTIONS[page.slug] ?? [
    {
      heading: "What this guide covers",
      bullets: [
        "How to evaluate the workflow in practical operating terms",
        "Where software overlap creates operational drag",
        "What to keep, replace, or rebuild first",
        "How to phase implementation with minimal disruption",
      ],
    },
    {
      heading: "Implementation checklist",
      bullets: [
        "Define owner and success metric for each workflow",
        "Document current handoff delays",
        "Pilot changes in one service lane first",
        "Review data quality and adoption weekly",
      ],
    },
  ];

  const faq = [
    {
      q: "Can this resource be used before booking a call?",
      a: "Yes. These pages are designed to help you self-assess and prepare decisions before an audit session.",
    },
    {
      q: "Do we need custom software for every workflow?",
      a: "No. Keep strong tools that already work and only replace systems creating cost overlap or operational drag.",
    },
  ];

  const schemas = buildStandardSchemas({
    path: `/resources/${page.slug}`,
    title: page.title,
    description: page.description,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Resources", path: "/resources" },
      { name: page.title, path: `/resources/${page.slug}` },
    ],
    faqs: page.type === "calculator" ? undefined : faq,
    serviceType: page.title,
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
    includeArticle: true,
  });

  return (
    <ChunkySeoLayout
      eyebrow="Resource"
      title={page.title}
      intro={page.description}
      proofPoints={[
        "Structured for people-first clarity",
        "Entity-rich content for search understanding",
        "Actionable next steps for operators",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View all resources", href: "/resources" }}
    >
      <SchemaScripts schemas={schemas} />

      {page.type === "calculator" ? (
        <ChunkSection title="Interactive calculator">
          <SoftwareWasteCalculator />
        </ChunkSection>
      ) : null}

      {sections.map((section) => (
        <ChunkSection key={section.heading} title={section.heading}>
          <BulletGrid items={section.bullets} />
        </ChunkSection>
      ))}

      <ChunkSection title="Next step">
        <p>
          Use this resource as a baseline, then run a free software waste audit to
          prioritize exactly what to keep, replace, and rebuild.
        </p>
        <Link
          href="/software/software-waste-audit"
          className="inline-flex rounded-md border border-[#b8abff] bg-[#eee9ff] px-5 py-3 text-sm font-semibold text-[#4d34b8] transition hover:bg-[#e6deff]"
        >
          Start free software waste audit
        </Link>
      </ChunkSection>

      {page.type === "calculator" ? null : (
        <ChunkSection title="FAQ">
          <div className="space-y-3">
            {faq.map((item) => (
              <article
                key={item.q}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-4"
              >
                <h3 className="text-lg font-semibold text-neutral-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.a}</p>
              </article>
            ))}
          </div>
        </ChunkSection>
      )}
    </ChunkySeoLayout>
  );
}
