import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCaseStudies, getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/case-studies";
import MarkdownContent from "@/app/_components/MarkdownComponent";

export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${study.title} | Case Studies`,
    description: study.excerpt,
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  const allStudies = getAllCaseStudies();

  if (!study) notFound();

  const currentIndex = allStudies.findIndex((item) => item.slug === study.slug);
  const previousStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null;
  const nextStudy =
    currentIndex >= 0 && currentIndex < allStudies.length - 1
      ? allStudies[currentIndex + 1]
      : null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <Link href="/">
          <div className="text-center font-black italic tracking-tight hover:opacity-80">
            USATII MEDIA
          </div>
        </Link>

        <div>
          <div className="px-6 py-8 sm:px-8 md:px-10 md:py-10">
            <div className="flex flex-wrap gap-2 font-bold text-xs text-neutral-600">
              {study.readingTime} min read • Written by Vlad Usatii
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              {study.title}
            </h1>

            {study.excerpt ? (
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {study.excerpt}
              </p>
            ) : null}
          </div>
        </div>

        <article className="mx-auto mt-10 max-w-3xl">
          <MarkdownContent content={study.content} />
        </article>

        {(previousStudy || nextStudy) && (
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-2">
            {previousStudy ? (
              <Link
                href={`/case-studies/${previousStudy.slug}`}
                className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Previous
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  {previousStudy.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextStudy ? (
              <Link
                href={`/case-studies/${nextStudy.slug}`}
                className="rounded-[24px] border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Next
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  {nextStudy.title}
                </div>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}