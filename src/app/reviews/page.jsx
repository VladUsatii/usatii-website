import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/reviews";

export const metadata = buildPageMetadata({
  title: "Client Reviews",
  description:
    "Client review highlights and feedback themes for USATII software and marketing systems engagements.",
  path: PATH,
});

export default function ReviewsPage() {
  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Client Reviews",
    description:
      "Review summary page for USATII client outcomes.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Reviews", path: PATH },
    ],
    serviceType: "Contractor Software and Marketing Systems",
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
    includeArticle: true,
  });

  return (
    <ChunkySeoLayout
      eyebrow="Reviews"
      title="What Clients Say About Working With USATII"
      intro="This page captures the review themes clients mention most often: technical execution, responsiveness, and practical system outcomes."
      proofPoints={[
        "Technical competence and workflow clarity",
        "Fast response and iteration",
        "Operational improvements, not just surface-level marketing",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "Read case studies", href: "/case-studies" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Common review themes">
        <BulletGrid
          items={[
            "Clear communication during implementation",
            "Strong technical execution quality",
            "Systems that save time and reduce tool confusion",
            "Direct founder involvement on strategy",
          ]}
        />
      </ChunkSection>

      <ChunkSection title="Why these reviews matter">
        <p>
          These reviews reflect the outcomes clients repeatedly mention: clear communication,
          reliable execution, and hands-on technical support throughout the engagement.
        </p>
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
