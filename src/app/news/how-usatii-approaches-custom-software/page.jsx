import Link from "next/link";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import { buildArticleSchema, buildFounderPersonSchema, buildOrganizationSchema } from "@/lib/trades-schema";

const title = "How Usatii approaches custom software";
const description = "A procurement-led discovery approach to custom software: collaborative requirements engineering, free proof-of-value pilots, and lasting control over your software, data, and AI capabilities.";
const path = "/news/how-usatii-approaches-custom-software";
const image = "/news/custom-software.svg";
const date = "2026-10-23";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, type: "article", publishedTime: date, images: [image] },
};

export default function CustomSoftwareArticle() {
  const schemas = [
    buildOrganizationSchema(),
    buildFounderPersonSchema(),
    buildArticleSchema({ path, title, description, datePublished: date, dateModified: date, image }),
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <SchemaScripts schemas={schemas} />
        <article className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-14 sm:px-7 lg:pb-36 lg:pt-18">
          <Link href="/news" className="text-[12px] font-medium text-neutral-500 transition hover:text-neutral-950">News</Link>
          <header className="max-w-[900px]">
            <h1 className="mt-7 text-[38px] font-medium leading-[1.04] tracking-[-0.038em] sm:text-[46px] lg:text-[54px]">{title}</h1>
            <div className="mt-6 flex items-center gap-3 text-[12px]">
              <span className="font-medium">Company</span>
              <time dateTime={date} className="text-neutral-500">Oct 23, 2026</time>
            </div>
          </header>
          <div className="mx-auto mt-14 max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>We introduce a procurement-led discovery approach for engineering custom software. Using collaborative requirements engineering, our deployed engineers build proof-of-value pilots and measure results against your current environment, and if value is genuinely created, your business can pay for an end-to-end build of the custom software.</p>
            <p>Usatii is not the first software firm to build an operating model like this:</p>
            <ul className="list-disc space-y-3 pl-6">
              <li>Palantir’s FDEs work beside customer teams. Bootcamp moves to a use case in 5 days.</li>
              <li>IBM Client Engineering has multidisciplinary teams jointly develop pilots with customers (4 weeks).</li>
              <li>OpenAI leads discovery, prototyping, validation, deployment, and scaling and measures success.</li>
              <li>Scale AI engineers work directly with customers to define a use case, prepare data, evaluate models, and deploy production systems.</li>
              <li>C3 AI uses fixed-price, 8-16 week trials to demonstrate economic value before deployments.</li>
            </ul>
            <p>It has been done for nearly a decade now. But what hasn’t been established is quite clear to small-business and enterprise firms all over the world: no firm proves value for free. And going further, no company has demonstrated a cost-effective, in-house option for software and AI in history.</p>
            <p>This breakthrough in the software industry now leads us into understanding how Usatii structures the sales cycle for its international clients (primarily US, Europe, and the Middle East):</p>
            <ol className="list-decimal space-y-8 pl-6 marker:font-medium">
              <li><strong>Initial consultation.</strong> Usatii meets with leadership at an organization and hosts their procurement representatives, technical teams, and employees (Users) of the software. We take time to understand the business problem and whether the organization can realistically adopt the proposed solution.</li>
              <li><strong>Requirements discovery &amp; market research.</strong> Usatii’s Forward-Deployed Engineers (FDEs) fly out or drive out to study how the organization operates. The human environment matters to our team and we prioritize real industry evaluation over a remote guess on requirements. During this time, the team conducts focused market research to identify existing products, comparable solutions, industry practices and trends, and technical infrastructure options. We use this time to determine what the customer needs, whether existing software can already meet those needs, and where a custom solution would create added value. The result of this stage is a jointly approved requirements document and a clear proposal for what to test.</li>
              <li><strong>Pilot scope &amp; agreement.</strong> Both teams pick a valuable problem from the requirements document and agree on a small pilot that demonstrates a clear, measurable solution. Before work starts, the expected results are documented, including any required data, responsibilities, and duration of the pilot. The pilot has no development fee. There is an obligation to purchase if the software demonstrates real value as measured by the administration making final purchasing decisions.</li>
              <li><strong>Free pilot development bootcamp.</strong> During the pilot, Usatii assigns engineers to work on the field with the customer’s team, most often in-person to avoid telephoning. Our bootcamp promises a working piece of software within 7-14 days of the start date. The pilot concentrates on one to two critical workflows. A full production platform and extensive migrations/deployment come in (7).</li>
              <li><strong>Results &amp; business value evaluation.</strong> Usatii and stakeholders test the pilot against the agreed measures of success. E.g. if humans spend eight hours preparing a report and the pilot reduces that to fifteen minutes, the teams can measure a near-eight hour improvement in workplace productivity. We establish whether the solution reduces human and material costs, increases productivity or accuracy, or delivers another agreed operational benefit.</li>
              <li><strong>Commercial agreement &amp; full implementation.</strong> If the pilot succeeds, Usatii works to finalize production requirements with the administration. We work in Agile sprints, meaning that 2-3 blocks of 2-3 weeks of work each will be expected. The bulk of work is done in the first sprint, meaning that a beta deployment can occur in as little as two weeks of end-to-end development.</li>
              <li><strong>Deployment, sovereignty, &amp; perpetual licensing of infrastructure.</strong> Usatii deploys the completed system into the agreed environment, including the customer’s own infrastructure or high-privacy cloud. For sovereign deployments of artificial intelligence systems, this means that the customer keeps their data, models, inference, and operational records within the customer’s legal and approved boundaries. The customer receives a perpetual license to the agreed software which allows continued use without renewing the license at any time period. Support, upgrades, and third-party vending is addressed separately and may cost the customer additional funds. The analogy is quite simple: you can buy a house instead of renting it, but that doesn’t mean you won’t have to pay to fix leaky pipes or afford property taxes.</li>
            </ol>
            <p>Usatii’s unique model gives organizations lasting control over their software, data, and AI capabilities while enabling Usatii to provide ongoing engineering and support. Own your alpha.</p>
            <h2 className="pt-8 text-[26px] font-medium leading-tight tracking-[-0.025em] sm:text-[30px]">Some common questions and their answers</h2>
            <ol className="list-decimal space-y-6 pl-6 marker:font-medium">
              <li><strong>Who qualifies for a free pilot?</strong> Organizations with an identified operational problem, engaged sponsor, sufficient data access, and a realistic procurement path.</li>
              <li><strong>When are requirements finalized?</strong> Approve pilot requirements before development, and finalize complete production requirements after evaluation.</li>
              <li><strong>What does ownership mean?</strong> Customers control their alpha in its entirety, whether it is their data, their deployment, their property, their software, or their intellectual property. Sovereignty is real, and we’re the first company that offers it end-to-end for commercial, enterprise software.</li>
            </ol>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
