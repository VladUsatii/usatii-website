"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { GOOGLE_PLACE_URL, GOOGLE_REVIEWS } from "@/lib/google-reviews";

function Stars({ rating = 5 }) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      aria-label={`${rating} star review`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={20}
          strokeWidth={2}
          className={
            index < rating
              ? "fill-orange-500 text-orange-500"
              : "fill-neutral-200 text-neutral-200"
          }
        />
      ))}
    </div>
  );
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function shouldChangeReview(offset, velocity) {
  const swipe = Math.abs(offset) * Math.abs(velocity);
  return swipe > 7000;
}

export default function GoogleReviewGrid() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 1]);

  const activeReview = GOOGLE_REVIEWS[activeIndex];
  const reviewCount = GOOGLE_REVIEWS.length;
  const averageRating = (
    GOOGLE_REVIEWS.reduce((sum, review) => sum + (review.rating ?? 0), 0) / reviewCount
  ).toFixed(1);

  function goPrevious() {
    setActiveIndex(([current]) => [
      current === 0 ? GOOGLE_REVIEWS.length - 1 : current - 1,
      -1,
    ]);
  }

  function goNext() {
    setActiveIndex(([current]) => [
      current === GOOGLE_REVIEWS.length - 1 ? 0 : current + 1,
      1,
    ]);
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex(([current]) => [
        current === GOOGLE_REVIEWS.length - 1 ? 0 : current + 1,
        1,
      ]);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 72 : -72,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -72 : 72,
      opacity: 0,
    }),
  };

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 text-black sm:py-28 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-neutral-200" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-neutral-200" />
      <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-12 -z-10 h-[360px] w-[360px] rounded-full bg-neutral-200/70 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.35fr] lg:items-center">
        <div>

          <h3 className="max-w-xl text-4xl font-base tracking-tight text-neutral-950 sm:text-5xl">
            Trusted by operators building enterprise workflows.
          </h3>

          <p className="mt-6 max-w-xl text-base leading-7 text-neutral-700 sm:text-lg">
            Business owners and celebrities consistently rely on Usatii to build robust,
            internal operations and marketing tools.
          </p>

          <div className="mt-9 mx-auto grid max-w-md grid-cols-2 overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm lg:mx-0">
            <div className="flex min-h-[112px] flex-col items-center justify-center px-5 text-center">
              <div className="text-4xl font-semibold leading-none tracking-tight text-neutral-950">
                {averageRating}
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                STARS
              </p>
            </div>

            <div className="flex min-h-[112px] flex-col items-center justify-center border-l border-neutral-200 px-5 text-center">
              <div className="text-4xl font-semibold leading-none tracking-tight text-neutral-950">
                {reviewCount}
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                REVIEWS
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center">
            <a
              href={GOOGLE_PLACE_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              View us on Google
            </a>
          </div>
        </div>

        <div className="relative h-[430px] overflow-hidden rounded-[2.25rem] border border-neutral-200 bg-neutral-950 p-2 shadow-2xl shadow-neutral-950/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.35),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_30%)]" />

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.article
              key={activeReview.name}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 240, damping: 30 },
                opacity: { duration: 0.18 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (!shouldChangeReview(info.offset.x, info.velocity.x)) return;

                if (info.offset.x > 0) {
                  goPrevious();
                } else {
                  goNext();
                }
              }}
              className="absolute inset-2 z-10 cursor-grab overflow-hidden rounded-[1.85rem] bg-white p-7 active:cursor-grabbing sm:p-9"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                    {initials(activeReview.name)}
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-lg font-semibold tracking-tight text-neutral-950">
                      {activeReview.name}
                    </h4>
                    <p className="mt-0.5 truncate text-sm text-neutral-500">
                      {activeReview.meta}
                    </p>
                    {activeReview.posted ? (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                        {activeReview.posted}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  <Stars rating={activeReview.rating} />
                </div>
              </div>

              <p className="mt-10 max-w-2xl text-2xl font-medium leading-snug tracking-tight text-neutral-950 sm:text-3xl">
                “{activeReview.text}”
              </p>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
