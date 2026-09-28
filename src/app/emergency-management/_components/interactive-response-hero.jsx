"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

const scenarios = [
  {
    id: "assessment",
    number: "01",
    marker: "left-[19%] top-[47%]",
    card: "left-0 top-10 sm:w-80",
    shortTitle: "Damage assessment",
    title: "Deploy qualified inspectors against current evidence.",
    preview:
      "Verify qualifications, training, credentials, availability, and conflicts before a reviewed order sends the team.",
    image: "/emergency-management/damage-assessment-closeup.webp",
    alt: "Prepared site inspection team documenting coastal storm damage from a response boat",
    situation:
      "Flooding has isolated coastal properties. Incident leadership needs a field team that can reach the area, document conditions, and return evidence without losing the assignment history.",
    workflow: [
      "Compare candidates against the requested dates, position requirements, current training, credential status, availability, and existing orders.",
      "Route the deployment order through independent review and responder acceptance before mobilization.",
      "Keep observations, photographs, duty-station visits, and source records attached to the incident and assigned people.",
    ],
    outcome:
      "Command can see who was selected, why they were eligible, what they observed, and which policy and evidence supported the deployment.",
    tag: "People + readiness + orders + evidence",
  },
  {
    id: "logistics",
    number: "02",
    marker: "left-[43%] top-[68%]",
    card: "-left-28 bottom-10 sm:w-80",
    shortTitle: "Logistics staging",
    title: "Account for resources from receipt through issue.",
    preview:
      "Connect supplies and equipment to locations, teams, custodians, deployment needs, and an append-only movement history.",
    image: "/emergency-management/logistics-staging-closeup.webp",
    alt: "Prepared logistics specialists accounting for emergency supplies at a coastal response staging area",
    situation:
      "A staging area is receiving supplies and deployable equipment from multiple sources. Teams need material quickly, but leadership still needs current custody, condition, and mission context.",
    workflow: [
      "Receive and inspect equipment against governed item records, categories, condition, and source events.",
      "Issue or transfer custody to an authorized responder, deployment, incident, or versioned team package.",
      "Block demobilization when linked equipment remains held or missing, and preserve independent loss-review decisions.",
    ],
    outcome:
      "The operation can move quickly without sacrificing a defensible record of what arrived, where it went, who holds it, and whether it returned ready for reuse.",
    tag: "Equipment + custody + teams + closeout",
  },
  {
    id: "restoration",
    number: "03",
    marker: "right-[8%] top-[22%]",
    card: "right-0 top-10 sm:w-80",
    shortTitle: "Lifeline restoration",
    title: "Keep command and restoration teams aligned in the field.",
    preview:
      "Coordinate duty stations, supervisors, status changes, accountability checks, time away, and operational reporting.",
    image: "/emergency-management/restoration-coordination-closeup.webp",
    alt: "Utility supervisor and incident personnel coordinating infrastructure restoration beside prepared line crews",
    situation:
      "Utility crews are restoring a damaged transportation and power corridor while incident staff coordinate safe access, shift coverage, and responder accountability across duty stations.",
    workflow: [
      "Assign accepted responders to duty stations with current supervisors and a preserved deployment timeline.",
      "Schedule daily accountability checks, distinguish notices from actual replies, and escalate missed or expired responses.",
      "Save deployment status, time-at-location, equipment, and team-readiness reports with pinned rules and source records.",
    ],
    outcome:
      "Leaders receive a current operational picture while private reply details, role boundaries, and the history behind each status remain controlled.",
    tag: "Deployments + accountability + locations + reports",
  },
];

