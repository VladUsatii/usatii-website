import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getCanonicalSitemapPaths } from "./sitemap-data";
import { getAllCaseStudies } from "./case-studies";
import { SOFTWARE_PAGE_DATA, INDUSTRY_PAGE_DATA, LOCATION_PAGE_DATA, COMPARE_PAGE_DATA, RESOURCE_PAGE_DATA } from "./trades-seo-data";
import { SERVICES } from "./services-seo";
import { events } from "./events";

const friendly = (slug) => slug.split("-").map(word => word[0]?.toUpperCase() + word.slice(1)).join(" ");
const containsWord = (text, token) => text.split(" ").some(word => word === token || (token.length > 4 && word.startsWith(token)));
const normalize = (text) => text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const overrides = {
  "/": { title: "USATII", description: "Intelligent software everywhere you work. Custom software, communications, construction, emergency management, and AI integration." },
  "/construction": { title: "Construction management software", image: "/construction/rebuildit-operations.webp" },
  "/emergency-management": { title: "DART emergency management software", image: "/emergency-management/emergency-response-hero.webp" },
  "/advertising": { title: "Marketing & communications", description: "Social media, advertising, analytics, and OASIS communications software." },
  "/case-studies/rebuildit-inc": { title: "REBUILDIT INC. case study", image: "/construction/rebuildit-operations.webp" },
  "/careers": { title: "Careers at USATII", description: "Explore jobs, open roles, and opportunities to build software at USATII." },
};
let cachedIndex;
async function buildIndex() {
  const [paths, studies] = await Promise.all([getCanonicalSitemapPaths(), getAllCaseStudies()]);
  const dynamic = new Map();
  for (const [prefix, entries] of [["software", Object.values(SOFTWARE_PAGE_DATA)], ["industries", INDUSTRY_PAGE_DATA], ["locations", LOCATION_PAGE_DATA], ["compare", COMPARE_PAGE_DATA], ["resources", RESOURCE_PAGE_DATA]]) {
    for (const entry of entries) dynamic.set(`/${prefix}/${entry.slug}`, entry);
  }
  for (const study of studies) dynamic.set(`/case-studies/${study.slug}`, { ...study, image: study.cover, description: study.summary || study.excerpt, body: study.content });
  for (const event of events) dynamic.set(`/events/${event.slug}`, { ...event, description: event.description || event.location });
  return Promise.all(Array.from(new Set([...paths, "/careers", "/contact", "/quote-request", "/documentation", "/ai", "/about/vlad-usatii", "/privacy", "/referral"])).filter(href => href !== "/sitemap" && href !== "/trades" && !href.includes("privacy-choices")).map(async href => {
    let source = "";
    const directory = path.join(process.cwd(), "src", "app", href);
    for (const extension of ["jsx", "js"]) {
      try { source = await fs.readFile(path.join(directory, `page.${extension}`), "utf8"); break; } catch (error) { if (error.code !== "ENOENT") throw error; }
    }
    const literal = (key) => source.match(new RegExp(`(?:const ${key}\\s*=|${key}:)\\s*(?:\\{\\s*absolute:\\s*)?["']([^"']+)["']`))?.[1];
    const entry = dynamic.get(href) || {};
    const parts = href.split("/").filter(Boolean);
    const service = parts[0] === "services" ? SERVICES[parts[1]] : null;
    const title = overrides[href]?.title || entry.title || literal("title") || (service ? `${service.name}${parts[2] ? ` in ${friendly(parts[2])}` : ""}` : friendly(parts.at(-1) || "USATII"));
    const description = overrides[href]?.description || entry.description || literal("description") || service?.heroPromise || source.match(/<p(?:\s[^>]*)?>([^<{]+)<\/p>/)?.[1] || `Explore ${title} at USATII.`;
    const body = entry.body || JSON.stringify(entry) + " " + [...source.matchAll(/<(?:p|h[1-6]|li)(?:\s[^>]*)?>([^<{]+)<\/(?:p|h[1-6]|li)>/g)].map(match => match[1]).join(" ");
    const image = overrides[href]?.image || entry.image || literal("image") || source.match(/image:\s*["']([^"']+\.(?:webp|png|jpe?g))["']/)?.[1];
    const date = entry.date || literal("datePublished");
    const category = href.startsWith("/news/") ? "News" : href.startsWith("/vlad-usatii/") ? "Blog" : href.startsWith("/case-studies/") ? "Case study" : href.startsWith("/events/") ? "Event" : "Page";
    return { href, title, description, image: image?.startsWith("/") ? image : null, date, category, searchable: normalize(`${title} ${description} ${body} ${href}`) };
  }));
}
export async function searchSite(query) {
  cachedIndex ||= buildIndex().catch(error => { cachedIndex = undefined; throw error; });
  const index = await cachedIndex;
  const clean = normalize(query);
  const ignored = new Set(["what", "is", "the", "a", "an", "about", "for", "how", "can", "i", "do", "does", "usatii", "me", "tell", "and", "of", "to"]);
  const tokens = clean.split(" ").filter(token => token && !ignored.has(token));
  if (!tokens.length) return [];
  return index.map(entry => {
    const title = normalize(entry.title), description = normalize(entry.description);
    const matches = tokens.filter(token => containsWord(entry.searchable, token));
    const score = matches.reduce((total, token) => total + (containsWord(title, token) ? 10 : containsWord(description, token) ? 5 : 1), 0) + (title.includes(clean) ? 20 : 0) + (matches.length === tokens.length ? 10 : 0);
    return { entry, score: matches.length ? score : 0 };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)).slice(0, 30).map(({ entry: { searchable, ...entry } }) => entry);
}
