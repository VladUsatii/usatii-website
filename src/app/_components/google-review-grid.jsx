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
    <section className="w-full bg-neutral-950 px-6 py-24 text-white sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/55">Client perspective</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-normal tracking-[-0.035em] sm:text-6xl">
              Trusted by people building ambitious things.
            </h2>
          </div>
          <a href={GOOGLE_PLACE_URL} target="_blank" rel="noreferrer" className="w-fit text-sm font-medium text-white/65 hover:text-white">
            Read all Google reviews ↗
          </a>
        </div>

        <div className="mt-14 overflow-hidden border border-white/15 bg-black sm:grid sm:min-h-[570px] sm:grid-cols-[1.08fr_0.92fr]">
          <div className="relative flex min-h-[500px] flex-col justify-between border-b border-white/15 p-7 sm:min-h-0 sm:border-b-0 sm:border-r sm:p-12 lg:p-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-sm font-medium text-white/55">Verified Google review · {activeReview.rating}.0</p>
                <blockquote className="mt-14 max-w-2xl text-2xl font-normal leading-[1.35] tracking-[-0.025em] text-white sm:text-3xl lg:text-[2.35rem]">
                  “{activeReview.text}”
                </blockquote>
              </motion.div>
            </AnimatePresence>

            <div className="mt-12">
              <p className="text-base font-semibold">{activeReview.name}</p>
              <p className="mt-1 text-sm text-white/58">{activeReview.role}</p>
            </div>
          </div>

          <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_75%_18%,rgba(124,58,237,0.48),transparent_35%),linear-gradient(145deg,#17141e,#272332_52%,#584e72)] p-10">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:48px_48px]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview.image}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex h-[250px] w-[250px] items-center justify-center overflow-hidden bg-white p-5 shadow-2xl sm:h-[300px] sm:w-[300px]"
              >
                <img src={activeReview.image} alt={`${activeReview.name} profile or brand`} className="h-full w-full object-contain" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              <button type="button" onClick={() => move(-1)} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
