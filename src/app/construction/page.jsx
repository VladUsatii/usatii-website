import Link from "next/link";
import { GOOGLE_REVIEWS } from "@/lib/google-reviews";
import { SITE_URL } from "@/lib/services-seo";
import {
  ConstructionOperationsStack,
  ConstructionQuoteForm,
  ConstructionViewportEffects,
} from "./_components/construction-client";

const PATH = "/construction";
const BOOK_CALL_URL = "https://cal.com/usatii/onboarding";
const SCOPE_URL = "/quote-request";
const CAPABILITY_URL = "/documentation";
const HERO_VIDEO_SRC = "/media/usatii-media-banner-backdrop.d9f2e409.mp4";
const HERO_VIDEO_POSTER = "/media/usatii-media-banner-backdrop-poster.jpg";

export const metadata = {
  title: {
    absolute: "Construction Operations Software | USATII MEDIA",
  },
  description:
    "USATII builds custom operations software for construction companies, contractors, industrial service businesses, and field teams: calls, jobs, crews, materials, documents, costs, dashboards, and AI-assisted administration.",
  alternates: {
    canonical: `${SITE_URL}${PATH}`,
  },
  openGraph: {
    title: "Construction Operations Software | USATII MEDIA",
    description:
      "Custom operations software for construction companies, contractors, industrial service businesses, and field teams.",
    url: `${SITE_URL}${PATH}`,
    siteName: "USATII MEDIA",
    type: "website",
  },
};

const problemItems = [
  "Missed calls and weak intake",
  "Untracked materials and job costs",
  "Scattered vendor and contractor records",
  "Manual field updates",
  "Slow approvals",
  "Disconnected reporting",
  "Too many tools that do not talk to each other",
];

const operatingRows = [
  {
    label: "INPUTS",
    body: "Calls / Forms / Emails / Field Updates / Vendor Docs / Receipts",
  },
  {
    label: "CORE RECORDS",
    body: "Clients / Jobs / Work Orders / Crews / Materials / Vendors / Costs",
    active: true,
  },
  {
    label: "CONTROLS",
    body: "Roles / Permissions / Approvals / Audit Logs / Human Review",
  },
  {
    label: "OUTPUTS",
    body: "Dashboards / Reports / Notifications / Closeout Records / Management Views",
  },
];

const useCases = [
  [
    "Renovation and restoration companies",
    "Calls, clients, estimates, jobs, crews, materials, invoices, photos, and closeout records",
  ],
  [
    "General contractors",
    "Subcontractors, schedules, change orders, documents, approvals, job costs, and reporting",
  ],
  [
    "Specialty contractors",
    "Intake, dispatch, work orders, technicians, inventory, client communication, and repeat service",
  ],
  [
    "Industrial service businesses",
    "Assets, field work, parts, service records, vendors, approvals, and management reporting",
  ],
  [
    "Facilities and maintenance teams",
    "Requests, work orders, inspections, vendors, equipment, recurring tasks, and reports",
  ],
  [
    "Public works and housing operators",
    "Service requests, units, assets, crews, contractors, documents, board reports, and audit trails",
  ],
];

const rebuilditScope = [
  "PBX and call routing",
  "Internal operations dashboard",
  "Materials inventory",
  "Task tracking",
  "Employee productivity workflows",
  "Training records",
  "Administrative views",
  "Role-based workflows",
];

const rebuilditRecords = [
  "Jobs",
  "Clients",
  "Calls",
  "Staff",
  "Materials",
  "Assets",
  "Tasks",
  "Documents",
  "Payments",
  "Training records",
];

const pilots = [
  {
    title: "Missed call and intake pilot",
    body: "For businesses losing jobs, response time, or accountability through weak intake.",
    includes: [
      "Call routing map",
      "Intake queue",
      "Voicemail workflow",
      "Call tagging",
      "AI-assisted summaries",
      "Follow-up tasks",
      "Basic dashboard",
    ],
  },
  {
    title: "Job and work order pilot",
    body: "For teams that need better visibility from assignment to completion.",
    includes: [
      "Job records",
      "Work order flow",
      "Crew assignment",
      "Status updates",
      "Field notes/photos",
      "Completion workflow",
      "Overdue work report",
    ],
  },
  {
    title: "Materials and cost pilot",
    body: "For companies that need better control over materials, purchases, job costs, and margin leakage.",
    includes: [
      "Materials database",
      "Job-linked usage",
      "Purchase tracking",
      "Reorder visibility",
      "Cost categories",
      "Exportable reports",
    ],
  },
  {
    title: "Executive dashboard pilot",
    body: "For owners and managers who need operational truth without manual spreadsheet work.",
    includes: [
      "Data intake map",
      "Reporting schema",
      "Live dashboard",
      "Filters by job, owner, status, date, and cost",
      "Exportable report",
    ],
  },
];

