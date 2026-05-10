import Link from "next/link";
import ChunkySeoLayout, {
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/about";

export const metadata = buildPageMetadata({
  title: "About USATII",
  description:
    "USATII is a Rochester-based software and marketing systems company building in-house workflows for trade businesses.",
  path: PATH,
});

export default function AboutPage() {
  const schemas = buildStandardSchemas({
    path: PATH,
    title: "About USATII",
    description:
      "Rochester-based software and marketing systems company for trades.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "About", path: PATH },
    ],
    serviceType: "Custom Contractor Software Development",
    areaServed: ["Rochester, NY", "Monroe County, NY", "Western New York"],
  });

  return (
    <ChunkySeoLayout
      eyebrow="About"
      title="USATII Media"
      intro="USATII helps trade businesses replace software sprawl with custom in-house systems that improve speed, visibility, and control."
      proofPoints={[
        "Rochester-based build team",
        "Software + websites + marketing systems",
        "Founder-led technical and security credibility",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "Trades hub", href: "/trades" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Entity snapshot">
        <p>
          USATII Media is a Rochester-based software and marketing systems company.
          Our primary focus is building in-house operating systems for trade
          businesses.
        </p>
      </ChunkSection>

      <ChunkSection title="Explore">
        <PageLinkGrid
          links={[
            { label: "Founder page", href: "/about/vlad-usatii" },
            { label: "Security page", href: "/security" },
            { label: "Reviews", href: "/reviews" },
            { label: "Main trades hub", href: "/trades" },
          ]}
        />
      </ChunkSection>

      <ChunkSection title="Legacy founder profile">
        <p>
          The original founder profile is still available at
          {" "}
          <Link href="/vlad" className="underline decoration-amber-600 underline-offset-4">
            /vlad
          </Link>
          .
        </p>
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
