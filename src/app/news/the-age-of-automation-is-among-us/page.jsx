import Link from "next/link";
import Script from "next/script";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import { buildArticleSchema, buildFounderPersonSchema, buildOrganizationSchema } from "@/lib/trades-schema";

const title = "The age of automation is among us.";
const description = "A look at the repetitive work still waiting to be automated and what teams should do about it.";
const path = "/news/the-age-of-automation-is-among-us";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, images: ["/news/automation-stars.png"] },
};

export default function AgeOfAutomationArticle() {
  const schemas = [
    buildOrganizationSchema(),
    buildFounderPersonSchema(),
    buildArticleSchema({
      path,
      title,
      description,
      datePublished: "2026-09-10",
      dateModified: "2026-09-10",
      image: "/news/automation-stars.png",
    }),
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <SchemaScripts schemas={schemas} />
        <article className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-14 sm:px-7 lg:pb-36 lg:pt-18">
          <Link href="/news" className="text-[12px] font-medium text-neutral-500 transition hover:text-neutral-950">
            News
          </Link>

          <header className="max-w-[900px]">
            <h1 className="mt-7 text-[38px] font-medium leading-[1.04] tracking-[-0.038em] sm:text-[46px] lg:text-[54px]">
              The age of automation is among us.
            </h1>
            <p className="mt-6 max-w-[720px] text-[16px] italic leading-7 text-neutral-700 sm:text-[18px]">
              Software can now carry work across systems. Most organizations have barely begun to redesign around that fact.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[12px]">
              <span className="font-medium">Company</span>
              <span className="text-neutral-500">Sep 10, 2026</span>
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>Automation has crossed a threshold. Software can read an intake form, extract the details that matter, check a record, request a missing approval, create the next task, update the customer, and leave behind an audit trail. Those capabilities are already usable. Yet much of the economy still runs on people carrying information from one screen to another, then proving they carried it.</p>

            <blockquote className="twitter-tweet my-12 sm:my-14">
              <p lang="en" dir="ltr">I cannot believe how much work hasn&apos;t been automated</p>
              &mdash; kache (@yacineMTB){" "}
              <a href="https://x.com/yacineMTB/status/2098051855842509220?ref_src=twsrc%5Etfw">September 10, 2026</a>
            </blockquote>
            <Script async src="https://platform.x.com/widgets.js" charSet="utf-8" strategy="afterInteractive" />

            <p>For years, business software digitized the filing cabinet and left the relay race intact. A request arrived by email, someone retyped it into a CRM, another person opened a ticket, and a manager asked for a report on Friday. Each handoff became a job. Each job became a habit. The cost shows up as delayed decisions, dropped context, exhausted teams, and a growing belief that administration is simply the price of doing business.</p>

            <p>We reject that bargain. People should own decisions, exceptions, relationships, and consequences. Systems should own repetition. A coordinator should see the request that breaks the rule, with the context needed to act. An account manager should walk into a client conversation prepared, rather than spend Thursday assembling a status update from screenshots. The work becomes more demanding where it should: in judgment, care, and accountability.</p>

            <p>The scale of the change deserves clear eyes. The <a className="underline decoration-neutral-400 underline-offset-4 transition hover:decoration-neutral-950" href="https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure">International Labour Organization&apos;s 2025 task-level study</a> found some degree of generative-AI exposure in one in four jobs worldwide, while placing only 3.3% of global employment in its highest exposure category. Work is made of tasks, and tasks move at different speeds. Treating every role as a unit of inevitable replacement is lazy management and bad analysis.</p>

            <p>Our standard is simple: automation must earn trust. It needs a named owner, visible rules, permission boundaries, a record of what it did, and a path for a person to intervene. It must work for the person with the least time, the smallest team, and the fewest engineers available to wire it together. Otherwise, automation becomes another advantage reserved for the companies that already have enough.</p>

            <p>The next generation of organizations will be built around leverage that is widely available. Their people will spend less time transferring information and more time making things, fixing what matters, and serving one another well. The technology is here. The responsibility now is to put it to work with intent.</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
