import ChunkySeoLayout, {
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { TRADE_AUDIT_BOOKING_URL, WEBSITE_PAGE_DATA } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/websites";

export const metadata = buildPageMetadata({
  title: "Contractor Website Systems",
  description:
    "Website systems for contractors by USATII. Conversion-first pages connected directly to software workflows.",
  path: PATH,
});

export default function WebsitesHubPage() {
  const links = Object.values(WEBSITE_PAGE_DATA).map((page) => ({
    label: page.title,
    href: `/websites/${page.slug}`,
  }));

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Contractor Website Systems",
    description:
      "Contractor website design services by USATII in Rochester, NY.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Websites", path: PATH },
    ],
    serviceType: "Contractor Website Design",
    areaServed: ["Rochester, NY", "Monroe County, NY"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Websites"
      title="Contractor Websites That Turn Leads Into Jobs"
      intro="Our contractor websites are built as operational assets: structured for local SEO, conversion, and workflow handoff."
      proofPoints={[
        "Lead-intake forms mapped to CRM workflow",
        "Service-area and trade-intent architecture",
        "Marketing and operations signal in one system",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "Trades hub", href: "/trades" }}
      showRecentWork
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Website service pages">
        <PageLinkGrid links={links} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
