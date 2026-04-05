import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";

function MetaPill({ children }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
      {children}
    </span>
  );
}

export const metadata = {
  title: "Case Studies",
  description: "Case studies, breakdowns, and system-level growth outcomes at Usatii Media.",
};

export default async function CaseStudiesIndexPage() {
  const studies = await getAllCaseStudies();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Link href="/" className="block">
          <div className="text-center font-black italic tracking-tight hover:opacity-80">
            USATII MEDIA
          </div>
        </Link>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
          Case studies
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-slate-600 sm:text-lg">
          Learn how we took creators and businesses from zero to hero quickly by leveraging systems to capture attention through content and design.
        </p>
      </div>

      {studies.length > 0 ? (
        <div className="mt-14 space-y-6">
          {studies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group block overflow-hidden transition duration-300 hover:-translate-y-1 hover:opacity-80"
            >
              <div className="flex flex-col justify-between p-7 md:p-9">
                <div className="flex flex-wrap gap-2">
                  {study.dateLabel ? <MetaPill>{study.dateLabel}</MetaPill> : null}
                  <MetaPill>{study.readingTime} min read</MetaPill>
                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                  {study.title}
                </h2>

                {study.excerpt ? (
                  <p className="mt-4 text-[16px] leading-7 text-slate-600">
                    {study.excerpt}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
