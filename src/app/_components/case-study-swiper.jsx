"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const caseStudies = [
  { title: "@chrisstocksofficial", subtitle: "Creator", date: "2023–2024", link: "https://instagram.com/chrisstocksofficial", metrics: ["10% engagement-rate increase in 90 days", "5+ qualified UGC leads worth over $30K", "95% viewer retention beyond five seconds"] },
  { title: "Rich & Pour Teas", subtitle: "California tea distributor", date: "2023", link: "https://richandpour.com", metrics: ["Organic audience growth in 60 days", "50+ qualified leads sourced through Instagram", "A repeatable content and distribution system"] },
  { title: "@hamishnewtonvesty", subtitle: "Creator", date: "2024", link: "https://instagram.com/hamishnewtonvesty", metrics: ["2× organic growth in 30 days", "10+ qualified UGC leads delivered to the inbox", "3,500 new followers"] },
];

export default function CaseStudySwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = caseStudies[activeIndex];
  const move = (direction) => setActiveIndex((index) => (index + direction + caseStudies.length) % caseStudies.length);

  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl border-t border-neutral-200 pt-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">Selected case studies</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">A few examples of focused systems producing measurable outcomes.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="mr-2 text-sm tabular-nums text-neutral-500">{String(activeIndex + 1).padStart(2, "0")} / {String(caseStudies.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => move(-1)} aria-label="Previous case study" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 transition hover:bg-neutral-100"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next case study" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 transition hover:bg-neutral-100"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
        <article className="mt-12 grid border-t border-neutral-200 py-10 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] md:gap-16 lg:py-14">
          <div>
            <p className="text-sm text-neutral-500">{active.subtitle} · {active.date}</p>
            <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-neutral-950 sm:text-5xl">{active.title}</h3>
          </div>
          <div className="mt-10 md:mt-0">
            <ul className="space-y-0">
              {active.metrics.map((metric) => <li key={metric} className="border-t border-neutral-200 py-4 text-base leading-7 text-neutral-700 first:border-t-0 first:pt-0">{metric}</li>)}
            </ul>
            <a href={active.link} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 hover:text-violet-700">View work <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </article>
      </div>
    </section>
  );
}
