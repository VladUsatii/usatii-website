"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

const coreServices = [
  {
    name: "Organic Social Media Content Creation & Management",
    price: "Starts at $550 /mo",
    badge: "Core service",
    summary:
      "Consistent short-form and written content systems that keep your brand active, credible, and compounding. The team and I have worked with some of the largest creators on social media and our systems genuinely work. We handle:",
    features: [
      "• Content planning & scripting",
      "• Editing, voiceovers & publishing",
      "• Daily written or image posts",
      "• Tone-matched copywriting",
    ],
    prices: [
      ["$550.00", "10 posts (video or text) / month"],
      ["$750.00", "20 posts (video or text) / month"],
      ["$1,000.00", "30 posts (video or text) / month"],
      ["$1,750.00", "60 posts (video or text) / month"],
    ],
  },
  {
    name: "Paid Marketing",
    price: "$450 + (1.2 × ad budget) /mo",
    badge: "Core service",
    summary:
      "Performance-driven paid acquisition for brands that need immediate reach, deterministic demand capture, and controlled spend options.",
    features: [
      "• Meta ads",
      "• Paid content creation & management",
      "• A/B testing and budget optimization",
    ],
    prices: [
      ["$450.00 + (1.2 × ad budget)", "15 creatives (video or text) / campaign"],
      ["$850.00 + (1.2 × ad budget)", "30 creatives (video or text) / campaign"],
      ["$1,000.00 + (1.2 × ad budget)", "45 creatives (video or text) / campaign"],
    ],
  },
  {
    name: "Website & Marketing-Informed Operations",
    price: "From $500+/mo",
    badge: "Core service",
    summary:
      "Websites, analytics, and internal marketing-informed software that help businesses turn demand signals into operational decisions.",
    features: [
      "• Static sites ($500/mo)",
      "• Dynamic sites w/ advanced motion ($1,500/mo)",
      "• Full-stack builds & internal tools ($2,500+/mo)",
      "• Marketing analytics & operations software",
    ],
    prices: [["Custom", "Schedule a call to scope the build."]],
  },
];

const addOns = [
  {
    name: "Community Building",
    price: "$150+/platform",
    summary: "Optional audience and community support.",
    features: [
      "• Discord, Quora, Reddit support",
      "• Optional $50/mo maintenance",
    ],
    prices: [
      ["$150.00", "1 community built"],
      ["$300.00", "3 communities built (Discord, Quora, Reddit)"],
      ["$50.00", "1 month of community moderating & support"],
    ],
  },
  {
    name: "Growth Consulting",
    price: "$50/hr (1st hr free)",
    summary: "Optional advisory for teams needing strategy input.",
    features: [
      "• Custom growth roadmaps",
      "• Weekly strategy calls",
      "• Brand and acquisition direction",
    ],
  },
];

const cleanFeature = (text) => text.replace(/^•\s*/, "");