const controls = [
  [
    "Role-based access",
    "Limit access by role, department, project, or workflow",
  ],
  [
    "Audit logs",
    "Track important changes by user, time, object, and action",
  ],
  [
    "Approval gates",
    "Require review for sensitive financial, administrative, or scope-changing actions",
  ],
  [
    "Client-owned records",
    "Keep operational data exportable and controlled by the client",
  ],
  ["Backup planning", "Plan recovery around critical workflow data"],
  [
    "AI review",
    "Keep AI summaries, classifications, and drafts subject to human review",
  ],
  [
    "Exportable reports",
    "Produce records for management, clients, compliance, or transition",
  ],
];

const testimonials = GOOGLE_REVIEWS.map((review, index) => ({
  index: String(index + 1).padStart(2, "0"),
  name: review.name,
  meta: review.meta,
  text: review.text,
}));

const constructionSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Construction Operations Software",
  provider: {
    "@type": "Organization",
    name: "USATII MEDIA",
    legalName: "VAU SOLUTIONS, LLC d/b/a USATII MEDIA",
    url: SITE_URL,
  },
  areaServed: "United States",
  serviceType: "Custom operations software development",
  url: `${SITE_URL}${PATH}`,
  description:
    "Custom internal operations software for construction companies, contractors, industrial service businesses, and field teams.",
};

function isExternalHref(href) {
  return href.startsWith("http");
}

function ActionLink({ href, children, variant = "primary", className = "" }) {
  const external = isExternalHref(href);
  const variantClass =
    variant === "primary"
      ? "border-[#6d4dff] bg-[#6d4dff] text-white hover:border-[#5638ea] hover:bg-[#5638ea]"
      : "border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#F5F5F5]";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`inline-flex min-h-11 items-center justify-center rounded-[2px] border px-5 py-3 text-sm font-semibold leading-none transition ${variantClass} ${className}`}
    >
      {children}
    </Link>
  );
}

function PageSection({ id, children, tone = "white" }) {
  return (
    <section
      id={id}
      className={`viewport-layer border-t border-[#DADADA] px-5 py-16 md:px-6 md:py-24 ${
        tone === "gray" ? "bg-[#F5F5F5]" : "bg-white"
      }`}
    >
      <div className="mx-auto w-full max-w-[1180px]">{children}</div>
    </section>
  );
}

function BrandLogo({ tone = "dark", size = "base" }) {
  const textColor = tone === "light" ? "text-white" : "text-[#0A0A0A]";
  const orbSize = size === "large" ? "h-9 w-9 md:h-12 md:w-12" : "h-6 w-6";
  const textSize = size === "large" ? "text-3xl md:text-5xl" : "text-xl";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 font-black italic tracking-tight ${textColor} ${textSize}`}
    >
      <span
        aria-hidden="true"
        className={`${orbSize} shrink-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.42),transparent_30%),linear-gradient(135deg,#db37ff_0%,#b91cff_42%,#8b16ef_100%)] shadow-[inset_0.25em_0.2em_0.45em_rgba(255,255,255,0.2),inset_-0.35em_-0.3em_0.6em_rgba(67,0,142,0.34),0_0.25em_0.7em_rgba(168,85,247,0.32)]`}
      />
      <span>USATII MEDIA</span>
    </Link>
  );
}

