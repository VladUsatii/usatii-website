"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const clips = [
  { src: "/case-studies/Tim1.jpeg", alt: "Tim Wijaya reel about Indonesians flying", views: "163K views" },
  { src: "/case-studies/Tim2.jpeg", alt: "Tim Wijaya reel about Indonesian startups", views: "85K views" },
  { src: "/case-studies/Tim3.jpeg", alt: "Tim Wijaya reel about startup copycats", views: "55K views" },
  { src: "/case-studies/Tim4.jpeg", alt: "Tim Wijaya reel about Indonesian technology", views: "247K views" },
];

export default function TimWorkCarousel() {
  const trackRef = useRef(null);

  function move(direction) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.72, behavior: "smooth" });
  }

  return (
    <figure className="my-12 min-w-0">
      <div className="mb-5 flex items-end justify-between gap-5 border-t border-neutral-200 pt-5">
        <div>
          <p className="text-sm font-medium text-neutral-950">Short-form work for Tim Wijaya</p>
          <p className="mt-1 text-xs text-neutral-500">Published campaign results</p>
        </div>
        <div className="flex gap-2" aria-label="Tim Wijaya clips carousel controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous Tim Wijaya clips" className="grid h-9 w-9 place-items-center rounded-full border border-neutral-300 transition hover:bg-neutral-100"><ArrowLeft className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next Tim Wijaya clips" className="grid h-9 w-9 place-items-center rounded-full border border-neutral-300 transition hover:bg-neutral-100"><ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {clips.map((clip) => (
          <div key={clip.src} className="w-[68%] shrink-0 snap-start sm:w-[42%]">
            <div className="relative aspect-[738/1600] overflow-hidden rounded-sm bg-neutral-100">
              <Image src={clip.src} alt={clip.alt} fill sizes="(min-width: 640px) 280px, 68vw" className="object-cover" />
            </div>
            <p className="mt-2 text-xs font-medium text-neutral-950">{clip.views}</p>
          </div>
        ))}
      </div>

      <figcaption className="mt-4 text-xs leading-5 text-neutral-500">
        Our marketing software supported research, planning, production tracking, and iteration across Tim’s campaign; our team shaped the scripts, edited the published videos, and used performance data to inform what came next.
      </figcaption>
    </figure>
  );
}
