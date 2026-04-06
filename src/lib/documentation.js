import "server-only";
import path from "node:path";
import { promises as fs } from "node:fs";

const DOCUMENTATION_DIR = path.join(process.cwd(), "public", "documentation");

const DOC_METADATA = {
  "02-client-onboarding-workflow.pdf": {
    title: "Client Onboarding Workflow",
    summary:
      "The onboarding sequence we use to start quickly while reducing operational friction.",
    purpose:
      "Use this to understand kickoff requirements, handoff timing, and what each side must provide.",
    highlights: [
      "Intake structure and scope lock process",
      "Asset collection and communication cadence",
      "Approval path before content production starts",
    ],
  },
};

function titleFromFileName(fileName) {
  return fileName
    .replace(/\.pdf$/i, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function fallbackMeta(fileName) {
  const title = titleFromFileName(fileName);

  return {
    title,
    summary: `Reference document for ${title}.`,
    purpose:
      "Use this as implementation documentation and operational guidance.",
    highlights: [
      "Core concepts and operating context",
      "Implementation notes and constraints",
      "Execution expectations and next actions",
    ],
  };
}

export async function getDocumentationPdfs() {
  let entries = [];

  try {
    entries = await fs.readdir(DOCUMENTATION_DIR, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  const files = entries
    .filter((entry) => entry.isFile() && /\.pdf$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  return files.map((fileName, index) => {
    const meta = DOC_METADATA[fileName] || fallbackMeta(fileName);

    return {
      id: fileName,
      index: index + 1,
      fileName,
      url: `/documentation/${encodeURIComponent(fileName)}`,
      title: meta.title,
      summary: meta.summary,
      purpose: meta.purpose,
      highlights: meta.highlights,
    };
  });
}
