import "server-only";
import path from "node:path";
import { promises as fs } from "node:fs";

export const documentationPages = [
  {
    slug: "bootcamp",
    href: "/documentation",
    label: "Free pilot development bootcamp",
    title: "Free pilot development bootcamp",
    description: "How to prepare for Usatii’s free pilot development bootcamp: organizational roles, FDE discovery, pilot selection, data protection, and measurable business value.",
    sections: [
      ["who-is-the-bootcamp-for", "Who the bootcamp is for"],
      ["getting-started", "Getting started"],
      ["preparing-for-your-fde-assessment", "Preparing for the assessment"],
      ["bootcamp-overview", "The FDE process"],
      ["protecting-your-companys-information", "Protecting your information"],
      ["what-our-engineers-look-for", "What engineers look for"],
      ["selecting-the-first-pilot", "Selecting the first pilot"],
      ["pilot-charter", "Pilot Charter"],
    ],
  },
  { slug: "account-and-api-access", label: "Account & API access", title: "Account and API access", description: "Preparing account access, team participation, and a private API environment for a bootcamp.", draft: true },
  { slug: "customer-success-planning", label: "Customer success planning", title: "Customer success planning", description: "Define the baseline, success criteria, and responsibilities for a pilot.", draft: true },
  { slug: "zero-data-retention", label: "Zero data retention", title: "Zero data retention", description: "Model-provider retention settings and deployment-specific data handling.", draft: true },
  { slug: "production-implementation", label: "Production & expansion", title: "Production implementation and expansion", description: "Moving from an evaluated pilot to a scoped production implementation.", draft: true },
  { slug: "employee-adoption", label: "Employee adoption", title: "Organizational change and employee adoption", description: "Preparing employees to test, learn, and adopt the proposed software.", draft: true },
].map((page) => ({ ...page, href: page.href || `/documentation/${page.slug}` }));

export async function getDocumentationPage(slug) {
  const page = documentationPages.find((entry) => entry.slug === slug);
  if (!page) return null;
  const content = await fs.readFile(path.join(process.cwd(), "src/content/documentation", `${page.slug}.md`), "utf8");
  return { ...page, content };
}

export function documentationMetadata(page) {
  return {
    title: `${page.title} | Documentation`,
    description: page.description,
    alternates: { canonical: page.href },
    ...(page.draft ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      url: page.href,
      ...(page.slug === "bootcamp" ? { images: [{ url: "/documentation/bootcamp-session.webp", width: 1717, height: 989, alt: "A presenter speaking beside a whiteboard in a lecture room" }] } : {}),
    },
  };
}
