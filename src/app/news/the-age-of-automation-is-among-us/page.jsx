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
  openGraph: { title, description, images: ["/news/employee-wallet-check-in.webp"] },
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
      image: "/news/employee-wallet-check-in.webp",
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
              The useful question is no longer whether a task can be automated. It is why anyone is still doing it by hand.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[12px]">
              <span className="font-medium">Company</span>
              <span className="text-neutral-500">Sep 10, 2026</span>
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>There is a particular kind of work that fills up a week without leaving much to show for it: copying information between systems, chasing approvals, naming files, updating a tracker after someone sends an email, and answering the same status question for the tenth time. Most teams recognize it. Plenty have learned to live with it.</p>

            <blockquote className="twitter-tweet my-12 sm:my-14">
              <p lang="en" dir="ltr">I cannot believe how much work hasn&apos;t been automated</p>
              &mdash; kache (@yacineMTB){" "}
              <a href="https://x.com/yacineMTB/status/2098051855842509220?ref_src=twsrc%5Etfw">September 10, 2026</a>
            </blockquote>
            <Script async src="https://platform.x.com/widgets.js" charSet="utf-8" strategy="afterInteractive" />

            <p>That reaction is fair. The pieces are already here: software that can read an incoming request, route it to the right person, check the details against a record, create the next task, and keep a clean history of what happened. The hard part is rarely the individual step. It is deciding where the handoff should happen, what counts as an exception, and who owns the result when the process breaks.</p>

            <p>Automation is not a reason to remove judgment. It is a reason to stop spending judgment on chores. A coordinator should be able to notice that a client request is unusual instead of manually moving it through five columns. An account manager should spend time fixing a relationship, not building a weekly report from screenshots. Those are different jobs.</p>

            <p>The first candidates are usually obvious. Find the work that is repeated, rules-based, and annoying enough that people invent their own shortcuts. Map it as it really happens, including the strange edge cases. Then automate one reliable path and watch it in use. A bad process running faster is still a bad process.</p>

            <p>There will always be work that needs a person in the middle. The point is to make that person necessary for the part that deserves them. The rest can move on its own.</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
