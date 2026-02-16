"use client";

import React from "react";
import { motion } from "framer-motion";
import Footer from "@/app/_components/footer";

export default function Page() {
  const ACCENT = "#F97316"; // match usatii.com
  const ACCENT2 = "#A855F7"; // optional

  return (
    <div
      style={{ "--accent": ACCENT, "--accent2": ACCENT2 }}
      className="min-h-screen bg-white text-zinc-950"
    >
      {/* subtle bg */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),transparent_35%,rgba(0,0,0,0.03))]" />
      </div>

      {/* header */}
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="/" className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight italic">USATII MEDIA</span>
            <span className="text-xs text-zinc-500">/ Editor / Changelog</span>
          </a>

          <div className="flex items-center gap-2 text-sm">
            <a
              href="/editor"
              className="rounded-xl px-3 py-1.5 font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Overview
            </a>
            <a
              href="/editor/changelog"
              className="rounded-xl px-3 py-1.5 font-semibold text-zinc-950 hover:bg-zinc-100"
            >
              Changelog
            </a>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        {/* top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Changelog</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            Track our progress as we continue to update Usatii Media's flagship editing product.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
            >
              Purchase (coming soon)
            </a>
          </div>
        </motion.div>

        {/* list */}
        <div className="mt-10 space-y-10">
          {/* v1.0.3 */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pt-8 border-t border-zinc-200"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-zinc-950">v1.0.3</span>
                <span className="text-xs text-zinc-500">February 16, 2026</span>
              </div>
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-700">
                Performance
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <ul className="space-y-2 text-sm leading-relaxed text-zinc-800">
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-emerald-700">+</span>
                  <span>Startup time cut ~35%.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-amber-700">~</span>
                  <span>Export pipeline stabilization (fewer freezes in long sessions).</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-amber-700">~</span>
                  <span>Smoother UI on large projects (less jank in panels).</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-rose-700">!</span>
                  <span>Fixed focus bug when opening recent projects.</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* v1.0.2 */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pt-8 border-t border-zinc-200"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-zinc-950">v1.0.2</span>
                <span className="text-xs text-zinc-500">February 10, 2026</span>
              </div>
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-700">
                Fixes
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <ul className="space-y-2 text-sm leading-relaxed text-zinc-800">
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-emerald-700">+</span>
                  <span>Better keyboard navigation in panels.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-rose-700">!</span>
                  <span>Fixed shortcut collisions inside text inputs.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-amber-700">~</span>
                  <span>Cleaner export defaults.</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* v1.0.0 */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pt-8 border-t border-zinc-200"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-zinc-950">v1.0.0</span>
                <span className="text-xs text-zinc-500">February 1, 2026</span>
              </div>
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-700">
                Launch
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <ul className="space-y-2 text-sm leading-relaxed text-zinc-800">
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-emerald-700">+</span>
                  <span>Initial public release.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-emerald-700">+</span>
                  <span>Local-first projects.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[12px] text-emerald-700">+</span>
                  <span>Minimal editing surface + deterministic exports.</span>
                </li>
              </ul>
            </div>
          </motion.section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
