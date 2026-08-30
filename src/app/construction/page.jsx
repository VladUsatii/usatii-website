import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { SITE_URL } from "@/lib/services-seo";

const PATH = "/construction";
const BOOK_URL = "https://cal.com/usatii/onboarding";

export const metadata = {
  title: { absolute: "Usatii for Construction | Operations Software and AI" },
  description:
    "Custom operating systems for construction companies: estimating, jobs, crews, materials, equipment, subcontractors, costs, documents, reporting, and controlled AI automation.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: "Usatii for Construction",
    description:
      "A connected operating layer for construction decisions, field execution, and back-office control.",
    url: `${SITE_URL}${PATH}`,
    siteName: "USATII MEDIA",
    type: "website",
  },
};

const systems = [
  ["Estimating", "Takeoff intake, bid records, scope review, historical pricing, and approval trails."],
  ["Project control", "Jobs, schedules, work orders, change control, daily logs, punch lists, and closeout."],
  ["Labor and field", "Crew assignments, time capture, field updates, blockers, photos, and supervisor review."],
  ["Materials", "Requests, purchasing, deliveries, inventory, job usage, shortages, and cost attribution."],
  ["Equipment", "Location, assignment, condition, utilization, maintenance, downtime, and service history."],
  ["Subcontractors", "Scope, compliance documents, insurance, invoices, releases, and performance records."],
  ["Finance", "Job costs, budget drift, purchase controls, billing blockers, margin exposure, and exports."],
  ["AI administration", "Search, classification, summaries, drafting, and risk flags with human review."],
];

const layers = [
  ["01", "Signals", "Calls, forms, email, plans, field updates, vendor documents, receipts, and photos."],
  ["02", "Operational records", "Clients, jobs, crews, materials, vendors, assets, tasks, costs, and documents."],
  ["03", "Controls", "Roles, permissions, approvals, audit logs, escalation rules, and required review."],
  ["04", "Decisions", "Assignments, alerts, forecasts, reports, client updates, and management views."],
];

const pilots = [
  {
    title: "Lead Intake & Telephony",
    body: "Connect routing, missed-call recovery, voicemail, AI-assisted summaries, and follow-up tasks to one client and opportunity record—so every inquiry has an owner and a next action.",
    href: "/software/custom-software-for-contractors",
    image: "/construction/lead-intake-telephony.webp",
    alt: "Construction operations coordinator handling a call beside project plans and a radio",
  },
  {
    title: "Field Execution",
    body: "Dispatch work orders, coordinate crews, capture daily logs and photo evidence, surface blockers, and give the office a current completion record without chasing field updates.",
    href: "/software/contractor-operating-system",
    image: "/construction/field-execution.webp",
    alt: "Field superintendent coordinating a steel installation with a rugged tablet",
  },
  {
    title: "Inventory & COGS",
    body: "Track materials from request and purchasing through receipt, storage, job issue, return, and reorder—then connect actual usage to job cost and margin exposure.",
    href: "/software/contractor-operating-system",
    image: "/construction/inventory-cogs.webp",
    alt: "Warehouse lead scanning construction materials in an organized inventory yard",
  },
  {
    title: "Modeling & Estimating",
    body: "Bring drawings, BIM geometry, takeoff inputs, scope assumptions, revisions, historical costs, and approval history into a reviewable preconstruction record before work reaches the field.",
    href: "/software/custom-software-for-contractors",
    image: "/construction/modeling-estimating.webp",
    alt: "Estimator and project engineer comparing a building model with printed construction plans",
  },
];

function TextLink({ href, children }) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition hover:text-violet-700"
    >
      {children}<ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

