// lib/case-studies.js
import "server-only";
import path from "node:path";
import { promises as fs } from "node:fs";
import matter from "gray-matter";

const CASE_STUDIES_DIR = path.join(process.cwd(), "public", "case-studies");

function slugFromFilename(filename) {
  return filename.replace(/\.(md|mdx)$/i, "");
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function toStringOrEmpty(value) {
  return typeof value === "string" ? value : "";
}

function toStringOrNull(value) {
  const str = toStringOrEmpty(value).trim();
  return str || null;
}

function toArrayOfStrings(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getDateLabel(date) {
  if (!date) return null;

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function getCaseStudyFiles() {
  const entries = await fs.readdir(CASE_STUDIES_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

async function readCaseStudyFile(filename) {
  const fullPath = path.join(CASE_STUDIES_DIR, filename);
  const raw = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(raw);

  const slug = slugFromFilename(filename);

  return {
    slug,
    title: toStringOrEmpty(data.title).trim() || titleFromSlug(slug),
    excerpt: toStringOrEmpty(data.excerpt).trim(),
    readingTime: Number(data.readingTime) || estimateReadingTime(content),
    order: typeof data.order === "number" ? data.order : 9999,
    date: toStringOrNull(data.date),
    dateLabel: getDateLabel(data.date),
    client: toStringOrNull(data.client),
    sector: toStringOrNull(data.sector),
    cover: toStringOrNull(data.cover),
    tags: toArrayOfStrings(data.tags),
    content,
  };
}

export async function getAllCaseStudies() {
  const files = await getCaseStudyFiles();
  const studies = await Promise.all(files.map(readCaseStudyFile));

  return studies.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    if (a.date && b.date) return new Date(b.date) - new Date(a.date);
    return a.title.localeCompare(b.title);
  });
}

export async function getAllCaseStudySlugs() {
  const files = await getCaseStudyFiles();
  return files.map(slugFromFilename);
}

export async function getCaseStudyBySlug(slug) {
  const files = await getCaseStudyFiles();
  const filename = files.find((file) => slugFromFilename(file) === slug);

  if (!filename) return null;

  return readCaseStudyFile(filename);
}
