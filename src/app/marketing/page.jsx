import ChunkySeoLayout, {
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { MARKETING_PAGE_DATA, TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/marketing";

export const metadata = buildPageMetadata({
  title: "Contractor Marketing Systems",
  description:
    "Contractor marketing systems by USATII in Rochester, NY. Content and ads integrated with workflow-aware lead follow-up.",
  path: PATH,
});

export default function MarketingHubPage() {
  const links = Object.values(MARKETING_PAGE_DATA).map((page) => ({
    label: page.title,
    href: `/marketing/${page.slug}`,
  }));

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Contractor Marketing Systems",
    description:
      "Marketing systems for contractors by USATII in Rochester, NY.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Marketing", path: PATH },
    ],
    serviceType: "Contractor Marketing Systems",
    areaServed: ["Rochester, NY", "Monroe County, NY"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Marketing"
      title="Contractor Marketing Systems for Local Lead Generation"
      intro="USATII uses content and paid campaigns as proof and as fuel for your operating system. The goal is closed-loop growth, not vanity metrics."
      proofPoints={[
        "Secondary proof layer for software credibility",
        "Local lead generation aligned to workflow capacity",
        "Follow-up automations tied to real pipeline stages",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View software pages", href: "/software" }}
    >
      <SchemaScripts schemas={schemas} />
      <ChunkSection title="Marketing pages">
        <PageLinkGrid links={links} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
