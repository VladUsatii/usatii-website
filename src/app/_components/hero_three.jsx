"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

const coreServices = [
  {
    name: "Websites",
    badge: "Core service",
    summary:
      "Conversion-focused websites ranging from focused landing pages to full public platforms, with optional ongoing care.",
    features: [
      "• Landing pages and dynamic business websites",
      "• Full-stack public platforms and enterprise builds",
      "• Website care and ongoing development support",
    ],
  },
  {
    name: "Custom Software & Operations Systems",
    badge: "Core service",
    summary:
      "Purpose-built dashboards, portals, automations, and operating systems that connect your growth stack.",
    features: [
      "• Systems mapping and implementation planning",
      "• CRM, analytics, workflow, and portal modules",
      "• Fixed-scope foundations and custom development",
    ],
  }
];

const addOns = [
  {
    name: "OASIS Platform",
    summary: "A managed operating layer for teams that need connected growth and execution workflows.",
    features: [
      "• Flexible team access",
      "• Onboarding support for managed clients",
    ],
  },
];

const cleanFeature = (text) => text.replace(/^•\s*/, "");

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
      className="group relative flex h-full flex-col overflow-hidden border-t border-slate-200 bg-white"
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
              ? "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
              : "border border-slate-300 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-50",
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
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl border-t border-neutral-200 pt-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">
          Our Services
        </h2>
        {/* <p className="mt-4 text-left text-md leading-7 text-slate-500">
          We are content-first -- businesses don't grow today without strong content pipelines. After that, we
          help you expand your paid ads channel through fast-acting campaigns.
          After your content and advertising is squared away, we help you build a strong marketing-informed operations website.
          Our systems weave together and work as a feedback lifecycle for businesses at any stage.
        </p> */}
        <p className="mt-4 text-left text-md leading-7 text-slate-500">
          We design and build custom websites, dashboards, portals, automations, and operating systems that bring critical workflows in-house. No more disconnected subscription software.
        </p>
      </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
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

      <div className="mt-16">
        <div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-700">
            Add-on services
          </h3>
        </div>

        <div className="mt-5 grid max-w-3xl gap-5">
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
                className="relative max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.18)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_28%)]" />

                <div className="relative z-10 p-6 sm:p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                      {selectedPlan.name}
                    </DialogTitle>
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
      </div>
    </section>
  );
}
