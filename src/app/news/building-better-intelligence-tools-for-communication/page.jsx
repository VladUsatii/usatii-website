import Image from "next/image";
import Link from "next/link";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import { buildArticleSchema, buildFounderPersonSchema, buildOrganizationSchema } from "@/lib/trades-schema";

const title = "Building better intelligence tools for communication";
const description = "The end of bad software starts with better communication systems for organizations.";
const path = "/news/building-better-intelligence-tools-for-communication";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, images: ["/news/marketing-team-collaboration.webp"] },
};

export default function BuildingBetterIntelligenceToolsArticle() {
  const schemas = [
    buildOrganizationSchema(),
    buildFounderPersonSchema(),
    buildArticleSchema({
      path,
      title,
      description,
      datePublished: "2026-09-02",
      dateModified: "2026-09-02",
      image: "/news/marketing-team-collaboration.webp",
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
              Building better intelligence tools for communication
            </h1>
            <p className="mt-6 max-w-[720px] text-[16px] italic leading-7 text-neutral-700 sm:text-[18px]">
              The end of bad software starts with better communication systems for organizations.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[12px]">
              <span className="font-medium">Company</span>
              <span className="text-neutral-500">Sep 2, 2026</span>
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>In 2023, Usatii Media was founded to help creators and organizations perform social media fulfillment tasks, ranging from Reddit posting to Facebook advertising. We were active on nearly every platform, including Threads, Instagram, TikTok, Facebook, Truth Social, X, MySpace, Reddit, LinkedIn, and more.</p>

            <p>We exposed a very large problem. Organizations and creators had far too many disorganized workflows for publication. Our company handled anywhere from 200-1000 custom pieces of content per day, sometimes hiring multiple hundred contractors at once to handle work.</p>

            <p>Unfortunately, Usatii Media is vehemently opposed to the underpaid labor involved in content creation, and we suspended our marketing division in June 2026. We pivoted to software development — something we had always been avidly invested in as our employees are engineers by trade — and found a large niche in automating content for teams. Not only was content automation an open problem, but social media management was as well.</p>

            <figure className="my-12 sm:my-14">
              <Image
                src="/news/marketing-team-collaboration.webp"
                alt="Marketing team collaborating with laptops and smartphones around a shared table"
                width={1672}
                height={941}
                sizes="(min-width: 768px) 660px, calc(100vw - 40px)"
                className="h-auto w-full"
              />
            </figure>

            <p>There were genuinely just two federal incumbents for marketing/communications software. Two.</p>

            <p>The whole field was led by two players, both of which had outdated platforms, bulky and expensive features, and an unhelpful ticket-based support team for inquiries.</p>

            <p>Usatii Media picked this niche up in 2025 and completed OASIS in 2026. We are now in the process of procurement with several agencies as we (a) acquire, (b) land, and (c) expand our influence in the communications space.</p>

            <p>OASIS has features that incumbents missed, such as a unified data ontology with robust zero-visibility data controls and RBAC, AI integration across the platform, logging, branching, and unique integrations that not many firms get access to. Our platform is easy to use, and our organization-to-company-to-group-to-user hierarchy is expandable, customizable, and easy to understand.</p>

            <p>Security is a first-class issue for us, so we maintain SOC 2 and ISO 27001 readiness as we advance to the public sector.</p>

            <p>Usatii Media served as the first case study for OASIS: we used it in real client operations. Tim Wijaya, for example, was a client who got over 1 million views on Instagram content from only one week of our help.</p>

            <p>As we expand, we continue to seek real marketing design partners so we can better understand the industry. If you have a nonprofit, we are more than happy to donate usage of our platform to you and your team perpetually.</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
