import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const sideStories = [
  {
    title: "REBUILDIT AI",
    description: "Helping construction companies make fast decisions. We organize private and public-sector projects with a data ontology, sovereign AI, and hundreds of features like PBX infrastructure, automated bid mining, 3D building scans, and team/inventory management.",
    image: "/home/press/rebuildit-ai.webp",
    href: "https://www.rebuilditinc.com/",
    cta: "Explore REBUILDIT AI",
  },
  {
    title: "Custom projects",
    description: "We build real marketing and operations software for organizations that need scale, precision, and coordinated action.",
    image: "/home/press/usatii-media.webp",
    href: "/software",
    cta: "See how we build",
  },
];

function StoryLink({ href, children }) {
  return (
    <Link href={href} className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-neutral-950 hover:text-violet-700">
      {children}
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export default function SystemsBentoGrid() {
  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <h2 className="text-4xl font-medium leading-tight tracking-[-0.035em] text-neutral-950 sm:text-6xl">
            Systems we build today help you make better decisions tomorrow.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Operations and growth infrastructure built as real products with institutional sovereignty.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.7fr)] lg:items-start">
          <article className="lg:sticky lg:top-20">
            <div className="relative aspect-[4/3] overflow-hidden bg-white">
              <Image
                src="/home/press/oasis.webp"
                alt="OASIS product identity"
                fill
                priority
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="pt-7">
              <h3 className="text-4xl font-medium tracking-[-0.03em] text-neutral-950">OASIS</h3>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-neutral-600">
                OASIS is our enterprise social operations platform, bringing advanced social listening and communications management to corporations and public agencies.
              </p>
              <StoryLink href="https://oasis.usatii.com/">Explore OASIS</StoryLink>
            </div>
          </article>

          <div className="space-y-14">
            {sideStories.map((story) => (
              <article key={story.title}>
                <div className="relative aspect-square overflow-hidden bg-white">
                  <Image
                    src={story.image}
                    alt={`${story.title} identity`}
                    fill
                    sizes="(min-width: 1024px) 28vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-medium tracking-[-0.025em] text-neutral-950">{story.title}</h3>
                  <p className="mt-3 text-base leading-7 text-neutral-600">{story.description}</p>
                  <StoryLink href={story.href}>{story.cta}</StoryLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
