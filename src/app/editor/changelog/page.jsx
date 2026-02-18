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

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="space-y-6">
            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="unreleased"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Unreleased</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Working tree (not committed)
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                  2026-02-18
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>
                  Added internal Git-style project history: checkpoint manifests/snapshots,
                  change classification (<span className="font-mono text-xs">major</span> vs{" "}
                  <span className="font-mono text-xs">style</span>), and progress-pack export.
                </li>
                <li>
                  Added GPU preview architecture for macOS: engine factory + env override,
                  Qt Quick/QML preview surface, GPU media player pool, and adaptive
                  playback/layer policy.
                </li>
                <li>Added visual layout utilities for fit/crop/align/pivot/overlay math.</li>
                <li>
                  Updated main window, preview, timeline, imports, modification, project
                  IO/preferences/models for new preview/history flows.
                </li>
                <li>
                  Added tests for git history service/classifier, GPU playback policy,
                  preview engine factory, and visual layout.
                </li>
                <li>Updated docs with GPU preview setup/env vars.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-18"
              data-commit="78a5177"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-18</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  78a5177
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Added Face Focus tracking for video clips.</li>
                <li>Added transform keyframe engine and keyframe UI controls.</li>
                <li>Added settings window and expanded font assets.</li>
                <li>
                  Updated export/media/UI integration around preview/imports/modification/project
                  selection.
                </li>
                <li>Added tests for face focus and keyframe behavior.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-17"
              data-commit="c6b4721"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-17</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  c6b4721
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Added subtitle transcription pipeline.</li>
                <li>Added subtitle chunking, sidecar generation, and subtitle store services.</li>
                <li>Added proxy-generation path for preview/render flows.</li>
                <li>Updated model/IO/preferences/UI for subtitle workflows.</li>
                <li>Added tests for transcription/subtitle/proxy services.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-17"
              data-commit="6fd7035"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-17</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  6fd7035
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Added text layer foundations.</li>
                <li>Added SVG text builder service.</li>
                <li>Added export success/loading dialogs and macOS vibrancy support.</li>
                <li>Updated generation/export/project flow for caption-ready text clips.</li>
                <li>Added tests for text SVG builder and related model/export paths.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-16"
              data-commit="296d60d"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-16</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  296d60d
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>
                  Added generated media pipeline (“enterprise” flow): renderer, store, and
                  prompt builder services.
                </li>
                <li>Updated export/project/UI paths for generated media.</li>
                <li>Added generated media pipeline tests.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-16"
              data-commit="b15ed7f"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-16</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  b15ed7f
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Fixed preview bugs and improved playback/editing stability.</li>
                <li>Improved preferences/models/export behavior and connected UI flows.</li>
                <li>Expanded regression tests for preview/preferences/models/export.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-16"
              data-commit="24496bf"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-16</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  24496bf
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Revamped project selection UI.</li>
                <li>Added project store and window chrome structure.</li>
                <li>Updated main window/imports/modification/preview/timeline integration.</li>
                <li>Added project store and UI regression tests.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-16"
              data-commit="dba2d2f"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-16</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  dba2d2f
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Fixed split-audio regressions across timeline/preview/model behavior.</li>
                <li>Added/updated regression tests for these fixes.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-15"
              data-commit="44f4989"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-15</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  44f4989
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Added export dialog and export service.</li>
                <li>Improved modifications/settings behavior across UI.</li>
                <li>Added initial export tests and updated model/preferences tests.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-15"
              data-commit="e0fab98"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-15</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  e0fab98
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Added preferences system (model + persistence store).</li>
                <li>Added preferences and shortcuts dialogs.</li>
                <li>Updated commands/theme/project IO/main UI integration.</li>
                <li>Added tests for preferences and media catalog behavior.</li>
              </ul>
            </section>

            <section
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-version="2026-02-15"
              data-commit="ac325e2"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">2026-02-15</h3>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                  ac325e2
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Initial project scaffold created.</li>
                <li>Added core models, project IO, media catalog, generation service.</li>
                <li>Added four-pane editor UI (Imports, Preview, Modification, Timeline).</li>
                <li>Added baseline tests and packaging/config setup.</li>
              </ul>
            </section>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
