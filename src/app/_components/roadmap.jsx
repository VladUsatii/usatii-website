// app/components/roadmap.jsx
'use client';
import Image from 'next/image';
import React from 'react';

const SVG_WIDTH  = 500;
const SVG_HEIGHT = 1200;

const steps = [
  {
    title: 'Market intelligence.',
    body:  'We study your value prop, market, audience, SOTA, and current tactics.',
  },
  {
    title: 'Strategic ideation.',
    body:  'Spin up in‑house automations that replace your marketing stack.',
  },
  {
    title: 'Content engine.',
    body:  'Record once – syndicate into a month of posts.',
  },
  {
    title: 'Track winners.',
    body:  'Ship and measure during sprints.',
  },
];

export default function Roadmap() {
  const stepPct = 100 / (steps.length + 1);           // % distance between captions

return (null);
//   return (
//     <section className="flex flex-col items-center my-10">
//       <h1 className="font-black text-4xl pt-10">See us in action.</h1>
//       <h2 className="text-lg pt-5 pb-10">
//         <i className="text-neutral-700">&quot;What do we actually do?&quot;</i> explained.
//       </h2>

//       {/* ── Illustration + captions ─────────────────────────── */}
//       <div
//         className="relative w-full max-w-[500px] overflow-hidden"
//         style={{ aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}` }}   // keeps image in‑bounds
//       >
//         <Image
//           src="/demonstration_part.svg"
//           alt="hand‑drawn flow with arrows"
//           fill
//           className="object-contain pointer-events-none select-none"
//         />

//         {steps.map(({ title, body }, i) => {
//           const sideShift = i === 0 ? 100 : i === 2 ? -80 : 0;    // clear each arrow
//           return (
//             <div
//               key={title}
//               style={{
//                 top: `calc(${(i + 1) * stepPct}% - 30px)`,
//                 left: `calc(50% + ${sideShift}px)`,
//                 transform: 'translateX(-50%)',
//               }}
//               className="absolute w-[220px] sm:w-[300px] text-center"
//             >
//               <h3 className={i === 3 ? 'text-2xl font-black' : 'text-lg font-bold'}>
//                 {title}
//               </h3>
//               <p className="text-sm text-neutral-700">{body}</p>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
}
