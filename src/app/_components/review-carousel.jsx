"use client";

import { useState } from "react";

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

  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">What founders are saying</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">A selection of feedback from teams and creators we have supported.</p>

        <div className="mt-10 overflow-x-auto border-b border-neutral-200">
          <div className="flex min-w-max gap-7" role="tablist" aria-label="Founder testimonials">
            {reviews.map((review, index) => (
              <button key={`${review.name}-${index}`} type="button" role="tab" aria-selected={index === activeIndex} onClick={() => setActiveIndex(index)} className={`border-b-2 pb-3 text-sm font-medium ${index === activeIndex ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-400 hover:text-neutral-700"}`}>
                {review.name}
              </button>
            ))}
          </div>
        </div>

        <article className="mt-8 grid min-h-[360px] bg-[#f7f7f5] p-7 sm:p-10 md:grid-cols-[1fr_260px] md:items-end lg:p-14">
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