function SectionIntro({ title, children, narrow = false }) {
  return (
    <div className={narrow ? "max-w-[820px]" : "max-w-[960px]"}>
      <h2 className="text-[2rem] font-black leading-[1.04] tracking-normal text-[#0A0A0A] md:text-[2.75rem]">
        {title}
      </h2>
      {children ? (
        <div className="mt-6 space-y-5 text-[17px] leading-8 text-[#4A4A4A] md:text-[18px]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function OperatingDiagram() {
  return (
    <div className="mt-12 border border-[#DADADA] bg-white">
      {operatingRows.map((row) => (
        <div
          key={row.label}
          className={`grid gap-4 border-b border-[#DADADA] p-5 last:border-b-0 md:grid-cols-[220px_1fr] md:p-6 ${
            row.active ? "border-l-4 border-l-[#6d4dff]" : ""
          }`}
        >
          <div
            className={`font-mono text-xs font-bold tracking-[0.14em] ${
              row.active ? "text-[#6d4dff]" : "text-[#737373]"
            }`}
          >
            {row.label}
          </div>
          <div className="text-[17px] font-semibold leading-7 text-[#0A0A0A]">
            {row.body}
          </div>
        </div>
      ))}
    </div>
  );
}

function BorderList({ items }) {
  return (
    <ul className="border border-[#DADADA] bg-white">
      {items.map((item) => (
        <li
          key={item}
          className="border-b border-[#DADADA] px-4 py-3 text-sm font-semibold leading-6 text-[#0A0A0A] last:border-b-0"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="mt-10 overflow-x-auto border border-[#DADADA] bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#DADADA] bg-[#F5F5F5]">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-4 text-xs font-black uppercase tracking-[0.08em] text-[#0A0A0A]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([first, second]) => (
            <tr key={first} className="border-b border-[#DADADA] last:border-b-0">
              <td className="w-[34%] px-4 py-4 align-top text-sm font-bold leading-6 text-[#0A0A0A]">
                {first}
              </td>
              <td className="px-4 py-4 align-top text-sm leading-6 text-[#4A4A4A]">
                {second}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ConstructionPage() {
  return (
    <div className="construction-page bg-white font-sans text-[#0A0A0A]">
      <ConstructionViewportEffects />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(constructionSchema) }}
      />

      <main>
        <section
          id="hero"
          className="viewport-layer relative min-h-[100svh] overflow-hidden bg-[#0A0A0A] px-5 text-white md:px-6"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_VIDEO_POSTER}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/62" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.82))]" />

          <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1180px] flex-col">
            <header className="flex items-center justify-between border-b border-white/25 py-7 md:py-9">
              <BrandLogo tone="light" size="large" />
              <Link
                href={BOOK_CALL_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-[2px] border border-white/70 px-4 py-3 text-sm font-black text-white transition hover:border-white hover:bg-white hover:text-[#0A0A0A] md:px-6"
              >
                Start Pilot
              </Link>
            </header>

            <div className="flex flex-1 items-end py-16 md:py-20">
              <div className="max-w-[980px]">
                <h1 className="text-[2.85rem] font-black leading-[0.98] tracking-normal text-white md:text-[4.75rem] lg:text-[7rem]">
                Usatii for Construction
                </h1>
                <div className="mt-8 max-w-[830px] space-y-5 text-[18px] leading-8 text-white/86 md:text-[19px]">
                  <h3 className="text-[1.5rem] font-black leading-[0.98] tracking-normal text-white/80 md:text-[2rem] lg:text-[3rem]">
                    Internal Systems and AI-Powered Automation for Every Construction Decision
                  </h3>
                  <p>
                    The operating layer for calls, jobs, crews, materials, contractors, documents, approvals, costs, compliance, and reporting.
                  </p>
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <ActionLink href={BOOK_CALL_URL}>Start a 30-Day Pilot</ActionLink>
                  <Link
                    href={SCOPE_URL}
                    className="inline-flex min-h-11 items-center justify-center rounded-[2px] border border-white/70 px-5 py-3 text-sm font-semibold leading-none text-white transition hover:bg-white hover:text-[#0A0A0A]"
                  >
                    Send Scope / RFQ
                  </Link>
                </div>
                <p className="mt-7 max-w-[800px] border-l-4 border-[#6d4dff] pl-4 text-sm font-semibold leading-6 text-white/78">
                  Built for contractors, service businesses, field teams, construction
                  operators, and industrial companies that need better visibility without
                  enterprise software bloat.
                </p>
              </div>
            </div>
          </div>
        </section>

        <PageSection id="problem">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
            <SectionIntro title="The work is real. The systems are fragmented.">
              <p>
                Construction and industrial businesses usually do not have one clean
                operating system.
              </p>
              <p>
                Calls are handled in one place. Jobs are tracked somewhere else.
                Materials live in spreadsheets. Field updates happen through texts.
                Contractor documents sit in email threads. Reports are built manually
                after the fact.
              </p>
              <p>That is where money leaks.</p>
              <p>
                Missed calls become missed revenue. Missing materials become margin
                loss. Late updates become disputes. Scattered documents delay payment.
                Manual reporting keeps leadership behind the business instead of ahead
                of it.
              </p>
              <p>USATII builds the system that closes those gaps.</p>
            </SectionIntro>
            <div className="lg:pt-3">
              <BorderList items={problemItems} />
            </div>
          </div>
        </PageSection>

        <PageSection id="operating-layer" tone="gray">
          <SectionIntro title="A custom operating layer for the business.">
            <p>
              USATII systems are built around the real objects inside the company:
              clients, jobs, crews, materials, vendors, documents, costs, approvals,
              calls, and reports.
            </p>
            <p>The goal is not another dashboard.</p>
            <p>
              The goal is a system where the business can see what is happening, assign
              responsibility, track changes, control access, and produce records without
              rebuilding the truth manually every week.
            </p>
          </SectionIntro>
          <OperatingDiagram />
        </PageSection>

        <PageSection id="what-we-build">
          <SectionIntro title="Construction operations stack.">
            <p>
              Pick the part of the operation that hurts first. USATII maps the
              workflow, builds the control layer, and expands only after the system
              proves value.
            </p>
          </SectionIntro>
          <ConstructionOperationsStack />
        </PageSection>

        <PageSection id="use-cases">
          <SectionIntro title="Built for companies that operate in the real world.">
            <p>
              USATII is focused first on construction and industrial operators because
              the operational problems are concrete. Crews move. Materials get
              purchased. Calls come in. Jobs change. Clients ask questions. Documents
              matter. Costs need to be tracked. Leadership needs the truth.
            </p>
          </SectionIntro>
          <DataTable headers={["Business type", "What the system controls"]} rows={useCases} />
        </PageSection>

        <PageSection id="rebuildit">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2 className="text-[2rem] font-black leading-[1.04] tracking-normal text-[#0A0A0A] md:text-[2.75rem]">
                Rebuildit Inc.
              </h2>
              <p className="mt-3 text-xl font-semibold text-[#4A4A4A]">
                Construction operations software in the field.
              </p>
              <div className="mt-8 space-y-5 text-[17px] leading-8 text-[#4A4A4A] md:text-[18px]">
                <p>
                  USATII built internal operations software for Rebuildit Inc., a
                  renovation and construction company with service-heavy workflows.
                </p>
                <p>
                  The work focused on turning scattered operations into structured
                  internal systems.
                </p>
                <p className="border-l-4 border-[#6d4dff] pl-4 font-semibold text-[#0A0A0A]">
                  The system centralized operational visibility, reduced tool sprawl,
                  and created a structured foundation for managing a construction
                  operation through software.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-[0.08em] text-[#0A0A0A]">
                  Scope
                </h3>
                <BorderList items={rebuilditScope} />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-[0.08em] text-[#0A0A0A]">
                  Operational records
                </h3>
                <BorderList items={rebuilditRecords} />
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection id="testimonials" tone="gray">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <SectionIntro title="What operators are saying." narrow>
              <p>
                Real client feedback, kept in the same controlled format as the rest
                of the page.
              </p>
            </SectionIntro>
            <div className="flex gap-3 text-[#0A0A0A]">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-[#DADADA] text-2xl">
                &larr;
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-full border border-[#0A0A0A] text-2xl">
                &rarr;
              </span>
            </div>
          </div>

          <div className="mt-14 grid gap-6 overflow-hidden md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="testimonial-card min-h-[360px] border border-[#DADADA] bg-white p-5"
              >
                <div className="border-b border-[#DADADA] pb-5">
                  <p className="font-mono text-sm text-[#737373]">
                    {testimonial.index}/
                  </p>
                  <div className="mt-4 h-4 w-4 rounded-full border-2 border-[#0A0A0A]" />
                </div>
                <p className="mt-16 text-[20px] leading-8 text-[#0A0A0A]">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="mt-8 border-t border-[#DADADA] pt-4">
                  <h3 className="text-base font-black text-[#0A0A0A]">
                    {testimonial.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#737373]">
                    {testimonial.meta}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <PageSection id="pilot">
          <SectionIntro title="Start with one workflow.">
            <p>A USATII pilot should not start with months of vague discovery.</p>
            <p>
              It should start with one painful workflow that can be mapped, built,
              tested, and improved quickly.
            </p>
            <p>
              The pilot proves whether the system creates visibility, reduces manual
              work, and gives management more control.
            </p>
          </SectionIntro>
          <div className="mt-12 grid border-l border-t border-[#DADADA] md:grid-cols-2 xl:grid-cols-4">
            {pilots.map((pilot) => (
              <div
                key={pilot.title}
                className="border-b border-r border-[#DADADA] bg-white p-5"
              >
                <h3 className="text-xl font-black leading-7 text-[#0A0A0A]">
                  {pilot.title}
                </h3>
                <p className="mt-3 min-h-[96px] text-sm leading-6 text-[#4A4A4A] xl:min-h-[132px]">
                  {pilot.body}
                </p>
                <ul className="mt-5 space-y-2 border-t border-[#DADADA] pt-4">
                  {pilot.includes.map((item) => (
                    <li key={item} className="text-sm leading-6 text-[#0A0A0A]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection id="security" tone="gray">
          <SectionIntro title="Built for controlled operations.">
            <p>
              USATII systems are designed around visibility, access control,
              auditability, and human review.
            </p>
            <p>
              The business should know who did what, when it happened, what changed,
              and which records matter.
            </p>
          </SectionIntro>
          <DataTable headers={["Control", "Purpose"]} rows={controls} />
          <p className="mt-6 max-w-[860px] border-l-4 border-[#6d4dff] pl-4 text-sm font-semibold leading-6 text-[#4A4A4A]">
            Security and compliance requirements are reviewed per scope, contract, or
            solicitation.
          </p>
        </PageSection>

        <PageSection id="contact">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <h2 className="text-[2.6rem] font-black leading-[0.98] tracking-normal text-[#0A0A0A] md:text-[4.75rem]">
                Build the operating layer for the companies that still build the country.
              </h2>
              <div className="mt-8 max-w-[760px] space-y-5 text-[18px] leading-8 text-[#4A4A4A]">
                <p>
                  American operators do not need another rented dashboard. They need
                  controlled systems that make calls, crews, materials, costs, documents,
                  and decisions visible.
                </p>
                <p>
                  Send USATII a workflow, construction operations problem, RFQ, or pilot
                  idea. We will scope the first deployment around the records and
                  decisions that matter.
                </p>
              </div>
            </div>
            <div>
              <ConstructionQuoteForm />
            </div>
          </div>
        </PageSection>
      </main>

      <footer className="border-t border-[#DADADA] bg-white px-5 py-10 md:px-6">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 md:grid-cols-[1fr_2fr]">
          <div>
            <BrandLogo />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#737373]">
              VAU SOLUTIONS, LLC d/b/a USATII MEDIA
            </p>
          </div>
          <nav className="grid gap-3 text-sm font-semibold text-[#4A4A4A] sm:grid-cols-5">
            <Link href="#hero" className="hover:text-[#0A0A0A]">
              Construction Software
            </Link>
            <Link href="#operating-layer" className="hover:text-[#0A0A0A]">
              Operations Systems
            </Link>
            <Link href="#rebuildit" className="hover:text-[#0A0A0A]">
              Case Studies
            </Link>
            <Link href="#security" className="hover:text-[#0A0A0A]">
              Security
            </Link>
            <Link href={CAPABILITY_URL} className="hover:text-[#0A0A0A]">
              Capability Statement
            </Link>
          </nav>
        </div>
      </footer>

      <style>{`
        .construction-page {
          --construction-ease: cubic-bezier(0.45, 0, 0.15, 1);
        }

        .construction-page--motion .viewport-layer :is(h1, h2) {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 900ms var(--construction-ease),
            transform 900ms var(--construction-ease);
        }

        .construction-page--motion .viewport-layer :is(h3, p, li, td, th, button, a, form, .fade-slow) {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 1300ms var(--construction-ease) 160ms,
            transform 1300ms var(--construction-ease) 160ms;
        }

        .construction-page--motion .viewport-layer.is-visible :is(h1, h2),
        .construction-page--motion .viewport-layer.is-visible :is(h3, p, li, td, th, button, a, form, .fade-slow) {
          opacity: 1;
          transform: translateY(0);
        }

        .testimonial-card {
          clip-path: polygon(0 0, calc(100% - 44px) 0, 100% 44px, 100% 100%, 0 100%);
        }

        @media (prefers-reduced-motion: reduce) {
          .construction-page--motion .viewport-layer :is(h1, h2, h3, p, li, td, th, button, a, form, .fade-slow) {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
