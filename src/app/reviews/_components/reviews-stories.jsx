"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Grid2X2, List, SlidersHorizontal } from "lucide-react";

const categories = ["All", "Software", "Marketing"];
const tones = {
  ink: "from-neutral-800 via-neutral-600 to-neutral-400",
  sage: "from-emerald-950/80 via-emerald-700/60 to-lime-100",
  clay: "from-orange-950/70 via-orange-400/60 to-amber-100",
  slate: "from-slate-900/80 via-slate-500/60 to-slate-200",
  sand: "from-stone-600 via-stone-300 to-amber-50",
  stone: "from-neutral-700 via-neutral-300 to-stone-100",
  blue: "from-sky-950/80 via-sky-500/60 to-cyan-100",
};

const sideStories = [
  { id: "side-1", tone: "stone" },
  { id: "side-2", tone: "blue" },
  { id: "side-3", tone: "sand" },
];

const archiveStories = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  category: index % 2 === 0 ? "Software" : "Marketing",
  tone: ["ink", "sage", "clay", "slate", "sand", "stone", "blue"][index % 7],
}));

function PlaceholderImage({ tone, large = false }) {
  return (
    <div className={`relative grid overflow-hidden rounded-sm bg-gradient-to-br ${tones[tone]} ${large ? "aspect-[16/9]" : "aspect-square"}`}>
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.22)_50%,transparent_70%)]" />
      <span className="relative place-self-center text-[11px] font-medium tracking-[0.08em] text-white/80">CUSTOMER STORY IMAGE</span>
    </div>
  );
}

function StoryText({ featured = false, list = false, category = "Category" }) {
  return (
    <>
      <h2 className={featured
        ? "mt-5 max-w-2xl text-4xl font-normal leading-[1.03] tracking-[-0.045em] sm:text-5xl lg:text-[3.45rem]"
        : `${list ? "mt-0 text-xl sm:text-2xl" : "mt-4 text-base"} font-medium leading-[1.15] tracking-[-0.025em]`
      }>
        {featured ? "Featured customer story title placeholder" : "Customer story title placeholder"}
      </h2>
      <p className={`${featured ? "mt-5" : "mt-3"} text-xs text-neutral-500`}>
        <span className="mr-3 font-medium text-neutral-900">{category}</span>
        Month 00, 2026
      </p>
    </>
  );
}

export default function ReviewsStories() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [view, setView] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(8);
  const [openMenu, setOpenMenu] = useState(null);

  const filteredStories = useMemo(() => {
    const matches = category === "All"
      ? archiveStories
      : archiveStories.filter((story) => story.category === category);
    return sort === "Newest" ? matches : [...matches].reverse();
  }, [category, sort]);

  const visibleStories = filteredStories.slice(0, visibleCount);

  function chooseCategory(nextCategory) {
    setCategory(nextCategory);
    setVisibleCount(8);
    setOpenMenu(null);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
      <h1 className="text-5xl font-normal tracking-[-0.055em] sm:text-6xl">Stories</h1>

      <div className="mt-8 flex flex-col gap-7 border-b border-neutral-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex items-center gap-7 text-sm" aria-label="Story categories">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => chooseCategory(item)}
              aria-pressed={category === item}
              className={category === item ? "font-medium text-neutral-950" : "text-neutral-500 transition hover:text-neutral-950"}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-xs font-medium">
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5"
              aria-expanded={openMenu === "filter"}
              onClick={() => setOpenMenu(openMenu === "filter" ? null : "filter")}
            >
              Filter <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>
            {openMenu === "filter" && (
              <div className="absolute right-0 top-7 z-20 min-w-36 rounded-md border border-neutral-200 bg-white p-1.5 shadow-lg">
                {categories.map((item) => (
                  <button key={item} type="button" onClick={() => chooseCategory(item)} className="flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-neutral-100">
                    {item}{category === item && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5"
              aria-expanded={openMenu === "sort"}
              onClick={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
            >
              Sort <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {openMenu === "sort" && (
              <div className="absolute right-0 top-7 z-20 min-w-36 rounded-md border border-neutral-200 bg-white p-1.5 shadow-lg">
                {["Newest", "Oldest"].map((item) => (
                  <button key={item} type="button" onClick={() => { setSort(item); setOpenMenu(null); }} className="flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-neutral-100">
                    {item}{sort === item && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="h-4 w-px bg-neutral-200" aria-hidden="true" />
          <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={view === "grid" ? "text-neutral-950" : "text-neutral-300 hover:text-neutral-600"}><Grid2X2 className="h-4 w-4" /></button>
          <button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={view === "list" ? "text-neutral-950" : "text-neutral-300 hover:text-neutral-600"}><List className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-12 grid gap-16 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-7">
        <article><PlaceholderImage tone="blue" large /><StoryText featured /></article>
        <aside className="grid gap-14 sm:grid-cols-3 lg:grid-cols-1 lg:gap-16" aria-label="More featured stories">
          {sideStories.map((story) => <article key={story.id}><PlaceholderImage tone={story.tone} /><StoryText /></article>)}
        </aside>
      </div>

      <div className={view === "grid"
        ? "mt-32 grid gap-x-7 gap-y-20 sm:grid-cols-2 lg:mt-40 lg:grid-cols-4"
        : "mt-32 grid gap-10 lg:mt-40"
      }>
        {visibleStories.map((story) => (
          <article key={story.id} className={view === "list" ? "grid items-start gap-6 border-t border-neutral-200 pt-6 sm:grid-cols-[15rem_1fr]" : ""}>
            <PlaceholderImage tone={story.tone} />
            <div><StoryText list={view === "list"} category={story.category} /></div>
          </article>
        ))}
      </div>

      <div className="mt-20 min-h-10 text-center lg:mt-24">
        {visibleCount < filteredStories.length && (
          <button type="button" onClick={() => setVisibleCount((count) => count + 8)} className="rounded-full bg-neutral-950 px-6 py-3 text-xs font-medium text-white transition hover:bg-neutral-700">
            Load more
          </button>
        )}
      </div>
    </section>
  );
}
