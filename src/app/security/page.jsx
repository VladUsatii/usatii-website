import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/security";

export const metadata = buildPageMetadata({
  title: "Security",
  description:
    "Security posture and implementation approach for USATII contractor software systems.",
  path: PATH,
});

export default function SecurityPage() {
  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Security",
    description:
      "Security baseline for USATII contractor software systems.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Security", path: PATH },
    ],
    serviceType: "Software Security for Small Businesses",
    areaServed: ["Rochester, NY", "Monroe County, NY"],
    includeArticle: true,
  });

  return (
    <ChunkySeoLayout
      eyebrow="Security"
      title="Software Security for Trade Operations"
      intro="USATII builds systems with permission controls, audit logging, and practical operational safeguards for small and mid-size trade businesses."
      proofPoints={[
        "Role-based access and least-privilege defaults",
        "Audit logs for workflow and billing changes",
        "Clear ownership of operational data",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "Security resource guide", href: "/resources/software-security-for-small-businesses" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Security baseline">
        <BulletGrid
          items={[
            "Role-based permissions by office, field, and admin responsibilities",
            "Audit logs for estimate, schedule, and invoice state changes",
            "Authentication controls for sensitive actions",
            "Backup and recovery planning for critical workflow data",
          ]}
        />
      </ChunkSection>

      <ChunkSection title="Operational controls">
        <BulletGrid
          items={[
            "Approval gates for financial or scope-changing actions",
            "Permission boundaries for client-facing and internal views",
            "Integration reviews for third-party tools",
            "Data export controls and monitoring",
          ]}
        />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
