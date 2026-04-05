'use client'
import React from "react";
import { motion } from "framer-motion";

function AnalyticalBackdrop() {
  const paths = [
    "M0 150 C120 110, 180 190, 300 145 S510 85, 720 130 S930 210, 1200 120",
    "M0 245 C150 195, 240 290, 390 225 S620 140, 820 205 S1010 265, 1200 185",
    "M0 340 C135 300, 250 385, 420 325 S690 230, 885 290 S1040 345, 1200 300",
  ];


  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.45) 65%, transparent 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "220px 220px",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="traceA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(99,102,241,0)" />
            <stop offset="35%" stopColor="rgba(99,102,241,0.75)" />
            <stop offset="70%" stopColor="rgba(168,85,247,0.85)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </linearGradient>
          <linearGradient id="traceB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139,92,246,0)" />
            <stop offset="40%" stopColor="rgba(139,92,246,0.65)" />
            <stop offset="75%" stopColor="rgba(99,102,241,0.8)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </linearGradient>
        </defs>

        {paths.map((d, i) => (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke={i % 2 === 0 ? "url(#traceA)" : "url(#traceB)"}
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeDasharray="7 10"
            />
            <path
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>
        ))}

        {[120, 240, 360, 480, 600, 720, 840, 960, 1080].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1="0"
            x2={x}
            y2="700"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {[110, 220, 330, 440, 550, 660].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={y}
            x2="1200"
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
      </svg>

      <motion.div
        className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ x: [0, 24, -10, 0], y: [0, 18, 6, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"
        animate={{ x: [0, -18, 10, 0], y: [0, -26, -8, 0], scale: [1, 0.96, 1.05, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />
    </div>
  );
}

export default function WebsiteShowcase() {
  const sites = [
    {
      name: "Rebuildit Inc.",
      url: "https://www.rebuilditinc.com/",
      eyebrow: "Full Operations Platform",
      blurb:
        "A high-trust renovation/construction company in California that needed a full OS complete with compliance and security measures.",
      bullets: [
        "Service-heavy architecture for roofing, remodeling, ADUs, windows, and siding requests.",
        "Full operations platform to track paychecks, HR, inquiries, tasks, team work, and employee productivity.",
      ],
      metric: "Ops-heavy",
    },
    {
      name: "Resolution, Inc.",
      url: "https://www.resolutionmarketing.org/",
      eyebrow: "Growth / Creator Funnel",
      blurb:
        "A sharp acquisition site built for applications, qualification, and monetization-driven messaging.",
      bullets: [
        "Tight sections for offer clarity: what we do, how it works, fit, results, and apply.",
        "Designed to move qualified traffic into calls and applications with minimal friction.",
      ],
      metric: "Conversion-led",
    },
    {
      name: "Bishop3DO",
      url: "https://bishop-topaz.vercel.app/",
      eyebrow: "Product / Medtech",
      blurb:
        "A premium product site built to explain novel hardware, process, and credibility fast.",
      bullets: [
        "Structured around product education, scan-to-fit workflow, testimonials, and FAQs.",
        "Clean premium positioning for a custom 3D-printed knee brace with strong CTA flow.",
      ],
      metric: "Trust-first",
    },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_120px_rgba(2,6,23,0.45)]">
        <AnalyticalBackdrop />

        <div className="relative z-10 px-6 py-16 md:px-10 lg:px-12">
          <div className="mb-12 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55 }}
              className="mb-4 text-4xl font-medium leading-tight text-white md:text-5xl"
            >
              We build{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
                infrastructure
              </span>
              .
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="max-w-2xl text-lg leading-8 text-slate-300"
            >
              Landing pages, product/service sites, and operations infrastructure,
              complete with branching, ACLs, compliance measures, and logs for each decision.
            </motion.p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sites.map((site, index) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative"
              >
                <div className="absolute -inset-px rounded-[1.4rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-60 transition duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_35%)] opacity-80" />
                  <div className="relative">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                        {site.eyebrow}
                      </p>
                    </div>

                    <h3 className="mb-3 text-2xl font-bold text-white">{site.name}</h3>

                    <p className="mb-5 text-sm leading-7 text-slate-300">
                      {site.blurb}
                    </p>

                    <div className="space-y-3">
                      {site.bullets.map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                          <p className="text-sm leading-7 text-slate-200">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative mt-8 flex items-center justify-between gap-4">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full border border-indigo-300/20 bg-gradient-to-r from-indigo-300 to-purple-300 px-4 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:scale-[1.03]"
                    >
                      Visit site
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="relative mt-8 overflow-hidden "
          >

            <div className="relative flex flex-col gap-y-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Ready to use marketing to inform business operations?
                </h3>
              </div>

              <a
                href="/website-request"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-medium text-slate-950 transition duration-300 hover:scale-[1.03]"
              >
                Get a free consultation
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}