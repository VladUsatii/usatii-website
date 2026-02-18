"use client";
import { motion } from "framer-motion";
import React from "react";
import Footer from "../_components/footer";

export default function Page() {
  return (
    <div
      style={{ "--accent":  "#F97316", "--accent2": "#A855F7" }}
      className="min-h-screen bg-white text-zinc-950"
    >
      {/* background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),transparent_35%,rgba(0,0,0,0.03))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(0,0,0,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* header */}
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="/" className="flex items-center gap-2">
            <span className="text-sm font-black italic tracking-tight">USATII MEDIA</span>
            <span className="text-xs text-zinc-500">/ Editor</span>
          </a>

          <div className="flex items-center gap-2 text-sm">
            <a
              href="/editor"
              className="rounded-xl px-3 py-1.5 font-semibold text-zinc-950 hover:bg-zinc-100"
            >
              Overview
            </a>
            <a
              href="/editor/changelog"
              className="rounded-xl px-3 py-1.5 font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Changelog
            </a>
            <a
              href="#download"
              className="rounded-xl bg-zinc-950 px-3 py-1.5 font-semibold text-white hover:opacity-90"
            >
              Purchase
            </a>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        {/* hero */}
        <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >

            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              The world's first{" "}
              <span className="bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent2)] bg-clip-text text-transparent">
                text-powered
              </span> video editor.
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg">
                No editing skills required.<br />If you can dream it, you can edit it.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#download"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
              >
                Purchase for macOS
                <span className="transition group-hover:translate-x-0.5">→</span>
              </a>

              <a
                href="#download"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white shadow-lg px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:shadow-md"
              >
                See a demo
                <span className="transition group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </motion.div>

          {/* screenshot */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[color:var(--accent)]/20 to-[color:var(--accent2)]/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    </div>
                    <span className="ml-2 text-xs font-medium text-zinc-600">AI clip generation</span>
                  </div>
                  <span className="text-xs text-zinc-500">⌘K</span>
                </div>

                <div className="p-4">
                  {/* Replace this placeholder with a real image/video */}
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.14),transparent_40%)]" />
                    <div className="relative p-4">
                      <div className="flex items-center justify-between flex-row w-full">
                      <video width="240" height="320" className="rounded-[10px]" controls={false} autoPlay={true} loop>
                        <source src="/profit_example.mp4" type="video/mp4" />
                        </video>
                      </div>
                      <div className="mt-4 grid gap-2">
                        <div className="h-2 w-[78%] rounded-full bg-zinc-200" />
                        <div className="h-2 w-[64%] rounded-full bg-zinc-200" />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="rounded-[10px] border border-zinc-200 bg-white/70 px-2 py-1 backdrop-blur">
                          <b>You asked: </b>Generate a clip of a circular graph getting smaller to represent profit loss. The initial graph should be green, blue graph background.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* features */}
        <section className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end justify-between gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight">What it’s for</h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                The point of editing is to turn your idea into elegant showmanship. Less friction between idea to output. So we built an editor that literally generates clips using AI.
              </p>
            </div>
          </motion.div>
        </section>

        {/* features */}
        <section className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end justify-between gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight">When does it launch?</h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                Soon! We want to make it work well for 99% of workflows before deploying it publicly. It'll probably be free for the first 50 people to download it. Then it'll retail for $19.99 per month with a cap of 100 generated animations.
              </p>
            </div>
          </motion.div>
        </section>

        {/* download */}
        <section id="download" className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 p-7 text-white shadow-sm">
            <div className="absolute -inset-24 bg-gradient-to-r from-[color:var(--accent)]/25 to-[color:var(--accent2)]/25 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="text-2xl font-semibold tracking-tight">Purchase <span className="tracking-tight italic font-black">USATII EDITOR</span> for macOS soon.</h2>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">Apple Silicon supported. Everything else is experimental.</span>
                </div>
              </div>

              <div className="lg:col-span-4 lg:justify-self-end">
                <a
                  href="#"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 shadow-sm transition hover:shadow-md"
                >
                  Purchase (coming soon)
                </a>
                <a
                  href="/editor/changelog"
                  className="mt-3 block text-center text-xs text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white"
                >
                  Read the changelog →
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
