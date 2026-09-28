import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const builds = [
  { name: "DART", type: "Emergency management", image: "/news/dart.png", href: "/news/introducing-dart" },
  { name: "OASIS", type: "Social operations", image: "/home/press/oasis.webp", href: "https://oasis.usatii.com/" },
  { name: "REBUILDIT AI", type: "Construction operations", image: "/home/press/rebuildit-ai.webp", href: "https://www.rebuilditinc.com/" },
];

export default function FeaturedBuilds() {
  return (
    <section className="bg-white px-6 py-20 lg:px-8" aria-labelledby="featured-builds-title">
      <div className="mx-auto max-w-6xl">
        <h2 id="featured-builds-title" className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">Featured software builds</h2>
        <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6">
          {builds.map((build) => (
            <Link key={build.name} href={build.href} className="group w-[min(82vw,430px)] flex-none snap-start" aria-label={`Explore ${build.name}`}>
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <Image src={build.image} alt={`${build.name} product identity`} fill sizes="(min-width: 1024px) 430px, 82vw" className="object-cover object-center transition duration-500 group-hover:scale-[1.025]" />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div><p className="text-sm text-neutral-500">{build.type}</p><h3 className="mt-1 text-2xl font-medium text-neutral-950">{build.name}</h3></div>
                <ArrowUpRight className="mt-1 h-5 w-5 text-neutral-950" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