const PriceTable = ({ prices }) => (
  <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <table className="min-w-full">
      <thead className="bg-slate-50">
        <tr>
          <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
            Price
          </th>
          <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
            What you get
          </th>
        </tr>
      </thead>
      <tbody>
        {prices.map(([cost, desc]) => (
          <tr key={`${cost}-${desc}`} className="hover:bg-slate-50/80">
            <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 font-medium text-slate-900">
              {cost}
            </td>
            <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
              {desc}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function PlanCard({ plan, index, onSelect, featured = false, compact = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className={[
        "group relative flex h-full flex-col overflow-hidden bg-white",
        featured
          ? "rounded-[30px] border border-indigo-200 shadow-[0_18px_60px_rgba(99,102,241,0.10)]"
          : "rounded-[24px] border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.05)]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_26%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className={["relative z-10 flex h-full flex-col", compact ? "p-5" : "p-6"].join(" ")}>
        <h3
          className={
            compact
              ? "text-lg font-semibold tracking-tight text-slate-900"
              : "text-xl font-semibold tracking-tight text-slate-900"
          }
        >
          {plan.name}
        </h3>

        <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600">
          {plan.price}
        </p>

        {plan.summary && (
          <p className="mt-3 text-sm leading-6 text-slate-600">{plan.summary}</p>
        )}

        <ul className="mt-6 flex-1 space-y-0">
          {plan.features.map((feat) => (
            <li
              key={feat}
              className="grid grid-cols-[14px_1fr] items-start border-t border-slate-100 py-3 text-slate-700 first:border-t"
            >
              <span className="mt-[9px] h-1.5 w-1.5 rounded-[2px] bg-indigo-500" />
              <span className="pr-2 text-[15px] leading-6">
                {cleanFeature(feat)}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className={[
            "mt-6 w-full cursor-pointer text-base font-semibold transition duration-300",
            featured
              ? "rounded-[18px] border border-slate-900 bg-slate-900 text-white hover:scale-[1.015] hover:border-indigo-600 hover:bg-indigo-600"
              : "rounded-[16px] border border-slate-300 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-50",
          ].join(" ")}
          onClick={() => onSelect(plan)}
        >
          {featured ? "Explore service" : "View add-on"}
        </Button>
      </div>
    </motion.div>
  );
}

function PlanCard2({ plan, index, onSelect, featured = false, compact = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className={[
        "group relative flex h-full flex-col overflow-hidden",
      ].join(" ")}
    >
      <div className={["relative z-10 flex h-full flex-col", compact ? "p-5" : "p-6"].join(" ")}>
        <h3
          className={
            compact
              ? "text-lg font-semibold tracking-tight text-slate-900"
              : "text-xl font-semibold tracking-tight text-slate-900"
          }
        >
          {plan.name}
        </h3>

        <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600">
          {plan.price}
        </p>

        {plan.summary && (
          <p className="mt-3 text-sm leading-6 text-slate-600">{plan.summary}</p>
        )}

        <ul className="mt-6 flex-1 space-y-0">
          {plan.features.map((feat) => (
            <li
              key={feat}
              className="grid grid-cols-[14px_1fr] items-start border-t border-slate-100 py-3 text-slate-700 first:border-t"
            >
              <span className="mt-[9px] h-1.5 w-1.5 rounded-[2px] bg-indigo-500" />
              <span className="pr-2 text-[15px] leading-6">
                {cleanFeature(feat)}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className={[
            "mt-6 w-full cursor-pointer text-base font-semibold transition duration-300",
            featured
              ? "rounded-[18px] border border-slate-900 bg-slate-900 text-white hover:scale-[1.015] hover:border-indigo-600 hover:bg-indigo-600"
              : "rounded-[16px] border border-slate-300 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-50",
          ].join(" ")}
          onClick={() => onSelect(plan)}
        >Explore add-on
        </Button>
      </div>
    </motion.div>
  );
}


export default function HeroThree() {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const reduceMotion = useReducedMotion();

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Our Services
        </h2>
        <p className="mt-4 text-left text-md leading-7 text-slate-500">
          We are content-first -- businesses don't grow today without strong content pipelines. After that, we
          help you expand your paid ads channel through fast-acting campaigns.
          After your content and advertising is squared away, we help you build a strong marketing-informed operations website.
          Our systems weave together and work as a feedback lifecycle for businesses at any stage.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {coreServices.map((plan, index) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            index={index}
            onSelect={handleSelect}
            featured
          />
        ))}
      </div>

      <div className="mt-16 rounded-[30px] ">
        <div className="text-center">
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-700">
            Add-on services
          </h3>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {addOns.map((plan, index) => (
            <PlanCard2
              key={plan.name}
              plan={plan}
              index={index}
              onSelect={handleSelect}
              compact
            />
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />

        <AnimatePresence>
          {selectedPlan && open ? (
            <DialogContent className="border-none bg-transparent p-0 shadow-none sm:max-w-[560px]">
              <motion.div
                initial={{
                  scale: reduceMotion ? 1 : 0.96,
                  opacity: 0,
                  y: reduceMotion ? 0 : 14,
                }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{
                  scale: reduceMotion ? 1 : 0.98,
                  opacity: 0,
                  y: reduceMotion ? 0 : 8,
                }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.18)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_28%)]" />

                <div className="relative z-10 p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                      {selectedPlan.name}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-lg font-semibold text-indigo-600">
                      {selectedPlan.price}
                    </DialogDescription>
                  </DialogHeader>

                  {selectedPlan.summary && (
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {selectedPlan.summary}
                    </p>
                  )}

                  <ul className="mt-6 space-y-0">
                    {selectedPlan.features.map((f) => (
                      <li
                        key={f}
                        className="grid grid-cols-[14px_1fr] items-start border-t border-slate-100 py-3 text-slate-700 first:border-t"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 rounded-[2px] bg-indigo-500" />
                        <span className="text-[15px] leading-6">
                          {cleanFeature(f)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {selectedPlan.prices && <PriceTable prices={selectedPlan.prices} />}

                  <DialogFooter className="mt-7 flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="rounded-[16px] border-slate-300 bg-white text-slate-900"
                      >
                        Close
                      </Button>
                    </DialogClose>

                    <Link href="https://cal.com/usatii/onboarding" target="_blank">
                      <Button className="cursor-pointer rounded-[16px] bg-slate-900 text-white hover:bg-indigo-600">
                        Book a call
                      </Button>
                    </Link>
                  </DialogFooter>
                </div>
              </motion.div>
            </DialogContent>
          ) : null}
        </AnimatePresence>
      </Dialog>
    </section>
  );
}