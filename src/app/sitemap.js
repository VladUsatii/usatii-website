import { SITE_URL, getApprovedSitemapRoutes } from "@/lib/services-seo";

export default function sitemap() {
  const now = new Date();

  return getApprovedSitemapRoutes().map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path === "/services" ? 0.9 : 0.8,
  }));
}
