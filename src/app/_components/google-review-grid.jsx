"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GOOGLE_PLACE_URL, GOOGLE_REVIEWS } from "@/lib/google-reviews";

export default function GoogleReviewGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeReview = GOOGLE_REVIEWS[activeIndex];

  function move(direction) {
    setActiveIndex((current) => (current + direction + GOOGLE_REVIEWS.length) % GOOGLE_REVIEWS.length);
  }

  useEffect(() => {
    const interval = window.setInterval(() => move(1), 7000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-white px-6 py-24 text-neutral-950 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-normal tracking-[-0.035em] sm:text-6xl">
              Trusted by people building ambitious things.
            </h2>
          </div>
          <a href={GOOGLE_PLACE_URL} target="_blank" rel="noreferrer" className="w-fit text-sm font-medium text-neutral-600 hover:text-neutral-950">
            Read all Google reviews ↗
          </a>
        </div>

        <div className="mt-14 overflow-hidden border-t border-neutral-200 bg-white sm:grid sm:min-h-[570px] sm:grid-cols-[1.08fr_0.92fr]">
          <div className="relative flex min-h-[500px] flex-col justify-between border-b border-neutral-200 p-7 sm:min-h-0 sm:border-b-0 sm:border-r sm:p-12 lg:p-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-sm font-medium text-neutral-500">Verified Google review · {activeReview.rating}.0</p>
                <blockquote className="mt-14 max-w-2xl text-2xl font-normal leading-[1.35] tracking-[-0.025em] text-neutral-950 sm:text-3xl lg:text-[2.35rem]">
                  “{activeReview.text}”
                </blockquote>
              </motion.div>
            </AnimatePresence>

            <div className="mt-12">
              <p className="text-base font-semibold">{activeReview.name}</p>
              <p className="mt-1 text-sm text-neutral-500">{activeReview.role}</p>
            </div>
          </div>

          <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden bg-white p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview.image}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex h-[250px] w-[250px] items-center justify-center overflow-hidden bg-white p-5 sm:h-[300px] sm:w-[300px]"
              >
                <img src={activeReview.image} alt={`${activeReview.name} profile or brand`} className="h-full w-full object-contain" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              <button type="button" onClick={() => move(-1)} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
