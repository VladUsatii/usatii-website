import { SITE_URL, getApprovedSitemapRoutes } from "@/lib/services-seo";
import { getAllTradeRoutes } from "@/lib/trades-seo-data";
import { getAllCaseStudySlugs } from "@/lib/case-studies";

export function getSitemapPriority(path) {
  if (path === "/") return 1;
  if (path === "/trades") return 0.95;
  if (path === "/software/software-waste-audit") return 0.95;
  if (path.startsWith("/software/")) return 0.9;
  if (path === "/services") return 0.92;
  if (path.startsWith("/services/")) return 0.88;
  if (path === "/case-studies") return 0.9;
  if (path.startsWith("/case-studies/")) return 0.85;
  if (path === "/sitemap") return 0.7;
  return 0.8;
}

export async function getCanonicalSitemapPaths() {
  const caseStudySlugs = await getAllCaseStudySlugs();
  const caseStudyRoutes = [
    "/case-studies",
    ...caseStudySlugs.map((slug) => `/case-studies/${slug}`),
  ];

  const routes = new Set([
    ...getApprovedSitemapRoutes(),
    ...getAllTradeRoutes(),
    ...caseStudyRoutes,
    "/sitemap",
  ]);

  return Array.from(routes).sort();
}

export async function getCanonicalSitemapEntries() {
  const now = new Date();
  const paths = await getCanonicalSitemapPaths();

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: getSitemapPriority(path),
  }));
}
