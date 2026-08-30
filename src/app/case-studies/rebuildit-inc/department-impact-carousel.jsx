"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const departments = [
  {
    name: "Leadership",
    impact: "A shared view of projects, labor, materials, and financial exposure replaces status checks across disconnected tools.",
  },
  {
    name: "Sales and intake",
    impact: "Calls, inquiries, appointments, and next actions stay attached to one customer record instead of being re-entered by hand.",
  },
  {
    name: "Project operations",
    impact: "Schedules, work orders, changes, documents, and field updates move through one controlled workflow with clear ownership.",
  },
  {
    name: "Warehouse and purchasing",
    impact: "Material requests, receipts, inventory, job usage, and shortages become traceable without maintaining parallel spreadsheets.",
  },
  {
    name: "Finance and administration",
    impact: "Costs, approvals, supporting records, and reporting stay connected to the work that created them, reducing reconciliation effort.",
  },
];

export default function DepartmentImpactCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = departments[activeIndex];
  const move = (direction) => {
    setActiveIndex((index) => (index + direction + departments.length) % departments.length);
  };

  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 border-t border-neutral-200 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-500">Impact across the operation</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">
              Less coordination work in every department.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
              The system is designed to remove duplicate entry, manual handoffs, and time spent reconstructing the state of the business.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3" aria-label="Department impact controls">
            <span className="mr-2 text-sm tabular-nums text-neutral-500">
              {String(activeIndex + 1).padStart(2, "0")} / {String(departments.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => move(-1)} aria-label="Previous department" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 text-neutral-900 transition hover:bg-neutral-100">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next department" className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 text-neutral-900 transition hover:bg-neutral-100">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <article className="mt-12 grid min-h-[320px] border-t border-neutral-200 py-10 md:grid-cols-[1fr_260px] md:items-end lg:py-14">
          <p className="max-w-3xl text-3xl font-normal leading-[1.3] tracking-[-0.03em] text-neutral-950 sm:text-4xl">
            {active.impact}
          </p>
          <div className="mt-10 md:mt-0 md:text-right">
            <p className="font-semibold text-neutral-950">{active.name}</p>
            <p className="mt-1 text-sm text-neutral-500">Operational impact</p>
          </div>
        </article>
      </div>
    </section>
  );
}
