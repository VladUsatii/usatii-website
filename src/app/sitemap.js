import { SITE_URL, getApprovedSitemapRoutes } from "@/lib/services-seo";
import { getAllTradeRoutes } from "@/lib/trades-seo-data";

export default function sitemap() {
  const now = new Date();

  const routes = new Set([...getApprovedSitemapRoutes(), ...getAllTradeRoutes()]);

  return Array.from(routes).map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority:
      path === "/"
        ? 1
        : path === "/trades"
          ? 0.95
          : path === "/software/software-waste-audit"
            ? 0.95
            : path.startsWith("/software/")
              ? 0.9
              : 0.8,
  }));
}
