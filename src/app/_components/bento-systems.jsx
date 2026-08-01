"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const systems = [
  {
    title: "OASIS",
    eyebrow: "Enterprise social operations",
    description: "One governed command surface for publishing, approvals, inbox and cases, listening, analytics, accessibility evidence, compliance, and automation.",
    detail: "OASIS gives serious communications teams perfect memory across channels, decisions, permissions, and evidence—without scattering the work across disconnected tools.",
    image: "/home/product-showcase/oasis-command-center.png",
    href: "/software",
    cta: "Explore OASIS",
  },
  {
    title: "Workflow & data infrastructure",
    eyebrow: "Owned operational software",
    description: "Databases, role-based portals, automations, integrations, and reporting designed around the way your organization actually works.",
    detail: "We replace fragmented subscriptions and handoffs with a trusted operating layer that makes ownership, permissions, status, and performance legible.",
    image: "/home/product-showcase/workflow-data-infrastructure.png",
    href: "/software/custom-software-for-contractors",
    cta: "See our software approach",
  },
  {
    title: "Content operations",
    eyebrow: "Creative systems with governance",
    description: "Planning, drafting, reviewing, approving, scheduling, and publishing become one managed pipeline instead of an ad hoc creative process.",
    detail: "Teams get a durable production rhythm, clear approval states, reusable assets, and a clean record of how every piece moved from idea to audience.",
    image: "/home/product-showcase/content-operations.png",
    href: "/editor",
    cta: "View content systems",
  },
  {
    title: "Growth infrastructure",
    eyebrow: "Public attention, operationally connected",
    description: "Websites, lead intake, campaign attribution, CRM routing, and measurement built as one accountable system.",
    detail: "A website is valuable when it connects demand to the people and workflows that can act on it. We build that complete path and make the results measurable.",
    image: "/home/product-showcase/growth-infrastructure.png",
    href: "/case-studies",
    cta: "See the work",
  },
];

export default function SystemsBentoGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveIndex(Number(visible.target.dataset.systemIndex));
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.1, 0.4, 0.7] }
    );

    itemRefs.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const active = systems[activeIndex];

  return (
    <section className="w-full border-y border-neutral-200 bg-[#f7f7f5] px-6 py-24 text-left lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-violet-700">Systems, not isolated deliverables</p>
          <h2 className="mt-5 text-4xl font-medium leading-tight tracking-[-0.035em] text-neutral-950 sm:text-6xl">
            Systems we build today help you make better decisions tomorrow.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            We connect software, operations, and growth into durable infrastructure your team can understand and own.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-start">
          <div className="lg:sticky lg:top-20">
            <div className="relative aspect-[16/10] overflow-hidden border border-neutral-200 bg-white">
              {systems.map((system, index) => (
                <Image
                  key={system.image}
                  src={system.image}
                  alt={`${system.title} product system visualization`}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 64vw, 100vw"
                  className={`object-cover transition-opacity duration-500 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>
            <div className="border-x border-b border-neutral-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{active.eyebrow}</p>
              <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-neutral-950">{active.title}</h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">{active.detail}</p>
            </div>
          </div>

          <div className="border-t border-neutral-300">
            {systems.map((system, index) => (
              <article
                key={system.title}
                ref={(node) => { itemRefs.current[index] = node; }}
                data-system-index={index}
                className="flex min-h-[52vh] flex-col justify-center border-b border-neutral-300 py-10"
              >
                <button type="button" onClick={() => setActiveIndex(index)} className="text-left">
                  <span className="text-xs font-semibold tabular-nums text-neutral-400">0{index + 1}</span>
                  <h3 className={`mt-5 text-3xl font-medium tracking-[-0.03em] transition-colors ${index === activeIndex ? "text-neutral-950" : "text-neutral-400"}`}>
                    {system.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-neutral-600">{system.description}</p>
                </button>
                <Link href={system.href} className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-neutral-950 hover:text-violet-700">
                  {system.cta}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
