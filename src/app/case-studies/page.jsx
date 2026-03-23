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

export default function CaseStudiesIndexPage() {
  const studies = getAllCaseStudies();
  const [featured, ...rest] = studies;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Link href="/">
        <div className="text-center font-black italic tracking-tight hover:opacity-80">
            USATII MEDIA
        </div>
        </Link>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
          Case studies
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-slate-600 sm:text-lg">
          Right now, it is just a test post, but I'll have posts here soon.
        </p>
      </div>

      {featured ? (
        <Link
          href={`/case-studies/${featured.slug}`}
          className="group mt-14 block overflow-hidden transition duration-300 hover:-translate-y-1 hover:opacity-80"
        >
          <div className="grid lg:grid-cols-[1.25fr_0.95fr]">

            <div className="flex flex-col justify-between p-7 md:p-9">
              <div>
                <div className="flex flex-wrap gap-2">
                  {featured.client ? <MetaPill>{featured.client}</MetaPill> : null}
                  {featured.sector ? <MetaPill>{featured.sector}</MetaPill> : null}
                  {featured.dateLabel ? <MetaPill>{featured.dateLabel}</MetaPill> : null}
                  <MetaPill>{featured.readingTime} min read</MetaPill>
                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                  {featured.title}
                </h2>

                <p className="mt-4 text-[16px] leading-7 text-slate-600">
                  {featured.excerpt}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {featured.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ) : null}

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {rest.map((study) => (
          <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(15,23,42,0.08)]"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              {study.cover ? (
                <img
                  src={study.cover}
                  alt={study.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
              )}
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap gap-2">
                {study.dateLabel ? <MetaPill>{study.dateLabel}</MetaPill> : null}
                <MetaPill>{study.readingTime} min read</MetaPill>
              </div>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                {study.title}
              </h3>

              <p className="mt-3 flex-1 text-[15px] leading-7 text-slate-600">
                {study.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {study.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}