import ChunkySeoLayout, {
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { INDUSTRY_PAGE_DATA, TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/industries";

export const metadata = buildPageMetadata({
  title: "Trade Industry Software Pages",
  description:
    "Industry-specific contractor software guides for HVAC, plumbing, roofing, electrical, remodeling, landscaping, and more in Rochester, NY.",
  path: PATH,
});

export default function IndustriesHubPage() {
  const links = INDUSTRY_PAGE_DATA.map((industry) => ({
    label: industry.title,
    href: `/industries/${industry.slug}`,
  }));

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Trade Industry Software Pages",
    description:
      "Industry-specific contractor software systems for Rochester trade businesses.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Industries", path: PATH },
    ],
    serviceType: "Industry-Specific Contractor Software Development",
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Industry Pages"
      title="Industry-Specific Software Systems for Rochester Trades"
      intro="Explore trade-specific software guidance with workflow examples, keep-or-replace recommendations, and reporting priorities for each industry."
      proofPoints={[
        "Distinct workflow examples per trade",
        "Fair keep/replace/rebuild software guidance",
        "Audit-first CTA for every industry page",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "Trades hub", href: "/trades" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Industry Software Guides">
        <PageLinkGrid links={links} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
