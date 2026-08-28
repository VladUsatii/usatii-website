"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Grid2X2, List } from "lucide-react";

const categories = ["All"];

const stories = [
  {
    title: "Introducing digital business cards",
    category: "Product",
    date: "Aug 28, 2026",
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
          className="object-contain p-8 transition duration-500 group-hover:scale-[1.015] sm:p-10"
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
  const [listView, setListView] = useState(false);

  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-16 sm:px-7 lg:pb-36 lg:pt-20">
        <h1 className="text-[42px] font-medium leading-none tracking-[-0.045em] sm:text-[48px]">News</h1>

        <div className="mt-8 flex items-end justify-between gap-8 border-b border-neutral-200 pb-4">
          <nav className="-mb-4 flex min-w-0 flex-1 gap-6 overflow-x-auto pb-4 text-[14px] text-neutral-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="News categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className="shrink-0 cursor-pointer whitespace-nowrap font-medium text-neutral-950"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-5 pb-[1px] text-[12px] font-medium sm:flex">
            <div className="flex items-center gap-3" aria-label="View style">
              <button type="button" onClick={() => setListView(false)} aria-label="Grid view" className={listView ? "text-neutral-400" : "text-neutral-950"}>
                <Grid2X2 className="h-4 w-4" fill={listView ? "none" : "currentColor"} />
              </button>
              <button type="button" onClick={() => setListView(true)} aria-label="List view" className={listView ? "text-neutral-950" : "text-neutral-300"}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={listView ? "mt-8" : "mt-8 grid gap-x-5 gap-y-14 sm:grid-cols-2 md:grid-cols-3 lg:gap-x-6 lg:gap-y-16"}>
          {stories.map((story) => <StoryCard key={story.title} story={story} listView={listView} />)}
        </div>
      </section>
    </main>
  );
}
