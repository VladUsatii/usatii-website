import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import IndustryStoriesGrid from "@/app/industries/_components/industry-stories-grid";
import EverythingLoop from "@/app/industries/_components/everything-loop";
import { INDUSTRY_PAGE_DATA } from "@/lib/trades-seo-data";
import { buildPageMetadata } from "@/lib/trades-page-utils";

export const metadata = buildPageMetadata({
  title: "Industries",
  description:
    "See how USATII builds software around the real workflows of HVAC, plumbing, electrical, roofing, landscaping, remodeling, and other trade businesses.",
  path: "/industries",
});

const featuredCaseStudies = [
  {
    name: "Onlock Learning",
    title: "Building a learning platform around consistent daily progress",
    href: "https://www.onlocklearning.com/",
    tile: (
      <div className="grid aspect-square place-items-center rounded-sm bg-gradient-to-br from-stone-100 via-neutral-200 to-violet-200 px-8">
        <p className="text-center text-3xl font-medium tracking-[-0.04em] text-neutral-800">Onlock Learning</p>
      </div>
    ),
  },
  {
    name: "OASIS",
    title: "From fragmented channels to communications intelligence",
    href: "/case-studies/introducing-oasis-communications-intelligence",
    tile: (
      <div className="grid aspect-square place-items-center rounded-sm bg-gradient-to-br from-violet-100 via-violet-300 to-indigo-700 px-8">
        <p className="text-center text-4xl font-medium tracking-[-0.05em] text-white">OASIS</p>
      </div>
    ),
  },
  {
    name: "REBUILDIT INC.",
    title: "Connecting construction operations in one purpose-built system",
    href: "/construction",
    tile: (
      <Image
        src="/home/press/rebuildit-ai.webp"
        alt="REBUILDIT INC."
        width={1254}
        height={1254}
        sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, calc(100vw - 3rem)"
        className="aspect-square rounded-sm object-cover"
      />
    ),
  },
];

export default function IndustriesHubPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pb-32 lg:pt-28">
          <p className="text-xs font-medium">Industries</p>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Software built to do <EverythingLoop />
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-sm leading-6 text-neutral-600">
            Purpose-built operating systems for teams whose work happens in the office, in the field, and everywhere between.
          </p>
          <Link
            href="/quote-request"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </Link>

        </section>

        <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-8 lg:pb-40">
          <div className="border-b border-neutral-200 pb-10">
            <h2 className="text-sm font-medium">Case studies</h2>
          </div>
          <div className="mt-16 grid gap-x-7 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCaseStudies.map((study) => (
              <Link key={study.name} href={study.href} className="group block">
                <article>
                  <div className="overflow-hidden">{study.tile}</div>
                  <h3 className="mt-5 max-w-sm text-base font-medium leading-snug tracking-[-0.02em] transition group-hover:text-violet-700">
                    {study.title}
                  </h3>
                  <p className="mt-4 text-xs text-neutral-500">Featured case study</p>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <IndustryStoriesGrid industries={INDUSTRY_PAGE_DATA} />
      </main>
      <Footer />
    </>
  );
}
