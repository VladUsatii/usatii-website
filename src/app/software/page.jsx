import ChunkySeoLayout, {
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import {
  SOFTWARE_PAGE_DATA,
  TRADE_AUDIT_BOOKING_URL,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/software";

export const metadata = buildPageMetadata({
  title: "Contractor Software Systems",
  description:
    "Explore contractor software pages from USATII, including custom builds, software waste audits, operating systems, and subscription replacement strategies.",
  path: PATH,
});

export default function SoftwareHubPage() {
  const links = Object.values(SOFTWARE_PAGE_DATA).map((page) => ({
    label: page.title,
    href: `/software/${page.slug}`,
  }));

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Contractor Software Systems",
    description:
      "Custom contractor software services by USATII in Rochester, NY.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Software", path: PATH },
    ],
    serviceType: "Custom Contractor Software Development",
    areaServed: ["Rochester, NY", "Monroe County, NY"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="Software Hub"
      title="Custom Software Systems for Contractors"
      intro="USATII builds software around real trade workflows: lead intake, estimating, dispatch, job progress, invoicing, and follow-up."
      proofPoints={[
        "Built around your exact workflow",
        "Designed to reduce subscription overlap",
        "Connected to websites and lead systems",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "Trades hub", href: "/trades" }}
      sidebar={
        <div className="rounded-xl border border-[#e4e7f2] bg-white p-5 shadow-[0_12px_30px_rgba(74,58,255,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d4dff]">Start here</p>
          <p className="mt-2 text-sm leading-6 text-[#5a6178]">
            The software waste audit is the fastest way to identify what to keep,
            replace, or rebuild.
          </p>
        </div>
      }
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Core Software Services" eyebrow="Most Requested">
        <PageLinkGrid links={links} />
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
