"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EventsCarousel({ events }) {
  const scroller = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || events.length < 2) return;
    const timer = window.setInterval(() => {
      const node = scroller.current;
      if (!node) return;
      const card = node.firstElementChild;
      const step = (card?.getBoundingClientRect().width || 320) + 28;
      const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - step / 2;
      node.scrollTo({ left: atEnd ? 0 : node.scrollLeft + step, behavior: "smooth" });
    }, 4600);
    return () => window.clearInterval(timer);
  }, [events.length, paused]);

  return (
    <section id="events" className="overflow-hidden bg-white px-6 py-24 text-neutral-950 lg:px-8" aria-labelledby="events-heading">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-8">
          <div className="max-w-4xl">
            <h2 id="events-heading" className="text-4xl font-medium leading-tight tracking-[-0.035em] sm:text-6xl">Where to find Usatii.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">We show up where technology, operations, and ambitious regional businesses meet.</p>
          </div>
          <Link href="/events" className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-neutral-950 hover:text-violet-700 sm:flex">View all events <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div
          ref={scroller}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="mt-16 flex snap-x snap-mandatory gap-7 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} className="group w-[84vw] max-w-[440px] shrink-0 snap-start sm:w-[46vw] lg:w-[38%]">
              <div className={`relative aspect-[4/3] overflow-hidden grayscale ${event.imageStyle === "dark" ? "bg-neutral-900" : "bg-neutral-100"}`}>
                <Image
                  src={event.image}
                  alt={event.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 46vw, 84vw"
                  className={`${event.imageStyle === "cover" ? "object-cover" : "object-contain p-[14%]"} transition duration-500 group-hover:scale-[1.015]`}
                />
              </div>
              <div className="pt-6">
                <h3 className="text-2xl font-medium leading-tight tracking-[-0.025em] text-neutral-950">{event.shortTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{event.dateLabel} · {event.location}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 group-hover:text-violet-700">Event details <ArrowUpRight className="h-4 w-4" /></p>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/events" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 sm:hidden">View all events <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
