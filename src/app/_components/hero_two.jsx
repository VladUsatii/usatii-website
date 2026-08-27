import Link from "next/link";
import { ArrowRight } from "lucide-react";

const systems = [
  { title: "Call routing and PBX operations", description: "Controlled routing, extensions, software phones, voicemail, and AI-assisted summaries for organizations with complex intake.", src: "/CallCenter_DEMO.mp4", alt: "Call center routing demo" },
  { title: "Materials inventory system", description: "A custom internal portal for inventory, jobs, requests, assets, and operational activity—owned by the organization using it.", src: "/Inventory_DEMO.mp4", alt: "Materials inventory system demo" },
];

export default function HeroTwo() {
  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="border-t border-neutral-200 pt-8">
          <h2 className="max-w-4xl text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">Software built around the operation.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Purpose-built systems replace fragmented subscriptions with infrastructure your organization can actually own.</p>
        </div>
        <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {systems.map((system) => (
            <article key={system.title} className="border-t border-neutral-200 pt-5">
              <video src={system.src} aria-label={system.alt} autoPlay loop muted playsInline preload="metadata" className="aspect-video w-full bg-neutral-100 object-cover" />
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.02em] text-neutral-950">{system.title}</h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-neutral-600">{system.description}</p>
              <Link href="https://cal.com/usatii/onboarding" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition hover:text-violet-700">Discuss a system <ArrowRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