export default function InteractiveResponseHero() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const activeScenario = selected === null ? null : scenarios[selected];

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
      <section className="relative h-[72svh] min-h-[540px] w-full overflow-hidden bg-slate-900" aria-label="Explore emergency response software workflows">
        <Image
          src="/emergency-management/emergency-response-hero.webp"
          alt="Coordinated emergency response staging area with mobile command units, rescue boats, utility crews, and field logistics"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/10" />

        <div className="absolute left-6 top-6 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:left-10 sm:top-8">
          Hover to inspect · Click to enter
        </div>

        {scenarios.map((scenario, index) => {
          const isHovered = hovered === index;
          return (
            <div key={scenario.id} className={`absolute z-10 ${scenario.marker}`}>
              <button
                type="button"
                aria-label={`Explore ${scenario.shortTitle}`}
                aria-expanded={selected === index}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected(index)}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-black/45 text-xs font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:scale-110 hover:bg-white hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/40"
              >
                <span className="absolute inset-[-9px] animate-ping rounded-full border border-white/25 [animation-duration:2.8s] motion-reduce:animate-none" aria-hidden="true" />
                {scenario.number}
              </button>

              <div
                aria-hidden={!isHovered}
                className={`pointer-events-none absolute ${scenario.card} hidden rounded-sm border border-white/20 bg-neutral-950/90 p-5 text-white shadow-2xl backdrop-blur-md transition sm:block ${isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-amber-300">{scenario.shortTitle}</p>
                <p className="mt-2 text-base font-medium leading-snug">{scenario.title}</p>
                <p className="mt-3 text-xs leading-5 text-white/65">{scenario.preview}</p>
                <p className="mt-4 flex items-center gap-2 text-xs font-medium">Enter this workflow <ArrowRight className="h-3.5 w-3.5" /></p>
              </div>
            </div>
          );
        })}

        <div className="absolute inset-x-6 bottom-8 flex items-end justify-between gap-6 sm:inset-x-10 sm:bottom-12 lg:left-[max(2.5rem,calc((100vw-64rem)/2))] lg:right-[max(2.5rem,calc((100vw-64rem)/2))]">
          <p className="max-w-2xl text-2xl font-medium leading-tight tracking-[-0.03em] text-white sm:text-4xl">
            The operation should stay coordinated when the environment does not.
          </p>
          <p className="hidden max-w-40 text-right text-[11px] leading-5 text-white/55 lg:block">Three response workflows are embedded in this scene.</p>
        </div>
      </section>

      {activeScenario && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-neutral-950 text-white" role="dialog" aria-modal="true" aria-label={activeScenario.title}>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="fixed right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:bg-white hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-white sm:right-7 sm:top-7"
            aria-label="Close case study"
            autoFocus
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.55fr)_minmax(380px,0.75fr)]">
            <div className="relative min-h-[48svh] overflow-hidden lg:sticky lg:top-0 lg:h-screen">
              <Image src={activeScenario.image} alt={activeScenario.alt} fill priority sizes="(min-width: 1024px) 67vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/25" />
              <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10 lg:hidden">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-300">Scenario {activeScenario.number}</p>
                <h2 className="mt-3 text-3xl font-medium leading-tight tracking-[-0.04em]">{activeScenario.title}</h2>
              </div>
            </div>

            <article className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:min-h-screen lg:px-12 lg:py-20">
              <p className="hidden text-xs font-medium uppercase tracking-[0.16em] text-amber-300 lg:block">Scenario {activeScenario.number} · {activeScenario.shortTitle}</p>
              <h2 className="mt-4 hidden text-4xl font-medium leading-[1.04] tracking-[-0.045em] lg:block">{activeScenario.title}</h2>
              <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-white/40 lg:mt-6">{activeScenario.tag}</p>

              <div className="mt-8 border-t border-white/15 pt-7">
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">Operational situation</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">{activeScenario.situation}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">Software in the workflow</h3>
                <div className="mt-4 space-y-4">
                  {activeScenario.workflow.map((step) => (
                    <div key={step} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                      <p className="text-sm leading-6 text-white/70">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-white/15 pt-7">
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">Operational result</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">{activeScenario.outcome}</p>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-6">
                <button type="button" onClick={() => setSelected((selected + scenarios.length - 1) % scenarios.length)} className="text-xs font-medium text-white/55 transition hover:text-white">Previous scenario</button>
                <span className="text-xs tabular-nums text-white/35">{activeScenario.number} / 03</span>
                <button type="button" onClick={() => setSelected((selected + 1) % scenarios.length)} className="text-xs font-medium text-white/55 transition hover:text-white">Next scenario</button>
              </div>
            </article>
          </div>
        </div>
      )}
    </>
  );
}
