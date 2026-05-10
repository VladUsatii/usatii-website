import { notFound } from "next/navigation";
import Link from "next/link";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  FaqCards,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  getIndustryPageBySlug,
  INDUSTRY_PAGE_DATA,
  TRADE_AUDIT_BOOKING_URL,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRY_PAGE_DATA.map((industry) => ({ industry: industry.slug }));
}

export async function generateMetadata({ params }) {
  const { industry } = await params;
  const page = getIndustryPageBySlug(industry);

  if (!page) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: page.title,
    description: `${page.title}. ${page.opening}`,
    path: `/industries/${page.slug}`,
  });
}

export default async function IndustryDetailPage({ params }) {
  const { industry } = await params;
  const page = getIndustryPageBySlug(industry);

  if (!page) {
    notFound();
  }

  const auditFaq = {
    q: "How do we start without replacing everything at once?",
    a: "We start with a software waste audit, prioritize the highest-friction workflow, then phase improvements so your team can adopt changes without disruption.",
  };
  const faqs = [...page.faqs, auditFaq];

  const schemas = buildStandardSchemas({
    path: `/industries/${page.slug}`,
    title: page.title,
    description: page.opening,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Industries", path: "/industries" },
      { name: page.trade, path: `/industries/${page.slug}` },
    ],
    faqs,
    serviceType: page.title,
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Industry Guide"
      title={page.title}
      intro={page.opening}
      proofPoints={[
        `${page.trade}-specific workflow design`,
        "Software consolidation based on operational fit",
        "Audit-first implementation roadmap",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View all industries", href: "/industries" }}
      sidebar={
        <div className="rounded-xl border border-[#e4e7f2] bg-white p-5 shadow-[0_12px_30px_rgba(74,58,255,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d4dff]">
            Free audit CTA
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5a6178]">
            Most teams discover wasted spend and workflow overlap before they need a
            full rebuild.
          </p>
          <Link
            href="/software/software-waste-audit"
            className="mt-4 inline-flex rounded-md border border-[#d7d9e6] bg-[#f5f3ff] px-4 py-2 text-sm font-semibold text-[#5b3fd0] transition hover:border-[#b9a8ff] hover:text-[#4c33b8]"
          >
            Go to audit page
          </Link>
        </div>
      }
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="1. Common workflow problems">
        <BulletGrid items={page.commonProblems} />
      </ChunkSection>

      <ChunkSection title="2. Tools this may replace or consolidate">
        <BulletGrid items={page.replaceOrConsolidate} />
      </ChunkSection>

      <ChunkSection title="3. What USATII can build">
        <BulletGrid items={page.whatWeBuild} />
      </ChunkSection>

      <ChunkSection title="4. Example workflows">
        <BulletGrid items={page.workflows} />
      </ChunkSection>

      <ChunkSection title="5. Website + lead intake integration">
        <p>{page.websiteIntegration}</p>
      </ChunkSection>

      <ChunkSection title="6. Reporting dashboard">
        <p>{page.reportingDashboard}</p>
      </ChunkSection>

      <ChunkSection title="7. Security, permissions, and audit logs">
        <p>{page.securityNotes}</p>
      </ChunkSection>

      <ChunkSection title="8. Free software waste audit CTA">
        <p>
          Start with the free software waste audit to map where your current tools
          create overlap, missed handoffs, and reporting blind spots.
        </p>
        <Link
          href="/software/software-waste-audit"
          className="inline-flex rounded-md border border-[#b8abff] bg-[#eee9ff] px-5 py-3 text-sm font-semibold text-[#4d34b8] transition hover:bg-[#e6deff]"
        >
          Book a free software waste audit
        </Link>
      </ChunkSection>

      <ChunkSection title="9. FAQ">
        <FaqCards faqs={faqs} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
