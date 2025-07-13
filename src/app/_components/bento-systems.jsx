'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  Layers,
  Share,
  BarChart2,
  RefreshCw,
} from 'lucide-react';

const tiles = [
  { id: 1, title: 'Market intelligence', desc: '24⁄7 scraping of industry chatter, social signals, and competitor moves flows into a data bank powering every strategic decision.', Icon: Brain,   span: 'md:col-span-4 md:row-span-2' },
  { id: 2, title: 'Strategic ideation', desc: 'Our sprints distill plans into episodic campaigns, each pinned to a growth goal.', Icon: Sparkles, span: 'md:col-span-3 md:row-span-1' },
  { id: 3, title: 'Story engine', desc: 'Our engine atomizes content into shorts and text via our in-house content planning pipeline – great for 10x output.', Icon: Layers,   span: 'md:col-span-5 md:row-span-2' },
  { id: 4, title: 'Syndication systems', desc: 'We syndicate content for every platform with per-algo and last-hour metrics sustaining content variety.', Icon: Share,    span: 'md:col-span-3 md:row-span-2' },
  { id: 5, title: 'Feedback formula', desc: 'Our clean marketing hubs surface hook-rate, retention curves, and conversion velocity – anomalies trigger retros.', Icon: BarChart2, span: 'md:col-span-4 md:row-span-1' },
  { id: 6, title: 'Automation loop', desc: 'Zapier + aws lambdas recycle winning patterns into reusable playbooks, shaving ≥20 hrs of operator toil per week.', Icon: RefreshCw, span: 'md:col-span-5 md:row-span-1' },
];

function BentoTile({ id, title, desc, Icon, span }) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
      className={`relative col-span-full sm:col-span-6 flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 ${span}`}
    >
      {/* glass backdrop */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-200/30 via-neutral-100/20 to-neutral-100/10 backdrop-blur-md ring-1 ring-neutral-300/30 border border-neutral-300/40" />

      <div className="relative z-10 space-y-4">
        <Icon className="h-8 w-8 text-fuchsia-300/80" />
        <header className="space-y-1">
          <h4 className="text-left text-lg font-bold tracking-tight">{title}</h4>
          <p className="text-sm text-left leading-snug text-neutral-700/80">{desc}</p>
        </header>

      <div className='text-left'>
        <Link
          href={`/demos/${id}`}
          className="self-start items-center gap-1 rounded-lg bg-fuchsia-600/80 px-3 py-1.5 text-sm font-medium text-white shadow transition hover:bg-fuchsia-600"
        >
          Watch a demo →
        </Link>
      </div>
      </div>
    </motion.article>
  );
}

export default function SystemsBentoGrid() {
  return (
    <section className="relative isolate overflow-hidden pt-12 text-black">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h3 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Extensive growth systems.
        </h3>
        <p className="mt-4 text-lg text-neutral-800">
          Battle-tested operating systems to turn raw ideas into compounding <span className="font-bold">audience revenue, and brand equity</span> - we engineer it once, maintain it forever.
        </p>
      </div>

      <div
        className="mx-auto mt-8 grid max-w-6xl gap-4 px-6 lg:px-8
                   sm:grid-cols-2
                   md:[grid-template-columns:repeat(12,minmax(0,1fr))]
                   [grid-auto-rows:minmax(11rem,_auto)]
                   md:[grid-auto-rows:minmax(14rem,_auto)]
                   grid-auto-flow-dense"
      >
        {tiles.map((t) => (
          <BentoTile key={t.id} {...t} />
        ))}
      </div>
    </section>
  );
}
