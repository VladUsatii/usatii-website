import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import DepartmentImpactCarousel from "./department-impact-carousel";
import { SITE_URL } from "@/lib/services-seo";

const PATH = "/case-studies/rebuildit-inc";

export const metadata = {
  title: { absolute: "REBUILDIT INC. Case Study | USATII" },
  description:
    "How USATII designed a connected construction operating system for REBUILDIT INC. across intake, projects, field work, materials, administration, and reporting.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: "REBUILDIT INC. Case Study",
    description: "One connected operating layer across a construction company.",
    url: `${SITE_URL}${PATH}`,
    siteName: "USATII MEDIA",
    type: "article",
  },
};

const operatingLayers = [
  ["01", "Intake", "Calls, inquiries, customer details, appointments, and follow-up ownership."],
  ["02", "Delivery", "Projects, schedules, crews, work orders, changes, documents, and field evidence."],
  ["03", "Resources", "Materials, purchasing, inventory, equipment, vendors, and job-level usage."],
  ["04", "Control", "Permissions, approvals, activity history, financial context, and management reporting."],
];

const connectedWork = [
  ["One record of the customer", "Information follows the relationship from the first inquiry through active work and closeout."],
  ["One record of the project", "Schedules, tasks, labor, materials, documents, changes, and costs stay connected."],
  ["One operating history", "Teams can see what changed, who owns the next action, and which evidence supports a decision."],
  ["One foundation for automation", "Repetitive classification, summaries, routing, reminders, and reporting can be added with human control."],
];

function TextLink({ href, children }) {
  const external = href.startsWith("http");
  return (
    <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition hover:text-violet-700">
      {children}<ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

export default function RebuilditCaseStudyPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center lg:px-8 lg:pb-20 lg:pt-24">
          <p className="text-xs font-medium">Construction operating system · Case study</p>
          <h1 className="mt-5 text-5xl font-medium tracking-[-0.05em] sm:text-6xl">REBUILDIT INC.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600">
            A purpose-built operating layer connecting the people, records, and decisions behind a growing Sacramento design-build company.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
            <TextLink href="/construction">Explore Usatii for Construction</TextLink>
            <TextLink href="https://www.rebuilditinc.com/">Visit REBUILDIT INC.</TextLink>
          </div>
        </section>

        <section className="relative h-[72svh] min-h-[520px] w-full overflow-hidden bg-neutral-900">
          <Image src="/construction/construction-hero-ai.webp" alt="Aerial view of coordinated equipment and crews across a commercial construction site" fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />
          <p className="absolute bottom-8 left-6 max-w-2xl text-2xl font-medium leading-tight tracking-[-0.03em] text-white sm:bottom-12 sm:left-10 sm:text-4xl lg:left-[max(2.5rem,calc((100vw-64rem)/2))]">
            The objective was not another dashboard. It was one operational model for the whole company.
          </p>
        </section>

        <section className="mx-auto grid max-w-4xl gap-12 px-6 py-28 md:grid-cols-[0.72fr_1.28fr] md:items-start lg:px-8">
          <div className="max-w-xs">
            <p className="text-xs text-neutral-400">The operating problem</p>
            <h2 className="mt-4 text-2xl font-medium leading-tight tracking-[-0.03em]">Construction work crosses too many departments for disconnected software.</h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-neutral-600">
            <p>Every customer request creates a chain of calls, appointments, estimates, schedules, labor decisions, material movements, documents, approvals, field updates, and financial records.</p>
            <p>USATII designed a shared model around those relationships so each department could work from the same operational truth instead of rebuilding context inside separate tools.</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-28 lg:px-8">
          <Image src="/construction/rebuildit-operations.webp" alt="REBUILDIT INC. construction operations software interface built by USATII" width={1440} height={776} sizes="(min-width: 1024px) 960px, calc(100vw - 3rem)" className="w-full rounded-sm border border-neutral-200 object-cover object-top" />
          <div className="mt-16 border-y border-neutral-200">
            {operatingLayers.map(([number, title, body]) => (
              <article key={number} className="grid gap-4 border-b border-neutral-200 py-7 last:border-b-0 sm:grid-cols-[3rem_11rem_1fr] sm:items-start">
                <p className="text-xs tabular-nums text-neutral-400">{number}</p>
                <h3 className="text-base font-medium">{title}</h3>
                <p className="max-w-2xl text-sm leading-6 text-neutral-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <DepartmentImpactCarousel />

        <section className="mx-auto max-w-5xl px-6 py-28 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs text-neutral-400">What the system connects</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] sm:text-5xl">A foundation that becomes more useful as work moves through it.</h2>
          </div>
          <div className="mt-14 grid border-t border-neutral-200 sm:grid-cols-2">
            {connectedWork.map(([title, body], index) => (
              <article key={title} className={`border-b border-neutral-200 py-8 sm:min-h-52 ${index % 2 === 0 ? "sm:pr-8" : "sm:border-l sm:pl-8"}`}>
                <h3 className="text-lg font-medium tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
            <p className="text-xs font-medium">Start with one operational bottleneck</p>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-medium tracking-[-0.04em] sm:text-5xl">Build software around the way your company actually works.</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
              <TextLink href="https://cal.com/usatii/onboarding">Discuss a working session</TextLink>
              <TextLink href="/quote-request">Send project details</TextLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
