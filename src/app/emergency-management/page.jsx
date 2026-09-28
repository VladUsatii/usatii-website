import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import InteractiveResponseHero from "./_components/interactive-response-hero";
import { SITE_URL } from "@/lib/services-seo";

const PATH = "/emergency-management";
const BOOK_URL = "https://cal.com/usatii/onboarding";

export const metadata = {
  title: { absolute: "Usatii for Emergency Management | Response Operations Software" },
  description:
    "Custom emergency management software for workforce readiness, incident staffing, deployment, responder accountability, equipment, learning, reporting, and governed data operations.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: "Usatii for Emergency Management",
    description:
      "A governed operating environment for workforce readiness, incident response, deployment, equipment, learning, and reporting.",
    url: `${SITE_URL}${PATH}`,
    siteName: "USATII",
    type: "website",
  },
};

const systems = [
  ["Personnel foundation", "Canonical people, source identities, employment and position history, scoped access, corrections, and audit evidence."],
  ["Workforce readiness", "Task books, qualifications, training records, credentials, availability, evidence review, certification, and interval-based readiness."],
  ["Incident command", "Exercises and incidents, duty stations, staffing needs, teams, saved rule versions, and controlled lifecycle changes."],
  ["Deployment orders", "Candidate checks, draft and reviewed orders, acceptance, extensions, replacements, travel, check-in, and demobilization."],
  ["Responder accountability", "Daily checks, supervisor coverage, time away, missed-response escalation, private details, and location history."],
  ["Equipment accountability", "Issue, transfer, return, inspection, repair, loss review, retirement, custody history, and deployment-linked holds."],
  ["Learning and development", "Mentoring, development plans, course catalogs, enrollment, attendance, assessments, remediation, credit, and transcripts."],
  ["Operational reporting", "Private, reproducible reports for staffing, deployment status, daily checks, team readiness, credentials, training, and equipment."],
  ["Data stewardship", "Bounded correction batches, preview and undo, source reconciliation, immutable history, and explicit provenance."],
  ["Security and governance", "Effective-dated roles, organization and incident scope, stale-write protection, idempotent commands, private files, and policy records."],
];

const layers = [
  ["01", "Authoritative facts", "People, positions, qualifications, training, credentials, availability, equipment, locations, and source identifiers."],
  ["02", "Operational decisions", "Staffing requests, readiness checks, reviewed orders, assignments, custody, exceptions, and approvals."],
  ["03", "Field execution", "Travel, station activity, daily accountability, status changes, evidence, equipment movement, and demobilization."],
  ["04", "Governed evidence", "Immutable versions, policy references, decision history, audit events, private reports, and exportable records."],
];

