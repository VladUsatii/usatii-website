"use client";

import { useState } from "react";

const VIDEOS = [
  ["Chris Stocks", "1111406856"],
  ["Spectres", "1111404306"],
  ["Bigbrain", "1111404009"],
  ["Airbo", "1111402315"],
  ["USATII", "1111401934"],
  ["KALM", "1111401779"],
  ["James", "1111401393"],
  ["The CPA Dude", "1111411624"],
].map(([title, videoId]) => ({ title, videoId }));

export default function DemoGridWithLiveVideo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = VIDEOS[activeIndex];

  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">Content is king.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
          Selected short-form work from the content systems that shaped USATII.
        </p>

        <div className="mt-10 overflow-x-auto border-b border-neutral-200">
          <div className="flex min-w-max gap-7" role="tablist" aria-label="Video previews">
            {VIDEOS.map((video, index) => (
              <button
                key={video.videoId}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`border-b-2 pb-3 text-sm font-medium transition ${index === activeIndex ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-400 hover:text-neutral-700"}`}
              >
                {video.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 bg-[#f7f7f5] p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div className="mx-auto w-full max-w-[480px] overflow-hidden bg-neutral-950">
            <div className="aspect-[9/16]">
              <iframe
                key={active.videoId}
                src={`https://player.vimeo.com/video/${active.videoId}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`${active.title} video preview`}
              />
            </div>
          </div>
          <div className="pb-2">
            <p className="text-sm text-neutral-500">Currently viewing</p>
            <h3 className="mt-2 text-3xl font-medium tracking-[-0.03em] text-neutral-950">{active.title}</h3>
            <p className="mt-4 text-base leading-7 text-neutral-600">Muted by default. Use the player controls when you want sound.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
