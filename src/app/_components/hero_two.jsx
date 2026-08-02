import Link from "next/link";
import { ArrowRight } from "lucide-react";

const capabilities = [
  { title: "Content strategy", body: "Brand principles, operating playbooks, and calendars designed for sustained output." },
  { title: "Editing and refinement", body: "Raw footage and drafts shaped into clear, high-converting creative work." },
  { title: "Content distribution", body: "Consistent publishing and cross-channel distribution without operational drag." },
  { title: "Performance analysis", body: "Useful measurement, working sessions, and decisions grounded in actual results." },
];

const systems = [
  { title: "Call routing and PBX operations", description: "Controlled routing, extensions, software phones, voicemail, and AI-assisted summaries for organizations with complex intake.", src: "/CallCenter_DEMO.mp4", alt: "Call center routing demo" },
  { title: "Materials inventory system", description: "A custom internal portal for inventory, jobs, requests, assets, and operational activity—owned by the organization using it.", src: "/Inventory_DEMO.mp4", alt: "Materials inventory system demo" },
];

export default function HeroTwo() {
  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="border-t border-neutral-200 pt-8">
          <h2 className="max-w-4xl text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">Marketing systems that compound.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Our creative roots inform a disciplined operating model for strategy, production, distribution, and learning.</p>
        </div>
        <div className="mt-14 grid border-t border-neutral-200 md:grid-cols-2">
          {capabilities.map((item, index) => (
            <article key={item.title} className={`border-b border-neutral-200 py-8 md:min-h-52 ${index % 2 === 0 ? "md:pr-10" : "md:border-l md:pl-10"}`}>
              <p className="text-sm tabular-nums text-neutral-400">0{index + 1}</p>
              <h3 className="mt-8 text-2xl font-medium tracking-[-0.02em] text-neutral-950">{item.title}</h3>
              <p className="mt-3 max-w-md text-base leading-7 text-neutral-600">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-28 border-t border-neutral-200 pt-8">
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
