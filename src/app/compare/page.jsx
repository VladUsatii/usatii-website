import ChunkySeoLayout, {
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { COMPARE_PAGE_DATA, TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/compare";

export const metadata = buildPageMetadata({
  title: "Custom Software Comparison Pages",
  description:
    "Fair custom software comparison pages for contractors: Jobber, Housecall Pro, ServiceTitan, Monday.com, HubSpot, generic CRMs, and build-vs-buy decisions.",
  path: PATH,
});

export default function CompareHubPage() {
  const links = COMPARE_PAGE_DATA.map((item) => ({
    label: item.title,
    href: `/compare/${item.slug}`,
  }));

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Custom Software Comparison Pages",
    description:
      "Comparison pages for contractor software decisions by USATII.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Compare", path: PATH },
    ],
    serviceType: "Contractor Software Comparison and Audit",
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Compare"
      title="Custom Software Comparison Pages for Contractors"
      intro="These pages keep a fair tone: SaaS is often right for generic processes. Custom software becomes the better fit when workflow complexity and subscription overlap increase."
      proofPoints={[
        "Balanced comparisons with practical tradeoffs",
        "No trashy competitor framing",
        "Clear decision framework for build vs buy",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View trades hub", href: "/trades" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Comparison Guides">
        <PageLinkGrid links={links} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
