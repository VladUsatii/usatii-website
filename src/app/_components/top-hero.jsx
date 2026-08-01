"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <section className="border-b border-surface bg-paper">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-accent">USATII MEDIA</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-tight text-ink md:text-7xl">
            We build systems that power marketing &amp; operations.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-muted">
            Custom software, websites, and growth systems designed around the way your business actually works.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link id="book" href="https://cal.com/usatii/onboarding" target="_blank" className="inline-flex h-11 items-center gap-2 rounded-mdx bg-accent px-5 text-sm font-semibold text-white shadow-soft hover:bg-accent-hover">
              Book a call
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link id="casestudies" href="/case-studies" className="inline-flex h-11 items-center rounded-mdx bg-surface px-5 text-sm font-semibold text-ink hover:bg-surface-strong">
              Read case studies
            </Link>
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-mdx border border-surface bg-canvas shadow-soft md:min-h-[500px]">
          <HeroVideoBackground />
        </div>
      </div>
    </section>
  );
}