export default function ConstructionPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Construction Operations Software",
    provider: { "@type": "Organization", name: "USATII MEDIA", url: SITE_URL },
    areaServed: "United States",
    serviceType: "Custom construction operations software development",
    url: `${SITE_URL}${PATH}`,
  };

  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center lg:px-8 lg:pb-20 lg:pt-24">
          <p className="text-xs font-medium">Operations software</p>
          <h1 className="mt-5 text-5xl font-medium tracking-[-0.05em] sm:text-6xl">Usatii for Construction</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-neutral-600">
            A connected operating layer for every construction decision, from lead intake to call center infrastructure to scheduling to estimating to modeling to inventory to field execution.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
            <TextLink href={BOOK_URL}>Discuss a pilot</TextLink>
            <TextLink href="/quote-request">Send a scope or RFQ</TextLink>
          </div>
        </section>

        <section className="relative h-[72svh] min-h-[520px] w-full overflow-hidden bg-neutral-900">
          <Image
            src="/construction/construction-hero-ai.webp"
            alt="Aerial view of coordinated equipment and crews across a commercial construction site"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/5" />
          <p className="absolute bottom-8 left-6 max-w-xl text-2xl font-medium leading-tight tracking-[-0.03em] text-white sm:bottom-12 sm:left-10 sm:text-4xl lg:left-[max(2.5rem,calc((100vw-64rem)/2))]">
            Software should do all the repetitive, manual work so teams can focus on creativity, scale, and relationships.
          </p>
        </section>

        <section className="mx-auto grid max-w-4xl gap-12 px-6 py-28 md:grid-cols-[0.72fr_1.28fr] md:items-start lg:px-8">
          <div className="max-w-xs">
            <h2 className="text-2xl font-medium leading-tight tracking-[-0.03em]">Bring software intelligence to the physical world.</h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-neutral-600">
            <p>Construction businesses typically make calls from specific departments, then make appointments and schedule subcontractors/employees, order from vendors, refresh equipment, model and plan for job sites, collect and parse documents, make hundreds of random approvals, and reconcile financial records. That is a lot to put in one dashboard, but we did it anyways.</p>
            <p>We map every decision being made within each department, we build an ontology over the business, and build controlled workflows to automate around them. The result is a system that explains what is happening, who owns the next action, and what evidence supports decision-making.</p>
            <TextLink href="/software">How we build operating systems</TextLink>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24 text-center lg:px-8">
          <h2 className="text-2xl font-medium leading-tight tracking-[-0.03em] md:text-3xl">
            One operational model connects management, marketing, sales teams, installers, supervisors, suppliers, financers, and accountants.
          </h2>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-28 lg:px-8">
          <div className="border-y border-neutral-200">
            {layers.map(([number, title, body]) => (
              <article key={number} className="grid gap-4 border-b border-neutral-200 py-7 last:border-b-0 sm:grid-cols-[3rem_11rem_1fr] sm:items-start">
                <p className="text-xs tabular-nums text-neutral-400">{number}</p>
                <h3 className="text-base font-medium">{title}</h3>
                <p className="max-w-2xl text-sm leading-6 text-neutral-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-28 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[0.72fr_1.28fr] md:items-center">
            <div className="max-w-xs">
              <p className="text-xs text-neutral-400">Construction operations stack</p>
              <h2 className="mt-4 text-2xl font-medium leading-tight tracking-[-0.03em]">Start with the workflow that hurts. Expand only after it proves value.</h2>
              <p className="mt-5 text-sm leading-6 text-neutral-600">Every module shares the same records, permissions, activity history, and reporting model.</p>
            </div>
            <Image
              src="/construction/rebuildit-operations.webp"
              alt="Construction operations software interface built by USATII"
              width={1440}
              height={776}
              sizes="(min-width: 768px) 560px, calc(100vw - 3rem)"
              className="aspect-[8/5] rounded-sm border border-neutral-200 object-cover object-top"
            />
          </div>
          <div className="mt-16 grid border-t border-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
            {systems.map(([title, body], index) => (
              <article key={title} className={`border-b border-neutral-200 py-7 sm:min-h-56 ${index % 2 === 0 ? "sm:pr-7" : "sm:border-l sm:pl-7"} ${index % 4 > 1 ? "lg:border-l lg:pl-7" : ""}`}>
                <p className="text-xs tabular-nums text-neutral-400">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-7 text-lg font-medium tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24 text-center lg:px-8">
          <h2 className="text-2xl font-medium tracking-[-0.03em]">A practical first deployment</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-neutral-600">
            A focused pilot creates one working operational loop, real users, measurable acceptance criteria, and a clear decision about what to expand next.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-32 lg:px-8">
          <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {pilots.map((pilot) => (
              <article key={pilot.title}>
                <Image
                  src={pilot.image}
                  alt={pilot.alt}
                  width={900}
                  height={900}
                  sizes="(min-width: 1024px) 272px, (min-width: 640px) calc(50vw - 2.25rem), calc(100vw - 3rem)"
                  loading="lazy"
                  className="aspect-square rounded-sm object-cover"
                />
                <h3 className="mt-4 text-base font-medium leading-snug tracking-[-0.015em]">{pilot.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{pilot.body}</p>
                <div className="mt-4"><TextLink href={pilot.href}>Explore the system</TextLink></div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
            <p className="text-xs font-medium">Start with one operational bottleneck</p>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-medium tracking-[-0.04em] sm:text-5xl">Build a system your construction business can actually own.</h2>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-6 text-neutral-600">Bring the workflow, the records, and the people who use them. We will define a focused pilot and its acceptance criteria.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
              <TextLink href={BOOK_URL}>Book a working session</TextLink>
              <TextLink href="/quote-request">Send project details</TextLink>
              <TextLink href="/case-studies/rebuildit-inc">View REBUILDIT INC. case study</TextLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
