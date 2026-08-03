"use client";

import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

const tileStyles = [
  "from-orange-300 via-red-500 to-rose-800",
  "from-sky-300 via-blue-600 to-blue-950",
  "from-indigo-300 via-indigo-600 to-slate-950",
  "from-violet-300 via-blue-600 to-indigo-950",
  "from-fuchsia-300 via-pink-500 to-rose-800",
  "from-emerald-200 via-emerald-600 to-green-950",
  "from-stone-300 via-zinc-600 to-neutral-950",
  "from-orange-200 via-amber-500 to-stone-800",
  "from-rose-200 via-pink-400 to-rose-700",
  "from-cyan-200 via-cyan-600 to-blue-950",
  "from-blue-300 via-violet-600 to-indigo-950",
  "from-lime-200 via-emerald-500 to-green-900",
];

function storyTitle(industry) {
  return `How ${industry.trade.toLowerCase()} teams can move faster with software built for their work`;
}

export default function IndustryStoriesGrid({ industries }) {
  const [query, setQuery] = useState("");
  const filteredIndustries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return industries;
    return industries.filter((industry) =>
      `${industry.trade} ${industry.title} ${industry.opening}`.toLowerCase().includes(normalized)
    );
  }, [industries, query]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-8 lg:pb-40">
      <div className="flex flex-col gap-6 border-b border-neutral-200 pb-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          Explore industries
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <label className="flex h-10 w-full items-center gap-2 rounded-sm border border-neutral-300 px-3 sm:w-96">
          <Search className="h-4 w-4 text-neutral-500" />
          <span className="sr-only">Search industries</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search industries"
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </label>
      </div>

      <div className="mt-16 grid gap-x-7 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
        {filteredIndustries.map((industry, index) => (
          <Link key={industry.slug} href={`/industries/${industry.slug}`} className="group block">
            <article>
              <div
                className={`grid aspect-square place-items-center overflow-hidden rounded-sm bg-gradient-to-br ${tileStyles[index % tileStyles.length]} px-6`}
              >
                <div className="text-center text-white drop-shadow-sm">
                  <p className="text-3xl font-semibold tracking-[-0.04em]">{industry.trade}</p>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/75">Operations</p>
                </div>
              </div>
              <h2 className="mt-5 text-base font-medium leading-snug tracking-[-0.02em] transition group-hover:text-violet-700">
                {storyTitle(industry)}
              </h2>
              <p className="mt-4 text-xs text-neutral-500">Industry guide</p>
            </article>
          </Link>
        ))}
      </div>

      {filteredIndustries.length === 0 && (
        <p className="py-24 text-center text-sm text-neutral-500">No industries match your search.</p>
      )}
    </section>
  );
}
