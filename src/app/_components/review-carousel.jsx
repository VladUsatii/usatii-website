"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const reviews = [
  { name: "James K.", title: "Founder, KALM", quote: "It has been a year of incredible results. Post after post, we hit new highs I had never seen before. If you want good social media management, Vlad is your guy." },
  { name: "Chris B.", title: "Creator, @chrisstocksofficial", quote: "Vlad is incredible. His quality is out of the park, he is always available, and the guy knows how to get views." },
  { name: "Startup director", title: "Director, venture-backed startup", quote: "Vlad’s strategy helped us scale past our social-media bottlenecks. The systems gave the team a much stronger operating rhythm." },
  { name: "Entertainment team", title: "Celebrity management group", quote: "Vlad is dialed in. He handles hundreds of uploads per month and built organic systems that materially improved engagement." },
  { name: "Tony Hoong", title: "Founder, The CPA Dude", quote: "Sick edits. Good job here—I like how you handled these styles." },
];

export default function ReviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = reviews[activeIndex];
  const move = (direction) => setActiveIndex((index) => (index + direction + reviews.length) % reviews.length);

  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 border-t border-neutral-200 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">What founders are saying</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Feedback from teams and creators we have supported.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3" aria-label="Review controls">
            <span className="mr-2 text-sm tabular-nums text-neutral-500">{String(activeIndex + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => move(-1)} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 text-neutral-900 transition hover:bg-neutral-100"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 text-neutral-900 transition hover:bg-neutral-100"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>

        <article className="mt-12 grid min-h-[340px] border-t border-neutral-200 bg-white py-10 md:grid-cols-[1fr_260px] md:items-end lg:py-14">
          <blockquote className="max-w-3xl text-3xl font-normal leading-[1.3] tracking-[-0.03em] text-neutral-950 sm:text-4xl">“{active.quote}”</blockquote>
          <div className="mt-10 md:mt-0 md:text-right">
            <p className="font-semibold text-neutral-950">{active.name}</p>
            <p className="mt-1 text-sm text-neutral-500">{active.title}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
