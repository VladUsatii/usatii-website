"use client";

import { useMemo, useState } from "react";

function Field({ label, value, onChange, step = "1" }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d4dff]">{label}</span>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-[#d9dced] bg-white px-3 py-2 text-sm text-[#151a34] outline-none transition focus:border-[#a893ff]"
      />
    </label>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SoftwareWasteCalculator() {
  const [subscriptions, setSubscriptions] = useState("8");
  const [avgMonthlyCost, setAvgMonthlyCost] = useState("179");
  const [seatCount, setSeatCount] = useState("7");
  const [avgSeatCost, setAvgSeatCost] = useState("28");
  const [overlapPercent, setOverlapPercent] = useState("25");
  const [adminHoursPerWeek, setAdminHoursPerWeek] = useState("6");
  const [hourlyRate, setHourlyRate] = useState("45");

  const totals = useMemo(() => {
    const subCount = Number(subscriptions) || 0;
    const subCost = Number(avgMonthlyCost) || 0;
    const seats = Number(seatCount) || 0;
    const seatCost = Number(avgSeatCost) || 0;
    const overlap = Math.min(Math.max(Number(overlapPercent) || 0, 0), 100) / 100;
    const adminHours = Number(adminHoursPerWeek) || 0;
    const loadedRate = Number(hourlyRate) || 0;

    const yearlySoftware = (subCount * subCost + seats * seatCost) * 12;
    const overlapWaste = yearlySoftware * overlap;
    const manualAdminWaste = adminHours * loadedRate * 52;
    const totalWaste = overlapWaste + manualAdminWaste;

    return {
      yearlySoftware,
      overlapWaste,
      manualAdminWaste,
      totalWaste,
    };
  }, [
    subscriptions,
    avgMonthlyCost,
    seatCount,
    avgSeatCost,
    overlapPercent,
    adminHoursPerWeek,
    hourlyRate,
  ]);

  return (
    <div className="rounded-xl border border-[#e4e7f2] bg-white p-5 shadow-[0_12px_30px_rgba(74,58,255,0.08)]">
      <h3 className="text-2xl font-black tracking-tight text-[#12162d]">Contractor Software Waste Calculator</h3>
      <p className="mt-2 text-sm leading-6 text-[#59607a]">
        Estimate annual waste from overlapping subscriptions and manual coordination.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Number of active subscriptions"
          value={subscriptions}
          onChange={setSubscriptions}
        />
        <Field
          label="Average monthly cost per subscription"
          value={avgMonthlyCost}
          onChange={setAvgMonthlyCost}
        />
        <Field label="Seat count" value={seatCount} onChange={setSeatCount} />
        <Field
          label="Average cost per seat (monthly)"
          value={avgSeatCost}
          onChange={setAvgSeatCost}
        />
        <Field
          label="Estimated overlap (%)"
          value={overlapPercent}
          onChange={setOverlapPercent}
        />
        <Field
          label="Admin hours lost per week"
          value={adminHoursPerWeek}
          onChange={setAdminHoursPerWeek}
          step="0.5"
        />
        <Field label="Loaded hourly rate" value={hourlyRate} onChange={setHourlyRate} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[#e6e8f3] bg-[#f7f8fc] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#737b96]">Annual software spend</p>
          <p className="mt-1 text-xl font-bold text-[#151a34]">{formatCurrency(totals.yearlySoftware)}</p>
        </div>
        <div className="rounded-lg border border-[#e6e8f3] bg-[#f7f8fc] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#737b96]">Overlap waste (annual)</p>
          <p className="mt-1 text-xl font-bold text-[#5b3fd0]">{formatCurrency(totals.overlapWaste)}</p>
        </div>
        <div className="rounded-lg border border-[#e6e8f3] bg-[#f7f8fc] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#737b96]">Manual admin waste (annual)</p>
          <p className="mt-1 text-xl font-bold text-[#5b3fd0]">{formatCurrency(totals.manualAdminWaste)}</p>
        </div>
        <div className="rounded-lg border border-[#b8abff] bg-[#f2eeff] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#5b3fd0]">Estimated total waste</p>
          <p className="mt-1 text-2xl font-black text-[#11152b]">{formatCurrency(totals.totalWaste)}</p>
        </div>
      </div>
    </div>
  );
}
