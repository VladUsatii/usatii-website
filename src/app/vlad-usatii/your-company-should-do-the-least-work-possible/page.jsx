import Link from "next/link";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";

export const metadata = {
  title: "Your company should do the least work possible",
  description:
    "On reducing rote work, owning business software, and building more efficient company operations.",
  alternates: {
    canonical: "/vlad-usatii/your-company-should-do-the-least-work-possible",
  },
  openGraph: {
    title: "Your company should do the least work possible",
    description:
      "On reducing rote work, owning business software, and building more efficient company operations.",
  },
};

export default function LeastWorkPossibleArticle() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <article className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-14 sm:px-7 lg:pb-36 lg:pt-18">
          <Link
            href="/vlad-usatii"
            className="text-[12px] font-medium text-neutral-500 transition hover:text-neutral-950"
          >
            Letters from Vlad Usatii
          </Link>

          <header className="max-w-[820px]">
            <h1 className="mt-7 text-[38px] font-medium leading-[1.04] tracking-[-0.038em] sm:text-[46px] lg:text-[54px]">
              Your company should do the least work possible
            </h1>
            <div className="mt-6 flex items-center gap-3 text-[12px]">
              <span className="font-medium">Letter</span>
              <span className="text-neutral-500">Aug 30, 2026</span>
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>When Usatii Media was a marketing company, we would regularly land some of the most influential clients on the internet. These people were racking up millions, sometimes even billions of views, and had million-dollar brand deals. But they all had one thing in common: their operations were fragmented.</p>

            <p>Random Indian and Pakistani assistants were hired remotely to copy-paste data from one place to another, and this was particularly bad the farther up the socialite hierarchy we went.</p>

            <p>I was trained in computer science and did cybersecurity research for over a year, so naturally I began to think at a hacky and systems-design level on how to solve what I&apos;ve coined the <em>operational inefficiency problem</em>.</p>

            <p>Obviously, I pivoted to software. It was a great choice because most problems that companies face, whether it be in the management of their employees or in the management of their data, lies in the manual and rote labor that they assign themselves. Business people are too focused on delivery to see the inefficiencies themselves, and once they&apos;ve become too comfortable in their own inefficiencies, they refuse to discuss it with software incumbents or engineers. I like to think of them as &quot;being comfortable in their own demise.&quot;</p>

            <p>But the same way business owners have a drive for greatness, they should also have a drive for improving efficiency and their team&apos;s overall quality of life. To do this, we must address the problem at its root: build optimized software.</p>

            <p>Rote tasks should technically not exist in a company. If your job is repetitive and can be done by AI or a good data pipeline, it isn&apos;t valuable.</p>

            <p>If what you&apos;re doing is easy and repetitive, it isn&apos;t valuable. And if it is repetitive, chances are that the semantic understanding you have of the data presented to you is less accurate than what a machine is capable of.</p>

            <p>That introduces our first contention with current business practices, which is:</p>

            <blockquote className="border-l-2 border-neutral-300 pl-6 text-[21px] font-medium leading-[1.45] tracking-[-0.015em]">
              Why don&apos;t people own their software?
            </blockquote>

            <p>It makes sense at first glance. Owning it? -- of course you should own it! SaaS is just expensive, feature-by-feature hubris.</p>

            <p>But more people are comfortable renting their business&apos;s capabilities from others rather than building them in-house for themselves. Moving things on-premises regularly saves companies thousands, if not hundreds of thousands (and rarely millions) per year in perpetuities that they would never need if they had an ambitious software company at their fingertips.</p>

            <p>Current incumbents like Palantir or even FAST Enterprises have most of this nailed, but they still tend to overcomplicate the software world. A construction ontology, for instance, should not be a million dollars. I shouldn&apos;t have to sign a multi-year contract with a company who is handing me a static, on-prem product.</p>

            <p>I should still be able to (a) expand the software (add more features), (b) add more people to the team (add capital to the project), and (c) maintain privacy (keep your business intelligence away from the big guys).</p>

            <p>A few cases exist against us. For instance, many object at the work required to transition from a slew of disconnected SaaS (or manual) products to one neat dashboard with everything in one place. They think &quot;this is a multi-year project and I don&apos;t have the time during the week to call and keep up with this!&quot; and they would be 100% right.</p>

            <p>Building custom software is something you should only do if you have the time to spare on its development. And the time involved may be worth it, given that you can advise the exact operating direction of your engineers.</p>

            <p>One contention we receive is on pricing. In the long term, we are 100-1000X cheaper than our incumbents. That isn&apos;t even a discussion up for debate on the data alone.</p>

            <p>This brings me to my next point: greed.</p>

            <blockquote className="border-l-2 border-neutral-300 pl-6 text-[21px] font-medium leading-[1.45] tracking-[-0.015em]">
              Why do you spend money on your own business&apos;s internal capabilities?
            </blockquote>

            <p>This isn&apos;t something that should technically even happen. Restaurants don&apos;t pay their dish supplier monthly for the dishes they already serve food on. Cafe&apos;s don&apos;t pay their employees a commission for every coffee they serve. So why do SaaS companies charge you for every action you take on something they already sold to you?</p>

            <p>Our company has a strong no-subscription policy. Nothing we build is rented. You own it all.</p>

            <p>Clearly, there are still third-party costs involved, such as AWS or Cloudflare, but these are modest costs associated with using someone&apos;s internet servers. There is an argument for this: internet costs money because of ongoing maintenance involved in its perpetuity. People pay for gas because it is fundamentally expensive to harvest, and is a rare earth material. There are some unavoidable costs at Usatii Media. This may even include something as simple as cybersecurity maintenance. If Next JS has a critical vulnerability in an early version, we&apos;ll know about it quickly and update your software to reflect the newest safety guidance. These are unavoidable charges associated with owning software.</p>

            <p>Hopefully I&apos;ve done a good job at convincing you so far.</p>

            <p>Our goal is -- and will always be -- to reduce the amount of rote work a company must do to stay profitable. The less a company does to deliver value, the better. Better quality of life. Better consistency of service.</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
