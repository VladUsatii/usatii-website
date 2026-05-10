import ChunkySeoLayout, {
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { RESOURCE_PAGE_DATA, TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/resources";

export const metadata = buildPageMetadata({
  title: "Contractor Software Resources",
  description:
    "Contractor software resources from USATII: calculator tools, checklists, dashboard guides, and workflow automation guides.",
  path: PATH,
});

export default function ResourcesHubPage() {
  const links = RESOURCE_PAGE_DATA.map((item) => ({
    label: item.title,
    href: `/resources/${item.slug}`,
  }));

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Contractor Software Resources",
    description:
      "People-first resources and calculators for contractor software planning.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Resources", path: PATH },
    ],
    serviceType: "Contractor Software Education",
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
    includeArticle: true,
  });

  return (
    <ChunkySeoLayout
      eyebrow="Resources"
      title="Contractor Software Resources and Guides"
      intro="Use these calculators, checklists, and practical guides to evaluate software spend, workflow bottlenecks, and implementation priorities."
      proofPoints={[
        "Calculator and checklist lead magnets",
        "Workflow guides tied to operational outcomes",
        "Practical decision frameworks for owners and operators",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View compare pages", href: "/compare" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Guides and Tools">
        <PageLinkGrid links={links} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
