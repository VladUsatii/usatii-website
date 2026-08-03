"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const videos = [
  ["Chris Stocks", "1111406856"],
  ["Spectres", "1111404306"],
  ["Bigbrain", "1111404009"],
  ["Airbo", "1111402315"],
  ["USATII", "1111401934"],
  ["KALM", "1111401779"],
  ["James", "1111401393"],
  ["The CPA Dude", "1111411624"],
].map(([title, videoId]) => ({
  title,
  src: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`,
}));

export default function DemoGridWithLiveVideo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = videos[activeIndex];
  const move = (direction) => setActiveIndex((index) => (index + direction + videos.length) % videos.length);

  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">Selected content from our marketing work.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Real published content built with our marketing software and edited by our team.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3" aria-label="Content preview controls">
            <span className="mr-2 text-sm tabular-nums text-neutral-500">{String(activeIndex + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => move(-1)} aria-label="Previous video" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 text-neutral-900 transition hover:bg-neutral-100"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next video" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 text-neutral-900 transition hover:bg-neutral-100"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="mt-10 grid min-h-[420px] gap-8 border-t border-neutral-200 bg-white py-8 md:grid-cols-[300px_minmax(0,1fr)] md:items-end lg:grid-cols-[340px_minmax(0,1fr)] lg:py-10">
          <div className="h-[380px] overflow-hidden bg-neutral-950 sm:h-[420px]">
            <iframe key={active.src} src={active.src} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={`${active.title} short-form video`} />
          </div>
          <div className="pb-2 md:max-w-md">
            <p className="text-sm text-neutral-500">Currently viewing</p>
            <h3 className="mt-2 text-3xl font-medium tracking-[-0.03em] text-neutral-950">{active.title}</h3>
            <p className="mt-4 text-base leading-7 text-neutral-600">Selected short-form work. Muted by default.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
