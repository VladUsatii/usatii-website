import { notFound } from "next/navigation";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  FaqCards,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  getMarketingPageBySlug,
  MARKETING_PAGE_DATA,
  TRADE_AUDIT_BOOKING_URL,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(MARKETING_PAGE_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getMarketingPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/marketing/${page.slug}`,
  });
}

export default async function MarketingDetailPage({ params }) {
  const { slug } = await params;
  const page = getMarketingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const schemas = buildStandardSchemas({
    path: `/marketing/${page.slug}`,
    title: page.title,
    description: page.description,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Marketing", path: "/marketing" },
      { name: page.title, path: `/marketing/${page.slug}` },
    ],
    faqs: page.faqs,
    serviceType: page.title,
    areaServed: ["Rochester, NY", "Monroe County, NY"],
  });

  return (
    <ChunkySeoLayout
      eyebrow={page.heroEyebrow}
      title={page.title}
      intro={page.heroIntro}
      proofPoints={page.proofPoints}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View software pages", href: "/software" }}
    >
      <SchemaScripts schemas={schemas} />

      {page.sections.map((section) => (
        <ChunkSection key={section.heading} title={section.heading}>
          <p>{section.body}</p>
          <BulletGrid items={section.bullets} />
        </ChunkSection>
      ))}

      <ChunkSection title="Frequently asked questions" eyebrow="FAQ">
        <FaqCards faqs={page.faqs} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
