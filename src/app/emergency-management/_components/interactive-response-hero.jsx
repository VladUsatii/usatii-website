"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const scenarios = [
  {
    id: "assessment",
    marker: "left-[20%] top-[49%]",
    label: "left-5 top-1/2 -translate-y-1/2",
    shortTitle: "Damage assessment",
    title: "Deploy qualified inspectors against current evidence.",
    preview: "Qualifications, training, credentials, availability, conflicts, and reviewed orders stay connected to the field assignment.",
    image: "/emergency-management/damage-assessment-closeup.webp",
    alt: "Prepared site inspection team documenting coastal storm damage from a response boat",
    situation: "Flooding has isolated coastal properties. Incident leadership needs a field team that can reach the area, document conditions, and return evidence without losing the assignment history.",
    workflow: [
      "Compare candidates against requested dates, position requirements, current training, credentials, availability, and existing orders.",
      "Route the deployment order through independent review and responder acceptance before mobilization.",
      "Keep observations, photographs, duty-station visits, and source records attached to the incident and assigned people.",
    ],
    outcome: "Command can see who was selected, why they were eligible, what they observed, and which evidence supported the deployment.",
  },
  {
    id: "logistics",
    marker: "left-[43%] top-[68%]",
    label: "left-5 top-1/2 -translate-y-1/2",
    shortTitle: "Logistics staging",
    title: "Account for resources from receipt through issue.",
    preview: "Supplies and equipment remain connected to locations, teams, custodians, deployment needs, and movement history.",
    image: "/emergency-management/logistics-staging-closeup.webp",
    alt: "Prepared logistics specialists accounting for emergency supplies at a coastal response staging area",
    situation: "A staging area is receiving supplies and deployable equipment from multiple sources. Teams need material quickly, but leadership still needs current custody, condition, and mission context.",
    workflow: [
      "Receive and inspect equipment against governed item records, categories, condition, and source events.",
      "Issue or transfer custody to an authorized responder, deployment, incident, or versioned team package.",
      "Block demobilization when linked equipment remains held or missing, and preserve independent loss-review decisions.",
    ],
    outcome: "The operation can move quickly without losing the record of what arrived, where it went, who holds it, and whether it returned ready for reuse.",
  },
  {
    id: "restoration",
    marker: "right-[9%] top-[24%]",
    label: "right-5 top-1/2 -translate-y-1/2 text-right",
    shortTitle: "Lifeline restoration",
    title: "Keep command and restoration teams aligned in the field.",
    preview: "Duty stations, supervisors, accountability checks, location history, equipment, and reports share one operational record.",
    image: "/emergency-management/restoration-coordination-closeup.webp",
    alt: "Utility supervisor and incident personnel coordinating infrastructure restoration beside prepared line crews",
    situation: "Utility crews are restoring a damaged transportation and power corridor while incident staff coordinate safe access, shift coverage, and responder accountability across duty stations.",
    workflow: [
      "Assign accepted responders to duty stations with current supervisors and a preserved deployment timeline.",
      "Schedule accountability checks, distinguish notices from actual replies, and escalate missed or expired responses.",
      "Save deployment status, time-at-location, equipment, and team-readiness reports with pinned rules and source records.",
    ],
    outcome: "Leaders receive a current operational picture while private details, role boundaries, and the history behind each status remain controlled.",
  },
];

export default function InteractiveResponseHero() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const activeScenario = selected === null ? null : scenarios[selected];
  const previewScenario = hovered === null ? null : scenarios[hovered];

  useEffect(() => {
    if (!activeScenario) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeScenario]);

  return (
    <>
      <section className="relative h-[78svh] min-h-[600px] w-full overflow-hidden bg-slate-900" aria-label="Explore emergency response software workflows">
        <Image
          src="/emergency-management/emergency-response-hero.webp"
          alt="Coordinated emergency response staging area with mobile command units, rescue boats, utility crews, and field logistics"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10" />

        {scenarios.map((scenario, index) => {
          const isHovered = hovered === index;
          return (
            <div key={scenario.id} className={`absolute z-10 ${scenario.marker}`}>
              <button
                type="button"
                aria-label={`Open ${scenario.shortTitle}`}
                aria-expanded={selected === index}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected(index)}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/40"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.22),0_2px_12px_rgba(0,0,0,0.5)] transition duration-300 group-hover:scale-125 group-hover:shadow-[0_0_0_10px_rgba(255,255,255,0.18),0_2px_16px_rgba(0,0,0,0.55)]" />
                <span
                  aria-hidden={!isHovered}
                  className={`pointer-events-none absolute ${scenario.label} hidden whitespace-nowrap text-sm font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] transition duration-300 sm:block ${isHovered ? "opacity-100" : "opacity-0"}`}
                >
                  {scenario.shortTitle}
                </span>
              </button>
            </div>
          );
        })}

        <div className="absolute inset-x-6 bottom-8 sm:inset-x-10 sm:bottom-12 lg:left-[max(2.5rem,calc((100vw-64rem)/2))] lg:right-[max(2.5rem,calc((100vw-64rem)/2))]">
          <div className="grid items-end gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
            <p className="max-w-3xl text-3xl font-medium leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
              {previewScenario ? previewScenario.title : "The operation should stay coordinated when the environment does not."}
            </p>
            <p className="max-w-lg text-sm leading-6 text-white/70 md:justify-self-end md:text-right">
              {previewScenario ? previewScenario.preview : "Explore the scene to see how people, resources, and decisions remain connected during a response."}
            </p>
          </div>
        </div>
      </section>

      {activeScenario && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black text-white" role="dialog" aria-modal="true" aria-label={activeScenario.title}>
          <div className="absolute inset-x-0 top-0 h-[58svh] lg:fixed lg:inset-0 lg:h-auto">
            <Image src={activeScenario.image} alt={activeScenario.alt} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10 lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.2)_56%,rgba(0,0,0,0.64)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <button
            type="button"
            onClick={() => setSelected(null)}
            className="fixed right-5 top-5 z-20 flex h-11 w-11 items-center justify-center text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white sm:right-8 sm:top-8"
            aria-label="Close case study"
            autoFocus
          >
            <X className="h-6 w-6" />
          </button>

          <article className="relative mx-auto grid min-h-screen max-w-7xl content-end gap-12 px-6 pb-24 pt-[52svh] sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.7fr)] lg:items-end lg:px-12 lg:pb-20 lg:pt-36">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-medium leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{activeScenario.title}</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">{activeScenario.situation}</p>
              <p className="mt-6 max-w-xl text-sm leading-6 text-white/55">{activeScenario.outcome}</p>
            </div>

            <div className="border-t border-white/30">
              {activeScenario.workflow.map((step, index) => (
                <div key={step} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-white/20 py-5">
                  <span className="text-xs tabular-nums text-white/40">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-6 text-white/80">{step}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5 lg:col-span-2">
              <button type="button" onClick={() => setSelected((selected + scenarios.length - 1) % scenarios.length)} className="flex h-10 w-10 items-center justify-center text-white/60 transition hover:text-white" aria-label="Previous scenario"><ArrowLeft className="h-5 w-5" /></button>
              <span className="text-xs tabular-nums text-white/45">{selected + 1} / {scenarios.length}</span>
              <button type="button" onClick={() => setSelected((selected + 1) % scenarios.length)} className="flex h-10 w-10 items-center justify-center text-white/60 transition hover:text-white" aria-label="Next scenario"><ArrowRight className="h-5 w-5" /></button>
            </div>
          </article>
        </div>
      )}
    </>
  );
}
