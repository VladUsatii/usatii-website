"use client";

import { useState } from "react";

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

  return (
    <section className="bg-[#f7f7f5] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">How we compare</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Choose an alternative to compare its operating model with USATII.</p>

        <div className="mt-10 overflow-x-auto border-b border-neutral-300">
          <div className="flex min-w-max gap-7" role="tablist" aria-label="Comparison alternatives">
            {alternatives.map((alternative, index) => (
              <button key={alternative.name} type="button" role="tab" aria-selected={index === activeIndex} onClick={() => setActiveIndex(index)} className={`border-b-2 pb-3 text-sm font-medium ${index === activeIndex ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-400 hover:text-neutral-700"}`}>
                {alternative.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid bg-white md:grid-cols-[180px_1fr_1fr]">
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
