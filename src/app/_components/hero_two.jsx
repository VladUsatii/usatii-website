import React from "react";
import Link from "next/link";
import { ArrowRight, Boxes, PhoneCall } from "lucide-react";

// components/HeroTwo.jsx
export default function HeroTwo() {
  const items = [
    ["Content strategy.",
      ["• Branding principles and SOPs to build your content library.",
       "• Content calendars for months of consistency."]
    ],
    ["Editing and refinement.",
      ["• Turning raw footage and drafts into high-converting creatives.",
       "• Optimizing headlines, hooks, and adding indirect CTAs to boost sales."]
    ],
    ["Content distribution.", ["• Scheduling and publishing at peak times.",
      "• Cross-posting to all socials."
    ]],
    ["Performance analysis.", ["• Tracking KPIs to measure content efficacy.", "• Providing actionable insights to refine strategy at stand-up meets."]],
  ];

  const systems = [
    {
      eyebrow: "Telecom infrastructure",
      title: "Call Routing & PBX Operations System",
      desc: "A cloud-hosted phone system for organizations that need controlled routing, extensions, software phones, voicemail, and AI summarization.",
      Icon: PhoneCall,
      href: "https://cal.com/usatii/onboarding",
      cta: "See case study",
      media: {
        type: "video",
        src: "/CallCenter_DEMO.mp4",
        alt: "Call center routing demo",
      },
      bullets: [
        "Configured Asterisk/PJSIP infrastructure.",
        "Our FDEs design IVR, queues, voicemail, and intake routing.",
      ],
    },
    {
      eyebrow: "Operations software",
      title: "Materials Inventory System",
      desc: "A custom internal portal for tracking inventory, jobs, requests, assets, and operational activity without relying on disconnected spreadsheets or subscription tools.",
      Icon: Boxes,
      href: "https://cal.com/usatii/onboarding",
      cta: "See case study",
      media: {
        type: "video",
        src: "/Inventory_DEMO.mp4",
        alt: "Materials inventory system demo",
      },
      bullets: [
        "Centralizes materials, equipment, records, requests, and status changes in one owned system.",
        "Supports role-based workflows, structured records, and cleaner operational visibility.",
        "Reduces software sprawl by replacing narrow admin workflows with custom internal tooling.",
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h3 className="font-bold text-4xl mb-2">How do we help most companies?</h3>
      <h3 className="font-medium text-2xl pb-8">Our roots were creative-first. We help businesses make <span className="text-green-600 transition animate-pulse">more money</span> with good marketing.</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map(([title, body]) => (
          <div
            key={title}
            className="
              hover:scale-103 transition
              relative
              overflow-hidden
              rounded-xl
              shadow-lg
            "
          >
            {/* 1) Blurred gradient background */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500
                filter blur-lg
                transform scale-110
              "
            />

            {/* 2) Content container (not blurred) */}
            <div className="relative p-6">
              <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
              {body.map((sub, i) => (
                <p key={i} className="text-sm text-white/90">{sub}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-bold text-4xl mb-2 mt-10">How do we make the biggest impact?</h3>
      <h3 className="font-medium text-2xl pb-8">We build systems for business operations and marketing that replace popular subscriptions to services like <u>Quo.com</u>, <u>Monday.com</u>, <u>oneclickcontractor.com</u>, and <u>Workday.com</u>.</h3>
      <div className="grid gap-6 md:grid-cols-2">
      {systems.map((system) => (
      <article
        key={system.title}
        className="
          group relative overflow-hidden rounded-[28px]
          border border-neutral-200 bg-white
          shadow-[0_18px_60px_-36px_rgba(0,0,0,0.35)]
          transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-42px_rgba(0,0,0,0.45)]
        "
      >
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-violet-100/60 blur-2xl" />

        <div className="relative flex h-full flex-col p-6">
          <div className="overflow-hidden rounded-[22px] border border-neutral-200 bg-neutral-50">
            {system.media.type === "video" ? (
              <video
                src={system.media.src}
                aria-label={system.media.alt}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="h-auto w-full bg-neutral-950"
              />
            ) : (
              <div className="grid gap-2 p-2 sm:grid-cols-2">
                {system.media.images.map((image) => (
                  <img
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    className="aspect-video w-full rounded-2xl border border-neutral-200 bg-white object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h4 className="text-2xl font-semibold tracking-tight text-neutral-950">
              {system.title}
            </h4>

            <p className="mt-3 text-sm leading-6 text-neutral-700">
              {system.desc}
            </p>
          </div>

          <ul className="mt-6 space-y-3">
            {system.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-3 text-sm leading-6 text-neutral-700"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-7">
            <Link
              href={system.href}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              {system.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
      ))}
    </div>
    </section>
  );
}
