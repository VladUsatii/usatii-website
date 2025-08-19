// ComparisonTable.jsx
import React from 'react';

export default function ComparisonTable() {
  const rows = [
    {
      label: 'System type',
      usatii: 'One build + content retainer',
      agency: 'Full‑service contract',
      saas: 'Subscription toolbox',
      diy: 'Random free tooling',
    },
    {
      label: 'Monthly fees',
      usatii: '$0 software + flex retainer',
      agency: '$3‑10k fee',
      saas: '$400‑1k / service',
      diy: 'Costs time',
    },
    {
      label: 'Savings/yr',
      usatii: 'Up to $10K',
      agency: 'N/A',
      saas: 'N/A',
      diy: 'N/A',
    },
    {
      label: 'Content output',
      usatii: '90+ human-made videos/month',
      agency: '8-15 assets / mo',
      saas: 'Basic templates',
      diy: 'Inconsistencies',
    },
    {
      label: 'Booking + CRM built‑in',
      usatii: 'Local‑hosted, self-owned, firm-managed',
      agency: 'Remote-hosted, remote-managed, remote-owned',
      saas: 'Remote-hosted, remote-managed, remote-owned',
      diy: 'N/A',
    },
    {
      label: 'Time saved / wk',
      usatii: '20‑30 hrs',
      agency: '5‑10 hrs',
      saas: 'Depends on setup',
      diy: '-20 hrs',
    },
    {
      label: 'Automation level',
      usatii: 'Full',
      agency: 'Manual heavy',
      saas: 'Semi-auto',
      diy: 'None',
    },
    {
      label: 'Ownership',
      usatii: 'You own IP',
      agency: 'Agency-hosted',
      saas: 'Vendor-locked',
      diy: 'N/A',
    },
  ];

  const headingClasses =
    'px-4 py-3 text-left text-sm font-semibold bg-black first:rounded-tl-[25px] last:rounded-tr-[25px] text-white';
  const cellClasses =
    'px-4 py-3 text-sm border-b border-neutral-200 whitespace-normal break-words';

  return (
    <div className="flex flex-col items-center mx-6 my-10">
      <h3 className="font-black text-center text-4xl sm:text-5xl pb-8">
        How we compare
      </h3>

      <div className="w-full max-w-[850px] bg-neutral-100 overflow-x-auto">
        <table className="w-full min-w-[640px] md:min-w-0 table-auto text-neutral-900">
          <thead>
            <tr>
              <th className={headingClasses}></th>
              <th className={headingClasses}>USATII</th>
              <th className={headingClasses}>Traditional agency</th>
              <th className={headingClasses}>All‑in‑one SaaS</th>
              <th className={headingClasses}>Freelance/DIY</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="odd:bg-neutral-50">
                <td className={`${cellClasses} font-medium`}>{r.label}</td>
                <td className={`${cellClasses} font-bold text-green-700`}>
                  {r.usatii}
                </td>
                <td className={cellClasses}>{r.agency}</td>
                <td className={cellClasses}>{r.saas}</td>
                <td className={cellClasses}>{r.diy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-neutral-600 rounded-b-[25px] bg-neutral-100 py-5 px-5">
          * Excludes one‑time development fee; hosting on your own systems keeps
          monthly costs at $0.00
        </p>
      </div>
    </div>
  );
}
