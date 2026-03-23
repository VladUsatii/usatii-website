// ComparisonTable.jsx
import React from "react";

export default function ComparisonTable() {
  const rows = [
    {
      label: "System type",
      usatii: "One build + content retainer",
      agency: "Full-service contract",
      saas: "Subscription toolbox",
      diy: "Random free tooling",
    },
    {
      label: "Monthly fees",
      usatii: "$0 software + flex retainer",
      agency: "$3-10k fee",
      saas: "$400-1k / service",
      diy: "Costs time",
    },
    {
      label: "Savings/yr",
      usatii: "Up to $10K",
      agency: "N/A",
      saas: "N/A",
      diy: "N/A",
    },
    {
      label: "Content output",
      usatii: "90+ human-made videos/month",
      agency: "8-15 assets / mo",
      saas: "Basic templates",
      diy: "Inconsistencies",
    },
    {
      label: "Booking + CRM built-in",
      usatii: "Local-hosted, self-owned, firm-managed",
      agency: "Remote-hosted, remote-managed, remote-owned",
      saas: "Remote-hosted, remote-managed, remote-owned",
      diy: "N/A",
    },
    {
      label: "Time saved / wk",
      usatii: "20-30 hrs",
      agency: "5-10 hrs",
      saas: "Depends on setup",
      diy: "-20 hrs",
    },
    {
      label: "Automation level",
      usatii: "Full",
      agency: "Manual heavy",
      saas: "Semi-auto",
      diy: "None",
    },
    {
      label: "Ownership",
      usatii: "You own IP",
      agency: "Agency-hosted",
      saas: "Vendor-locked",
      diy: "N/A",
    },
  ];

  return (
    <section className="mx-6 my-14 flex flex-col items-center">
      <h3 className="pb-8 text-center text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
        How we compare
      </h3>

      <div className="w-full max-w-[980px] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] table-auto text-slate-900">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-950 text-white">
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Metric
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  USATII
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Traditional agency
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  All-in-one SaaS
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Freelance / DIY
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                >
                  <td className="border-b border-slate-200 px-5 py-4 align-top text-sm font-medium text-slate-900">
                    <div className="flex items-start gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-[2px] bg-slate-400" />
                      <span>{r.label}</span>
                    </div>
                  </td>

                  <td className="border-b border-slate-200 bg-indigo-50/60 px-5 py-4 align-top text-sm font-semibold text-indigo-700">
                    {r.usatii}
                  </td>

                  <td className="border-b border-slate-200 px-5 py-4 align-top text-sm text-slate-700">
                    {r.agency}
                  </td>

                  <td className="border-b border-slate-200 px-5 py-4 align-top text-sm text-slate-700">
                    {r.saas}
                  </td>

                  <td className="border-b border-slate-200 px-5 py-4 align-top text-sm text-slate-700">
                    {r.diy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs leading-5 text-slate-600">
            * Excludes one-time development fee; hosting on your own systems keeps
            monthly costs at $0.00
          </p>
        </div>
      </div>
    </section>
  );
}