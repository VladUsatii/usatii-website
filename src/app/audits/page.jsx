import Link from "next/link";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/audits";

export const metadata = buildPageMetadata({
  title: "Software Audits for Trade Businesses",
  description:
    "Audit pages from USATII focused on software waste detection, workflow overlap, and phased replacement planning for trade businesses.",
  path: PATH,
});

export default function AuditsHubPage() {
  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Software Audits for Trade Businesses",
    description:
      "Software audit services for trade businesses in Rochester, NY.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Audits", path: PATH },
    ],
    serviceType: "Software Waste Audit",
    areaServed: ["Rochester, NY", "Monroe County, NY"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Audits"
      title="Software Waste Audits for Trade Businesses"
      intro="Start with a software waste audit before committing to new tooling. We identify overlap, handoff failures, and high-friction workflows that need redesign."
      proofPoints={[
        "Keep/replace/rebuild recommendation map",
        "Workflow-first cost analysis",
        "Phased roadmap for adoption",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "View software waste audit", href: "/software/software-waste-audit" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="What the audit covers">
        <BulletGrid
          items={[
            "Lead intake and response process",
            "Estimate creation and approval handoffs",
            "Scheduling and dispatch workflow",
            "Job-tracking, invoicing, and follow-up flow",
            "Software overlap and annual spend",
          ]}
        />
      </ChunkSection>

      <ChunkSection title="Start with the software waste audit">
        <p>
          Start with
          {" "}
          <Link href="/software/software-waste-audit" className="underline decoration-amber-600 underline-offset-4">
            /software/software-waste-audit
          </Link>
          {" "}to identify software overlap, wasted spend, and workflow gaps before
          committing to tool changes.
        </p>
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
