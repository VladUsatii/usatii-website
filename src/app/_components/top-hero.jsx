"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

function HeroVideoBackground() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/usatii-media-banner-backdrop-poster.jpg"
        aria-hidden="true"
      >
        <source
          src="/media/usatii-media-banner-backdrop.d9f2e409.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <HeroVideoBackground />

      <div className="pointer-events-none relative z-20 mx-auto max-w-7xl px-6">
        <div className="flex min-h-[34rem] flex-col items-center justify-center gap-y-8 py-28 text-center md:min-h-[44rem] md:py-40">
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.34)] md:text-7xl">
            We build <span className="text-purple-200">systems</span> that power{" "}
            <u>marketing</u> & <u>operations</u>.
          </h1>

          <div className="pointer-events-auto flex flex-row flex-wrap justify-center gap-3 pt-2">
            <Link id="book" href="https://cal.com/usatii/onboarding" target="_blank">
              <Button className="cursor-pointer rounded-full border border-white/25 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_28%),linear-gradient(135deg,#d946ef_0%,#a855f7_48%,#7c3aed_100%)] px-7 py-6 text-lg font-bold text-white shadow-[inset_0.35em_0.25em_0.8em_rgba(255,255,255,0.22),inset_-0.45em_-0.35em_0.9em_rgba(67,0,142,0.32),0_18px_45px_rgba(126,34,206,0.42)] transition hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[inset_0.35em_0.25em_0.8em_rgba(255,255,255,0.25),inset_-0.45em_-0.35em_0.9em_rgba(67,0,142,0.3),0_22px_55px_rgba(126,34,206,0.5)]">
                Book a call
              </Button>
            </Link>

            <Link id="casestudies" href="/case-studies" target="_blank">
              <Button className="cursor-pointer rounded-full border border-white/45 bg-white/12 px-7 py-6 text-lg font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-white/20 hover:text-white">
                Read case studies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
