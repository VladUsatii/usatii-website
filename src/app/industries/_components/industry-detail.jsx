import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  LockKeyhole,
  Workflow,
} from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";

function tradeInSentence(trade) {
  return trade === "HVAC" ? trade : trade.toLowerCase();
}

function WorkflowStep({ text, index }) {
  const steps = text.split("->").map((step) => step.trim());

  return (
    <article className="border-t border-neutral-800 py-7 first:border-t-0 lg:grid lg:grid-cols-[9rem_1fr] lg:gap-10">
      <p className="mb-5 text-xs font-medium text-neutral-400 lg:mb-0">
        Workflow {String(index + 1).padStart(2, "0")}
      </p>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {steps.map((step, stepIndex) => (
          <li key={`${step}-${stepIndex}`} className="flex items-center gap-2">
            <span className="rounded-full border border-neutral-700 px-3 py-1.5 text-sm leading-5 text-neutral-100">
              {step}
            </span>
            {stepIndex < steps.length - 1 ? (
              <ChevronRight className="h-4 w-4 text-violet-600" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </article>
  );
}

function DetailList({ title, items }) {
  return (
    <section className="border-t border-neutral-200 pt-7">
      <h2 className="text-sm font-medium tracking-[-0.01em]">{title}</h2>
      <ul className="mt-7 space-y-5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-700">
            <Check className="mt-1 h-4 w-4 shrink-0 text-violet-700" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function IndustryDetail({ page, relatedIndustries, schemas }) {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        {schemas.map((schema, index) => (
          <script
            key={`industry-schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        <section className="relative min-h-[720px] overflow-hidden bg-neutral-950 text-white">
          <Image
            src={page.heroImage}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="z-0 object-cover object-center"
          />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(9,9,11,0.94)_0%,rgba(9,9,11,0.84)_42%,rgba(9,9,11,0.24)_78%,rgba(9,9,11,0.12)_100%)]" />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(0deg,rgba(9,9,11,0.72)_0%,transparent_42%)]" />

          <div className="relative z-20 mx-auto flex min-h-[720px] max-w-7xl flex-col px-6 pb-20 pt-12 lg:px-8 lg:pb-24 lg:pt-16">
            <Link
              href="/industries"
              className="inline-flex w-fit items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All industries
            </Link>

            <div className="mt-auto grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-6xl sm:leading-[0.98] lg:text-7xl">
                  {page.heroTitle}
                </h1>
                <p className="mt-8 max-w-2xl text-sm leading-7 text-white/75 sm:text-lg sm:leading-8">
                  {page.opening}
                </p>
              </div>
              <div className="border-t border-white/30 pt-6 backdrop-blur-[2px]">
                <p className="text-sm leading-6 text-white/75">
                  {page.focusNote}
                </p>
                <Link
                  href="/quote-request"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950 transition hover:bg-violet-600 hover:text-white"
                >
                  Discuss an operation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-neutral-50">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
            <div className="px-6 py-20 lg:border-r lg:border-neutral-200 lg:px-8 lg:py-28">
              <h2 className="max-w-lg text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                Handoffs lose the information required for the next decision.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600">
                Intake, field work, approvals, scheduling, documentation, and billing lose context when separate tools control each step. These issues define the first areas to inspect with a {tradeInSentence(page.trade)} team.
              </p>
            </div>
            <div className="px-6 py-16 lg:px-12 lg:py-20">
              <ul className="divide-y divide-neutral-200">
                {page.commonProblems.map((problem, index) => (
                  <li key={problem} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6 first:pt-0 last:pb-0">
                    <span className="text-xs text-neutral-400">{String(index + 1).padStart(2, "0")}</span>
                    <p className="text-base leading-6 tracking-[-0.01em]">{problem}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <Workflow className="h-6 w-6 text-violet-700" />
              <h2 className="mt-6 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
                Connect the operation around one job record.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-neutral-600">
                A shared job record can connect intake, planning, execution, approvals, billing, and closeout while preserving the history of every decision.
              </p>
            </div>
            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
              <DetailList title="What the system can own" items={page.whatWeBuild} />
              <DetailList title="What it can consolidate" items={page.replaceOrConsolidate} />
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
                Each workflow has explicit states and owners.
              </h2>
            </div>
            <div className="mt-16 border-y border-neutral-800">
              {page.workflows.map((workflow, index) => (
                <WorkflowStep key={workflow} text={workflow} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-3">
            <article className="border-t border-neutral-200 pt-7">
              <h2 className="text-sm font-medium">Structured intake</h2>
              <p className="mt-5 text-sm leading-7 text-neutral-600">{page.intakeDesign}</p>
            </article>
            <article className="border-t border-neutral-200 pt-7">
              <h2 className="text-sm font-medium">Operational visibility</h2>
              <p className="mt-5 text-sm leading-7 text-neutral-600">{page.reportingDashboard}</p>
            </article>
            <article className="border-t border-neutral-200 pt-7">
              <LockKeyhole className="h-5 w-5 text-violet-700" />
              <h2 className="mt-5 text-sm font-medium">Controls and accountability</h2>
              <p className="mt-5 text-sm leading-7 text-neutral-600">{page.securityNotes}</p>
            </article>
          </div>
        </section>

        <section className="border-t border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <h2 className="text-3xl font-medium tracking-[-0.04em]">Implementation questions</h2>
              </div>
              <dl className="divide-y divide-neutral-200 border-y border-neutral-200">
                {page.faqs.map((faq) => (
                  <div key={faq.q} className="py-7 sm:grid sm:grid-cols-2 sm:gap-10">
                    <dt className="text-sm font-medium leading-6">{faq.q}</dt>
                    <dd className="mt-3 text-sm leading-6 text-neutral-600 sm:mt-0">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="flex items-end justify-between gap-8">
              <h2 className="text-3xl font-medium tracking-[-0.04em]">Related industries</h2>
              <Link href="/industries" className="hidden text-sm text-neutral-600 hover:text-violet-700 sm:block">
                View all
              </Link>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-3">
              {relatedIndustries.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group flex min-h-44 flex-col justify-between bg-white p-6 transition hover:bg-violet-700 hover:text-white"
                >
                  <p className="text-lg font-medium tracking-[-0.025em]">{industry.trade}</p>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
