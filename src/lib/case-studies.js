import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CASE_STUDIES_DIR = path.join(process.cwd(), "public", "case-studies");

function ensureDir() {
  if (!fs.existsSync(CASE_STUDIES_DIR)) {
    return [];
  }
  return fs.readdirSync(CASE_STUDIES_DIR);
}

function stripMarkdown(markdown = "") {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/[*_~#>-]/g, "")
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\$[^$]*\$/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function getExcerpt(content, manualExcerpt) {
  if (manualExcerpt) return manualExcerpt;

  const cleaned = stripMarkdown(content);
  if (!cleaned) return "";

  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned;
}

function getReadingTime(content = "") {
  const text = stripMarkdown(content);
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 220));
}

function normalizeStudy(slug, source) {
  const { data, content } = matter(source);
  const date = data.date ? new Date(data.date) : null;

  return {
    slug,
    title: data.title || slug,
    excerpt: getExcerpt(content, data.excerpt),
    date: data.date || null,
    dateLabel:
      date && !Number.isNaN(date.getTime())
        ? new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(date)
        : null,
    client: data.client || null,
    sector: data.sector || null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover: data.cover || null,
    featured: Boolean(data.featured),
    readingTime: getReadingTime(content),
    content,
  };
}

export function getAllCaseStudySlugs() {
  return ensureDir()
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllCaseStudies() {
  const files = ensureDir().filter((file) => file.endsWith(".md"));

  const studies = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(CASE_STUDIES_DIR, file);
    const source = fs.readFileSync(fullPath, "utf8");
    return normalizeStudy(slug, source);
  });

  return studies.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });
}

export function getCaseStudyBySlug(slug) {
  const fullPath = path.join(CASE_STUDIES_DIR, `${slug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const source = fs.readFileSync(fullPath, "utf8");
  return normalizeStudy(slug, source);
}