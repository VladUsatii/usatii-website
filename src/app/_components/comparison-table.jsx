"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const alternatives = [
  {
    name: "Traditional agency",
    values: ["Full-service contract", "$3–10k monthly fee", "8–15 assets monthly", "Manual-heavy execution", "Agency-hosted"],
  },
  {
    name: "All-in-one SaaS",
    values: ["Subscription toolbox", "$400–1k per service", "Basic templates", "Semi-automated", "Vendor-locked"],
  },
  {
    name: "Freelance / DIY",
    values: ["Disconnected tooling", "Costs internal time", "Inconsistent output", "Little automation", "You coordinate everything"],
  },
];

const metrics = ["System", "Ongoing cost", "Content output", "Automation", "Ownership"];
const usatii = ["Software + operating partnership", "Owned software with flexible support", "High-volume human-made content", "Workflow-level automation", "You own the IP"];

export default function ComparisonTable() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = alternatives[activeIndex];
  const move = (direction) => setActiveIndex((index) => (index + direction + alternatives.length) % alternatives.length);

  return (
    <section className="bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 border-t border-neutral-200 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">How we compare</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">A direct look at the operating models teams typically consider.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3" aria-label="Comparison controls">
            <span className="mr-2 text-sm tabular-nums text-neutral-500">{String(activeIndex + 1).padStart(2, "0")} / {String(alternatives.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => move(-1)} aria-label="Previous comparison" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 text-neutral-900 transition hover:bg-neutral-100"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next comparison" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 text-neutral-900 transition hover:bg-neutral-100"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="mt-12 grid border-t border-neutral-200 bg-white md:grid-cols-[180px_1fr_1fr]">
          <div className="hidden p-6 md:block" />
          <div className="p-6 text-xl font-medium text-violet-700">USATII</div>
          <div className="p-6 text-xl font-medium text-neutral-950">{active.name}</div>
          {metrics.map((metric, index) => (
            <div key={metric} className="contents">
              <div className="border-t border-neutral-200 p-5 text-sm font-medium text-neutral-500">{metric}</div>
              <div className="border-t border-neutral-200 p-5 text-base font-medium text-neutral-950">{usatii[index]}</div>
              <div className="border-t border-neutral-200 p-5 text-base text-neutral-600">{active.values[index]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
