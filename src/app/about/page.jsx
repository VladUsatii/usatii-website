import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { buildPageMetadata } from "@/lib/trades-page-utils";

export const metadata = buildPageMetadata({
  title: "About USATII",
  description: "USATII builds marketing and operations software for organizations ready to own their systems.",
  path: "/about",
});

const stories = [
  {
    title: "Building software around operator workflows",
    subtext: "How one operating system can replace over twenty subscriptions and tools.",
    type: "Software",
    href: "/software",
    color: "from-violet-100 via-indigo-50 to-sky-100",
  },
  {
    title: "Communications intelligence for modern teams",
    subtext: "One platform to dispatch all marketing and announcements.",
    type: "Product",
    href: "https://oasis.usatii.com",
    color: "from-cyan-100 via-emerald-50 to-violet-100",
  },
  {
    title: "How sovereign AI can accomplish nearly all business tasks",
    subtext: "How we connect data, tenants, tooling, and logs together.",
    type: "Company",
    href: "/software/contractor-operating-system",
    color: "from-emerald-100 via-lime-50 to-amber-100",
  },
  {
    title: "Technology to improve quality of life",
    subtext: "Why we build systems to reduce nearly all rote work and what to do instead.",
    type: "Perspective",
    href: "/case-studies",
    color: "from-orange-100 via-rose-50 to-violet-100",
  },
];

function TextLink({ href, children }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition hover:text-violet-700">
      {children}<ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <section className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pt-24">
          <p className="text-xs font-medium">Company</p>
          <h1 className="mt-5 text-5xl font-medium tracking-[-0.045em]">About</h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-neutral-600">
            Our mission is to build software that helps organizations most effectively integrate and use their data and most efficiently complete business tasks.
          </p>
        </section>

        <section className="mx-auto grid max-w-4xl gap-12 px-6 pb-28 md:grid-cols-[0.72fr_1.28fr] md:items-center lg:px-8">
          <div className="max-w-xs">
            <h2 className="text-2xl font-medium leading-tight tracking-[-0.03em]">Our vision for the future of work</h2>
            <p className="mt-5 text-sm leading-6 text-neutral-600">
              We believe software can absorb nearly all operational complexity, giving decision-makers more time for creative business decisions.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <TextLink href="/software">Our software</TextLink>
              <TextLink href="/about/vlad-usatii">Our founder</TextLink>
            </div>
          </div>
          <Image
            src="/about/office.webp"
            alt="Team collaborating around a table in the office"
            width={1254}
            height={1254}
            sizes="(min-width: 768px) 512px, calc(100vw - 3rem)"
            className="aspect-square rounded-sm object-cover"
          />
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24 text-center lg:px-8">
          <h2 className="text-2xl font-medium leading-tight tracking-[-0.03em] md:text-3xl">
            We build marketing and operations software, and measure success by how little work people must do for their business.
          </h2>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-28 lg:px-8">
          <Image
            src="/about/construction.webp"
            alt="Team reviewing plans at a construction site"
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 1024px, calc(100vw - 3rem)"
            className="aspect-[16/9] rounded-sm object-cover"
          />
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24 text-center lg:px-8">
          <h2 className="text-2xl font-medium tracking-[-0.03em]">Careers at Usatii</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-neutral-600">
            Building intelligent systems requires people from a wide range of disciplines, experiences, and backgrounds.
          </p>
          <div className="mt-7"><TextLink href="/careers">View all careers</TextLink></div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-28 lg:px-8">
          <Image
            src="/about/coffee-chat.webp"
            alt="Two colleagues having a conversation over coffee"
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 1024px, calc(100vw - 3rem)"
            className="aspect-[16/9] rounded-sm object-cover"
          />
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-32 lg:px-8">
          <h2 className="text-base font-bold">Learn more about what we do</h2>
          <div className="mt-8 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {stories.map((story) => (
              <article key={story.title}>
                <div className={`aspect-square rounded-sm bg-gradient-to-br ${story.color}`} aria-label="Image placeholder" role="img" />
                <h3 className="mt-4 text-base font-medium leading-snug tracking-[-0.015em]">{story.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{story.subtext}</p>
                <p className="mt-3 text-xs text-neutral-400">{story.type}</p>
                <div className="mt-4"><TextLink href={story.href}>Read more</TextLink></div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-12 px-6 pb-28 md:grid-cols-[0.72fr_1.28fr] md:items-center lg:px-8">
          <div className="max-w-xs">
            <h2 className="text-2xl font-medium tracking-[-0.03em]">Our structure</h2>
            <p className="mt-5 text-sm leading-6 text-neutral-600">
              We design, build, and maintain products alongside custom infrastructure for organizations with complex work.
            </p>
            <div className="mt-7"><TextLink href="/software">Our systems</TextLink></div>
          </div>
          <Image
            src="/about/boat.webp"
            alt="Naval ship underway at sea, viewed from above"
            width={1254}
            height={1254}
            sizes="(min-width: 768px) 512px, calc(100vw - 3rem)"
            className="aspect-square rounded-sm object-cover"
          />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="rounded-sm bg-neutral-100 px-6 py-24 text-center md:py-28">
            <h2 className="mx-auto max-w-lg text-3xl font-medium leading-tight tracking-[-0.035em] md:text-4xl">Join us in shaping the future of technology</h2>
            <div className="mt-8"><TextLink href="/careers">View careers</TextLink></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
