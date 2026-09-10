"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, Check, Grid2X2, List } from "lucide-react";

const stories = [
  {
    title: "The age of automation is among us.",
    category: "Company",
    date: "Sep 10, 2026",
    dateValue: "2026-09-10",
    image: "/news/employee-wallet-check-in.webp",
    imageFit: "cover",
    href: "/news/the-age-of-automation-is-among-us",
  },
  {
    title: "Building better intelligence tools for communication",
    category: "Company",
    date: "Sep 2, 2026",
    dateValue: "2026-09-02",
    image: "/news/marketing-team-collaboration.webp",
    imageFit: "cover",
    href: "/news/building-better-intelligence-tools-for-communication",
  },
  {
    title: "Introducing digital business cards",
    category: "Product",
    date: "Aug 28, 2026",
    dateValue: "2026-08-28",
    image: "/news/digital-business-card.webp",
    href: "/news/introducing-digital-business-cards",
  },
];

function StoryCard({ story, listView }) {
  return (
    <Link href={story.href} className={listView ? "group grid gap-5 border-t border-neutral-200 py-7 sm:grid-cols-[240px_1fr]" : "group block"}>
      <div className={listView ? "relative aspect-[4/3] overflow-hidden bg-neutral-100" : "relative aspect-square overflow-hidden bg-neutral-100"}>
        <Image
          src={story.image}
          alt=""
          fill
          sizes={listView ? "240px" : "(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"}
          className={`${story.imageFit === "cover" ? "object-cover" : "object-contain p-8 sm:p-10"} transition duration-500 group-hover:scale-[1.015]`}
        />
      </div>
      <div className={listView ? "self-end" : "pt-4"}>
        <h2 className="max-w-[30rem] text-[15px] font-medium leading-[1.28] tracking-[-0.012em] text-neutral-950 sm:text-[16px]">
          {story.title}
        </h2>
        <div className="mt-3 flex items-center gap-3 text-[11px] leading-none">
          <span className="font-medium text-neutral-950">{story.category}</span>
          <span className="text-neutral-500">{story.date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function NewsIndex() {
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [openMenu, setOpenMenu] = useState(null);
  const sortedStories = useMemo(() => [...stories].sort((a, b) => {
    const difference = new Date(b.dateValue).getTime() - new Date(a.dateValue).getTime();
    return sort === "newest" ? difference : -difference;
  }), [sort]);

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-16 sm:px-7 lg:pb-36 lg:pt-20">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-[42px] font-medium leading-none tracking-[-0.045em] sm:text-[48px]">News</h1>
          <Link href="/events" className="group flex items-center gap-4 text-base font-medium text-neutral-950">
            <span className="hidden sm:inline">See our upcoming events</span>
            <span className="sm:hidden">Upcoming events</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-9 flex justify-end gap-2 border-y border-neutral-200 py-4">
          <div className="relative">
            <button type="button" aria-label="Sort news" aria-haspopup="menu" aria-expanded={openMenu === "sort"} onClick={() => setOpenMenu(openMenu === "sort" ? null : "sort")} className="flex h-10 w-10 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950">
              <ArrowDownUp className="h-[18px] w-[18px]" />
            </button>
            {openMenu === "sort" && <div role="menu" className="absolute right-0 top-full z-20 mt-2 w-44 border border-neutral-200 bg-white p-1 shadow-lg">
              {[{ value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" }].map((option) => <button key={option.value} type="button" role="menuitem" onClick={() => { setSort(option.value); setOpenMenu(null); }} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-100">
                {option.label}{sort === option.value && <Check className="h-4 w-4" />}
              </button>)}
            </div>}
          </div>
          <div className="relative">
            <button type="button" aria-label="Change news view" aria-haspopup="menu" aria-expanded={openMenu === "view"} onClick={() => setOpenMenu(openMenu === "view" ? null : "view")} className="flex h-10 w-10 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950">
              {view === "grid" ? <Grid2X2 className="h-[18px] w-[18px]" /> : <List className="h-[19px] w-[19px]" />}
            </button>
            {openMenu === "view" && <div role="menu" className="absolute right-0 top-full z-20 mt-2 w-40 border border-neutral-200 bg-white p-1 shadow-lg">
              {[{ value: "grid", label: "Grid view", Icon: Grid2X2 }, { value: "list", label: "List view", Icon: List }].map(({ value, label, Icon }) => <button key={value} type="button" role="menuitem" onClick={() => { setView(value); setOpenMenu(null); }} className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-100">
                <Icon className="h-4 w-4" />{label}{view === value && <Check className="ml-auto h-4 w-4" />}
              </button>)}
            </div>}
          </div>
        </div>

        <div className={view === "list" ? "mt-8" : "mt-8 grid gap-x-5 gap-y-14 sm:grid-cols-2 md:grid-cols-3 lg:gap-x-6 lg:gap-y-16"}>
          {sortedStories.map((story) => <StoryCard key={story.title} story={story} listView={view === "list"} />)}
        </div>
      </section>
    </main>
  );
}
