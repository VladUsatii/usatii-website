import Image from "next/image";
import Link from "next/link";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import { buildArticleSchema, buildFounderPersonSchema, buildOrganizationSchema } from "@/lib/trades-schema";

const title = "Introducing DART";
const description = "Today, we introduce DART, our flagship emergency management system.";
const path = "/news/introducing-dart";
const image = "/news/dart.png";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, images: [image] },
};

export default function IntroducingDartArticle() {
  const schemas = [
    buildOrganizationSchema(),
    buildFounderPersonSchema(),
    buildArticleSchema({ path, title, description, datePublished: "2026-09-28", dateModified: "2026-09-28", image }),
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <SchemaScripts schemas={schemas} />
        <article className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-14 sm:px-7 lg:pb-36 lg:pt-18">
          <Link href="/news" className="text-[12px] font-medium text-neutral-500 transition hover:text-neutral-950">News</Link>
          <header className="max-w-[900px]">
            <h1 className="mt-7 text-[38px] font-medium leading-[1.04] tracking-[-0.038em] sm:text-[46px] lg:text-[54px]">Introducing DART</h1>
            <div className="mt-6 flex items-center gap-3 text-[12px]">
              <span className="font-medium">Product</span>
              <span className="text-neutral-500">Sep 28, 2026</span>
            </div>
          </header>
          <Image src={image} alt="DART product identity on a green abstract background" width={1948} height={1096} priority sizes="(min-width: 1180px) 1180px, 100vw" className="mt-12 h-auto w-full" />
          <div className="mx-auto mt-14 max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>Today, we introduce DART, our flagship emergency management system.</p>
            <p>Emergency management must be organized around the people and institutions that respond to emergencies. In our model, local governments have real operating capacity. States are capable of coordinating their people, resources, mutual aid, qualifications, logistics, and recovery work. The federal government should be excellently capable of federal scale during catastrophic events, but federal capability should strengthen the state and local institutions that make them whole rather than make them dependent on Washington for ordinary execution.</p>
            <p>Donald Trump shares our stance. As of 2026, the market for appropriate and modernized federal software for emergency management is bigger than ever, and we are confidently extending a commitment to helping federal agencies with emergency management systems.</p>
            <p>Preparedness should be measurable. Before emergencies occur, leadership should know whether positions can be staffed, which staff are qualified, if resources exist, if capabilities are deployable at a country-wide scale, and where material gaps remain. The operating system for FEMA and other institutions performing emergency management responsibilities must have a deployed ontology showing the people, resources, permissions, and dependencies required to execute real missions.</p>
            <p>Risk deserves prioritization. EM organizations handle enormous amounts of information, but displaying all available information is not situationally aware by default. Systems must help distinguish consequential from routine changes, directing attention to conditions that materially affect readiness and response.</p>
            <p>We remain truly skeptical of legacy bureaucratic software. Operators must never need extensive institutional knowledge primarily because they serve an emergency management obligation.</p>
            <p>We expect the structure around emergency management to change quickly, and our software reflects that. Usatii commits to helping organizations retain meaningful control over systems, information, and the expansions and redevelopments that may occur during the implementation and support of our systems.</p>
            <p>Usatii urges policymakers to reach out to our team to discuss real strategy for emergency management systems and the future of EM software broadly applied. We also encourage lawmakers to consider how strong, decentralized systems like DART can be applied to fix some of the larger bipartisan issues that emergency management faces in the USA.</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
