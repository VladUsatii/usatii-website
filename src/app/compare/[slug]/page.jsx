import { notFound } from "next/navigation";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  COMPARE_CORE_SECTIONS,
  COMPARE_PAGE_DATA,
  getComparePageBySlug,
  TRADE_AUDIT_BOOKING_URL,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARE_PAGE_DATA.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getComparePageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/compare/${page.slug}`,
  });
}

export default async function CompareDetailPage({ params }) {
  const { slug } = await params;
  const page = getComparePageBySlug(slug);

  if (!page) {
    notFound();
  }

  const fairFaqs = [
    {
      q: `Is ${page.comparedTool} always a bad choice?`,
      a: `No. ${page.comparedTool} can be a strong option when your workflow is standard and you need fast implementation with minimal customization.`,
    },
    {
      q: "When should a contractor consider custom software?",
      a: "Custom is usually worth evaluating when subscription overlap is high, process requirements are specific, and operational drag is increasing as the team scales.",
    },
    {
      q: "Can we keep some SaaS tools and still go custom?",
      a: "Yes. Hybrid architecture is common. We typically keep strong payment, accounting, or compliance tools and replace workflow overlap around them.",
    },
  ];

  const schemas = buildStandardSchemas({
    path: `/compare/${page.slug}`,
    title: page.title,
    description: page.description,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Compare", path: "/compare" },
      { name: page.title, path: `/compare/${page.slug}` },
    ],
    faqs: fairFaqs,
    serviceType: page.title,
    areaServed: ["Rochester, NY", "Monroe County, NY"],
    includeArticle: true,
  });

  return (
    <ChunkySeoLayout
      eyebrow="Comparison"
      title={page.title}
      intro={page.description}
      proofPoints={[
        "Fair tradeoff analysis",
        "SaaS when process is generic",
        "Custom when workflow specificity and scaling complexity increase",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View all comparisons", href: "/compare" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Core decision rule">
        <p>{COMPARE_CORE_SECTIONS.fairRule}</p>
      </ChunkSection>

      <ChunkSection title={`When ${page.comparedTool} is a strong fit`}>
        <BulletGrid items={COMPARE_CORE_SECTIONS.whenToolWins} />
      </ChunkSection>

      <ChunkSection title="When custom software is a stronger fit">
        <BulletGrid items={COMPARE_CORE_SECTIONS.whenCustomWins} />
      </ChunkSection>

      <ChunkSection title="How to decide in practice">
        <BulletGrid
          items={[
            "Quantify annual spend and workflow overlap",
            "Map where handoffs create delays or rework",
            "Score each tool by adoption and business criticality",
            "Phase replacement starting with the highest-friction workflow",
          ]}
        />
      </ChunkSection>

      <ChunkSection title="FAQ">
        <div className="space-y-3">
          {fairFaqs.map((faq) => (
            <article
              key={faq.q}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-4"
            >
              <h3 className="text-lg font-semibold text-neutral-900">{faq.q}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{faq.a}</p>
            </article>
          ))}
        </div>
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
