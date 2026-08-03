import Link from "next/link";
import {
  BellRing,
  Building2,
  Check,
  ClipboardCheck,
  Database,
  FileCheck2,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { buildPageMetadata } from "@/lib/trades-page-utils";

export const metadata = buildPageMetadata({
  title: "Security & Privacy",
  description:
    "How USATII protects client systems and data through practical security controls, careful development, and clear ownership.",
  path: "/security",
});

const audiences = [
  {
    title: "For your team",
    subtitle: "You control how your operational data is used.",
    icon: Database,
    points: [
      "Access is designed around role-based controls and capability statements.",
      "Authentication and ACLs protect sensitive information.",
      "Organizations decide who can view, change, export, or remove data.",
      "Activity can be logged so important changes remain attributable.",
      "Client data is not sold or used to train public AI models unless specified in a sovereign client context.",
    ],
  },
  {
    title: "For your business",
    subtitle: "Safeguards for systems running proprietary business workflows.",
    icon: Building2,
    points: [
      "Security requirements are defined around each system's risk profile.",
      "Data is encrypted in transit and protected at rest by our infrastructure providers.",
      "3rd-party integrations are scoped to the access they need.",
      "Backups, recovery, and availability are considered for mission-critical workflows.",
      "We document ownership and handoff so your business stays yours.",
    ],
  },
];

const standards = [
  {
    title: "OWASP application security guidance",
    body: "Our application review and development practices follow established OWASP guidance for common web application risks.",
  },
  {
    title: "NIST Cybersecurity Framework",
    body: "We use the NIST framework as a practical reference for identifying, protecting, detecting, responding to, and recovering from security events.",
  },
  {
    title: "CIS Controls",
    body: "Infrastructure and account safeguards are informed by prioritized CIS Controls appropriate to the size and risk of your implementation.",
  },
  {
    title: "SOC 2-ready architecture",
    body: "Systems can be designed with access control, logging, change management, and evidence collection needed to support or complete compliance programs.",
  },
  {
    title: "Privacy-by-design principles",
    body: "We minimize collection, define purpose and retention, and keep data access understandable throughout the system lifecycle. Sovereign data usage is a first-class ability of our company and is available upon request.",
  },
];

const securitySteps = [
  {
    icon: ShieldCheck,
    title: "Defense in depth",
    body: "Infrastructure combines identity controls, encrypted transport, scoped permissions, and provider-level safeguards instead of relying on one boundary.",
  },
  {
    icon: FileCheck2,
    title: "Responsible development",
    body: "Security is considered during architecture, implementation, review, and deployment—not added after a system is complete.",
  },
  {
    icon: LockKeyhole,
    title: "Operational controls",
    body: "Role-based access, audit history, approval gates, and data ownership are designed around how your organization works.",
  },
  {
    icon: BellRing,
    title: "Reporting security issues",
    body: "Potential vulnerabilities are investigated directly and handled according to their severity, affected data, and impact.",
  },
];

const resources = [
  {
    href: "/privacy",
    title: "Site privacy policy",
    icon: Database,
    gradient: "from-fuchsia-200 via-violet-200 to-sky-300",
  },
  {
    href: "/resources/software-security-for-small-businesses",
    title: "Software security for small businesses",
    icon: ScanSearch,
    gradient: "from-violet-300 via-indigo-500 to-blue-700",
  },
  {
    href: "/software",
    title: "Security-conscious custom software",
    icon: ClipboardCheck,
    gradient: "from-cyan-200 via-cyan-400 to-teal-700",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <section className="mx-auto max-w-2xl px-6 pb-24 pt-20 text-center lg:pb-28 lg:pt-24">
          <h1 className="text-5xl font-medium tracking-[-0.055em]">Security &amp; privacy</h1>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-6 text-neutral-600">
            Usatii is committed to protecting client data and the systems that use it. Our platforms prioritize robust security and privacy, tested by a team focused on practical safeguards.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-28 lg:px-8">
          <h2 className="text-center text-3xl font-medium tracking-[-0.04em]">Keeping your data secure</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <article key={audience.title} className="flex flex-col rounded-sm border border-neutral-200 p-6">
                  <h3 className="text-base font-medium">{audience.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{audience.subtitle}</p>
                  <ul className="mt-6 space-y-3 text-xs leading-5 text-neutral-600">
                    {audience.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-950" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 grid min-h-56 place-items-center rounded-sm bg-gradient-to-br from-violet-300 via-sky-300 to-cyan-400">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-sm">
                      <Icon className="h-7 w-7" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-28 text-center lg:px-8">
          <h2 className="text-3xl font-medium tracking-[-0.04em]">Security practices &amp; alignment</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-neutral-600">
            We use established security and privacy frameworks to guide how systems are designed, built, and maintained. The controls applied to each project depend on its data, users, integrations, and operational risks.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-neutral-600">
            Review our privacy policy or security guide for more details regarding our approach.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/privacy" className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium transition hover:bg-neutral-200">
              View privacy policy ↗
            </Link>
            <Link href="/resources/software-security-for-small-businesses" className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium transition hover:bg-neutral-200">
              Read security guide
            </Link>
          </div>

          <h3 className="mt-16 text-xl font-medium tracking-[-0.025em]">Our standards</h3>
          <div className="mx-auto mt-8 max-w-xl space-y-4 text-left">
            {standards.map((standard) => (
              <article key={standard.title} className="rounded-sm bg-neutral-50 p-6">
                <h4 className="text-sm font-medium">{standard.title}</h4>
                <p className="mt-3 text-xs leading-5 text-neutral-600">{standard.body}</p>
              </article>
            ))}
          </div>

        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-8">
          <h2 className="text-center text-3xl font-medium tracking-[-0.04em]">Security at every step</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {securitySteps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-sm border border-neutral-200 p-5">
                  <Icon className="h-5 w-5" />
                  <h3 className="mt-5 text-base font-medium">{step.title}</h3>
                  <p className="mt-4 text-xs leading-5 text-neutral-600">{step.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-8">
          <h2 className="text-center text-xl font-medium">More resources</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Link key={resource.title} href={resource.href} className="group">
                  <div className={`grid aspect-[1.35/1] place-items-center overflow-hidden rounded-sm bg-gradient-to-br ${resource.gradient}`}>
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-sm transition group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </span>
                  </div>
                  <h3 className="mt-3 text-xs font-medium">{resource.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
