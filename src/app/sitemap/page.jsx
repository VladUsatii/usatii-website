import ChunkySeoLayout, {
  ChunkSection,
  PageLinkGrid,
  SchemaScripts,
} from "@/app/_components/trades/chunky-seo-layout";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";
import { getCanonicalSitemapPaths } from "@/lib/sitemap-data";

const PATH = "/sitemap";

export const metadata = buildPageMetadata({
  title: "Sitemap",
  description:
    "Canonical sitemap for USATII pages including services, industries, locations, comparison pages, resources, about, security, reviews, and posts.",
  path: PATH,
});

function titleFromPath(path) {
  if (path === "/") return "Homepage";
  return path
    .replaceAll("/", " ")
    .trim()
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toLinks(paths) {
  return paths.map((path) => ({
    label: titleFromPath(path),
    href: path,
  }));
}

export default async function SitemapPage() {
  const paths = await getCanonicalSitemapPaths();

  const corePages = [
    "/",
    "/services",
    "/industries",
    "/locations",
    "/compare",
    "/resources",
    "/reviews",
    "/about",
    "/about/vlad-usatii",
    "/security",
    "/case-studies",
    "/sitemap",
  ].filter((path) => paths.includes(path));

  const servicePages = paths.filter((path) => /^\/services\/[^/]+$/.test(path));
  const serviceLocationPages = paths.filter((path) =>
    /^\/services\/[^/]+\/[^/]+$/.test(path),
  );
  const industryPages = paths.filter((path) => /^\/industries\/[^/]+$/.test(path));
  const locationPages = paths.filter((path) => /^\/locations\/[^/]+$/.test(path));
  const comparisonPages = paths.filter((path) => /^\/compare\/[^/]+$/.test(path));
  const resourcePages = paths.filter((path) => /^\/resources\/[^/]+$/.test(path));
  const posts = paths.filter((path) => /^\/case-studies\/[^/]+$/.test(path));

  const used = new Set([
    ...corePages,
    ...servicePages,
    ...serviceLocationPages,
    ...industryPages,
    ...locationPages,
    ...comparisonPages,
    ...resourcePages,
    ...posts,
  ]);
  const additionalCanonicalPages = paths.filter((path) => !used.has(path));

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Sitemap",
    description:
      "Canonical sitemap of USATII pages for services, industries, locations, comparisons, resources, and posts.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Sitemap", path: PATH },
    ],
    includeArticle: true,
  });

  return (
    <ChunkySeoLayout
      eyebrow="Sitemap"
      title="Site Map"
      intro="This page lists the canonical URLs for USATII SEO pages, including service hubs, subpages, location coverage, comparison content, resources, and posts."
      proofPoints={[
        `${paths.length} canonical URLs currently published`,
        "Service pages and service-location pages included",
        "Industry, location, comparison, resource, and post pages included",
      ]}
      primaryCta={{ label: "Browse services", href: "/services" }}
      secondaryCta={{ label: "Back to homepage", href: "/" }}
      showRecentWork={false}
    >
      <SchemaScripts schemas={schemas} />

      <ChunkSection title="Core Pages">
        <PageLinkGrid links={toLinks(corePages)} />
      </ChunkSection>

      <ChunkSection title="Services">
        <PageLinkGrid links={toLinks(servicePages)} />
      </ChunkSection>

      <ChunkSection title="Service Location Subpages">
        <PageLinkGrid links={toLinks(serviceLocationPages)} />
      </ChunkSection>

      <ChunkSection title="Industries">
        <PageLinkGrid links={toLinks(industryPages)} />
      </ChunkSection>

      <ChunkSection title="Locations">
        <PageLinkGrid links={toLinks(locationPages)} />
      </ChunkSection>

      <ChunkSection title="Comparison Pages">
        <PageLinkGrid links={toLinks(comparisonPages)} />
      </ChunkSection>

      <ChunkSection title="Resources">
        <PageLinkGrid links={toLinks(resourcePages)} />
      </ChunkSection>

      <ChunkSection title="Posts">
        <PageLinkGrid links={toLinks(posts)} />
      </ChunkSection>

      {additionalCanonicalPages.length > 0 ? (
        <ChunkSection title="Additional Canonical Pages">
          <PageLinkGrid links={toLinks(additionalCanonicalPages)} />
        </ChunkSection>
      ) : null}
    </ChunkySeoLayout>
  );
}
