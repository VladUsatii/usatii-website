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
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Organic SMM",
    price: "Starts at $550 /mo",
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
        ["$1,750.00", "60 posts (video or text) / month"]
    ]
  },
  {
    name: "Paid Marketing (beta 🧾)",
    price: "$450 + (1.2 × ad budget) /mo",
    features: [
      "• Meta ads & press releases",
      "• TV & exclusive web spots",
      "• Budget optimization",
    ],
    prices: [
        ["$450.00 + (1.2 × ad budget)", "15 creatives (video or text) / campaign"],
        ["$850.00 + (1.2 × ad budget)", "30 posts (video or text) / campaign"],
        ["$1,000.00 + (1.2 × ad budget)", "45 posts (video or text) / campaign"],
    ]
  },
  {
    name: "Website & Platform Design",
    price: "From $500+/mo",
    features: [
      "• Static sites ($500/mo)",
      "• Dynamic w/ 2D animation ($1,500/mo)",
      "• Full-stack 3D/trick render ($2,500/mo)",
      "• Next.js, React, PostgreSQL, Tailwind",
    ],
    prices: [
        ["Custom", "Schedule a call to discuss."],
    ]
  },
  {
    name: "Community Building",
    price: "$150+/platform",
    features: [
      "• Discord, Quora, Reddit support",
      "• Optional $50/mo maintenance",
    ],
    prices: [
        ["$150.00", "1 community built"],
        ["$300.00", "3 communities built (Discord, Quora, Reddit)"],
        ["$50.00", "1 month of community moderating & support"]
    ]
  },
  {
    name: "Growth Consulting",
    price: "$50/hr (1st hr free)",
    features: [
      "• Custom growth roadmaps",
      "• Weekly strategy calls",
      "• Zero→Hero brand scaling",
    ],
  },
  {
    name: "Full-Service Package",
    price: "$2,500+/mo",
    features: [
      "• Everything above combined",
      "• End-to-end growth management",
    ],
    prices: [
        ["Variable", "Contact Vlad to discuss"],
    ]
  },
];

const PriceTable = ({ prices }) => (
  <div className="overflow-x-auto mt-6">
    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            Price
          </th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
            What you get
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {prices.map(([cost, desc]) => (
          <tr key={cost}>
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
              {cost}
            </td>
            <td className="px-4 py-2">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function HeroThree() {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 text-center">
        Growth Plans 🚀
      </h2>

      {/* GRID OF PLANS */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
          >
            <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
            <p className="mt-2 text-2xl font-bold text-indigo-600">{plan.price}</p>
            <ul className="mt-4 space-y-2 flex-1">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start text-gray-600">
                  {feat}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 font-bold w-full cursor-pointer hover:scale-105 transition"
              onClick={() => handleSelect(plan)}
            >
              Select plan
            </Button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>

        {/* ★ CUSTOM OVERLAY WITH BLUR */}
        <DialogOverlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />

        {selectedPlan && (
          <DialogContent
            // asChild
            className="border-none bg-transparent p-0 sm:max-w-[480px]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative z-50 rounded-2xl bg-white p-8 shadow-xl"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedPlan.name}
                </DialogTitle>
                <DialogDescription className="text-lg font-semibold text-indigo-600">
                  {selectedPlan.price}
                </DialogDescription>
              </DialogHeader>

              <ul className="mt-4 space-y-2">
                {selectedPlan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              {selectedPlan.prices && (
                <PriceTable prices={selectedPlan.prices} />
              )}

              <DialogFooter className="mt-6 flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Link href="https://www.calendly.com/usatii/onboarding"><Button className="cursor-pointer">Book a call</Button></Link>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
