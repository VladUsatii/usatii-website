import React from "react";

// components/HeroTwo.jsx
export default function HeroTwo() {
  const items = [
    ["Content strategy.",
      ["• Branding principles and SOPs to build your content library.",
       "• Content calendars for months of consistency."]
    ],
    ["Editing and refinement.",
      ["• Turning raw footage and drafts into high-converting creatives.",
       "• Optimizing headlines, hooks, and adding indirect CTAs to boost sales."]
    ],
    ["Content distribution.", ["• Scheduling and publishing at peak times.",
      "• Cross-posting to all socials."
    ]],
    ["Performance analysis.", ["• Tracking KPIs to measure content efficacy.", "• Providing actionable insights to refine strategy at stand-up meets."]],
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h3 className="font-black text-4xl pb-8">We help your business make <span className="text-green-600 transition animate-pulse">$$$</span> with organic content.</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map(([title, body]) => (
          <div
            key={title}
            className="
              hover:scale-103 transition
              relative
              overflow-hidden
              rounded-xl
              shadow-lg
            "
          >
            {/* 1) Blurred gradient background */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500
                filter blur-lg
                transform scale-110
              "
            />

            {/* 2) Content container (not blurred) */}
            <div className="relative p-6">
              <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
              {body.map((sub, i) => (
                <p key={i} className="text-sm text-white/90">{sub}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
