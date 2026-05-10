import Link from "next/link";
import ChunkySeoLayout, {
  BulletGrid,
  ChunkSection,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/about/vlad-usatii";

export const metadata = buildPageMetadata({
  title: "Vlad Usatii",
  description:
    "Founder profile for Vlad Usatii, founder of USATII Media, with software systems and security-oriented background.",
  path: PATH,
});

export default function FounderPage() {
  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Vlad Usatii",
    description:
      "Founder of USATII Media with a software systems and security-oriented background.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Vlad Usatii", path: PATH },
    ],
    includeFounder: true,
  });

  return (
    <ChunkySeoLayout
      eyebrow="Founder"
      title="Vlad Usatii"
      intro="Founder of USATII Media. Focused on building practical software systems for trade operations with a technical and security-aware approach."
      proofPoints={[
        "Founder-led strategy and architecture",
        "Background in software systems and security",
        "Connects marketing signal to operational decision-making",
      ]}
      primaryCta={{ label: "Book free software waste audit", href: TRADE_AUDIT_BOOKING_URL }}
      secondaryCta={{ label: "About USATII", href: "/about" }}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Credibility areas">
        <BulletGrid
          items={[
            "Software architecture for service operations",
            "Workflow optimization across lead-to-invoice lifecycle",
            "Security-conscious implementation and permissions",
            "Integration of acquisition systems with operational dashboards",
          ]}
        />
      </ChunkSection>

      <ChunkSection title="Profiles and references">
        <div className="space-y-2 text-sm text-[#4d556e]">
          <p>
            LinkedIn:{" "}
            <Link
              href="https://www.linkedin.com/in/vladusatii"
              target="_blank"
              className="underline decoration-[#6d4dff] underline-offset-4"
            >
              linkedin.com/in/vladusatii
            </Link>
          </p>
          <p>
            Existing long-form profile:{" "}
            <Link href="/vlad" className="underline decoration-[#6d4dff] underline-offset-4">
              /vlad
            </Link>
          </p>
        </div>
      </ChunkSection>
    </ChunkySeoLayout>
  );
}