const deploymentFlow = [
  ["Prepare", "Define personnel, position, qualification, training, credential, and availability facts."],
  ["Staff", "Create incident needs and teams, then compare candidates against current evidence and conflicts."],
  ["Approve", "Route deployment orders through independent review, acceptance, and versioned extensions."],
  ["Operate", "Track travel, duty stations, supervisors, daily replies, time away, equipment, and exceptions."],
  ["Close", "Reconcile end steps, equipment holds, checkout, evaluations, time records, and saved reports."],
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

export default function EmergencyManagementPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emergency Management Operations Software",
    provider: { "@type": "Organization", name: "USATII", url: SITE_URL },
    areaServed: "United States",
    serviceType: "Custom emergency management and deployment software development",
    url: `${SITE_URL}${PATH}`,
  };

  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

        <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center lg:px-8 lg:pb-20 lg:pt-24">
          <h1 className="text-5xl font-medium tracking-[-0.05em] sm:text-6xl">Usatii for Emergency Management</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600">
            A governed operating environment for workforce readiness, incident staffing, deployment, responder accountability, equipment, learning, and reporting.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
            <TextLink href={BOOK_URL}>Discuss a response system</TextLink>
            <TextLink href="/quote-request">Send requirements or an RFI</TextLink>
          </div>
        </section>

        <InteractiveResponseHero />

        <section className="mx-auto grid max-w-4xl gap-12 px-6 py-28 md:grid-cols-[0.72fr_1.28fr] md:items-start lg:px-8">
          <div className="max-w-xs"><h2 className="text-2xl font-medium leading-tight tracking-[-0.03em]">Build the operational record before the emergency.</h2></div>
          <div className="space-y-5 text-base leading-7 text-neutral-600">
            <p>Emergency response fails when personnel, qualification, availability, deployment, equipment, and reporting facts live in separate systems. Leaders are forced to make time-sensitive decisions from stale exports, disconnected messages, and manually reconciled spreadsheets.</p>
            <p>USATII has built a working deployment-management system around the full decision chain: establish authoritative workforce facts, explain readiness, staff an incident, review orders, account for responders and equipment in the field, preserve every material decision, and close with reproducible records.</p>
            <TextLink href="/resources">Explore the complete capability catalog</TextLink>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24 text-center lg:px-8">
          <h2 className="text-2xl font-medium leading-tight tracking-[-0.03em] md:text-3xl">Readiness is not a flag. It is an explained result based on current evidence, policy, dates, access, and operational conflicts.</h2>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-28 lg:px-8">
          <div className="border-y border-neutral-200">
            {layers.map(([number, title, body]) => <article key={number} className="grid gap-4 border-b border-neutral-200 py-7 last:border-b-0 sm:grid-cols-[3rem_12rem_1fr] sm:items-start"><p className="text-xs tabular-nums text-neutral-400">{number}</p><h3 className="text-base font-medium">{title}</h3><p className="max-w-2xl text-sm leading-6 text-neutral-600">{body}</p></article>)}
          </div>
        </section>

        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8 lg:py-28">
            <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr]">
              <div><h2 className="max-w-xs text-3xl font-medium tracking-[-0.04em]">One chain of custody for people, decisions, and evidence.</h2></div>
              <div className="border-t border-white/15">
                {deploymentFlow.map(([title, body], index) => <article key={title} className="grid gap-3 border-b border-white/15 py-6 sm:grid-cols-[2.5rem_7rem_1fr]"><p className="text-xs tabular-nums text-white/35">{String(index + 1).padStart(2, "0")}</p><h3 className="text-sm font-medium">{title}</h3><p className="text-sm leading-6 text-white/55">{body}</p></article>)}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-28 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[0.72fr_1.28fr] md:items-end">
            <div><h2 className="max-w-xs text-2xl font-medium leading-tight tracking-[-0.03em]">Deploy one operational lane. Expand across the mission.</h2></div>
            <p className="max-w-xl text-sm leading-6 text-neutral-600">Every module shares scoped identity, effective dates, record versions, policy references, audit history, and reporting boundaries. The result is a system that can explain not only what happened, but what facts and authority supported the decision.</p>
          </div>
          <div className="mt-16 grid border-t border-neutral-200 sm:grid-cols-2 lg:grid-cols-5">
            {systems.map(([title, body], index) => <article key={title} className={`border-b border-neutral-200 py-7 sm:min-h-64 ${index % 2 === 0 ? "sm:pr-7" : "sm:border-l sm:pl-7"} lg:border-l lg:px-5 ${index % 5 === 0 ? "lg:border-l-0 lg:pl-0" : ""}`}><p className="text-xs tabular-nums text-neutral-400">{String(index + 1).padStart(2, "0")}</p><h3 className="mt-7 text-base font-medium tracking-[-0.02em]">{title}</h3><p className="mt-3 text-sm leading-6 text-neutral-600">{body}</p></article>)}
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-neutral-50">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <div><ShieldCheck className="h-6 w-6" /><h2 className="mt-5 text-2xl font-medium tracking-[-0.03em]">Built with deployment reality in mind.</h2></div>
            <div className="grid gap-5 sm:grid-cols-2">
              {["Organization-, person-, incident-, and role-scoped access", "Immutable decision history and explicit record provenance", "Safe retries, stale-write checks, and bounded commands", "Responsive, keyboard-accessible operational workspaces", "Private reports with rule and source snapshots", "Clear separation between evidence, review, and authority"].map((item) => <div key={item} className="flex gap-3 border-t border-neutral-300 pt-4"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" /><p className="text-sm leading-6 text-neutral-700">{item}</p></div>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-28">
          <h2 className="mx-auto max-w-3xl text-3xl font-medium tracking-[-0.04em] sm:text-5xl">Build response infrastructure your organization can inspect, govern, and evolve.</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-neutral-600">Bring the mission workflow, governing rules, source systems, security boundary, and acceptance criteria. We will define a focused implementation path.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3"><TextLink href={BOOK_URL}>Book a working session</TextLink><TextLink href="/quote-request">Send project details</TextLink><TextLink href="/resources">View all capabilities</TextLink></div>
          <p className="mx-auto mt-12 max-w-2xl text-xs leading-5 text-neutral-400">The system described here is a working software build with synthetic test data. Production use requires customer-approved rules, integrations, infrastructure, security authorization, accessibility review, and operational acceptance. USATII is not claiming FEMA endorsement or production authorization.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
