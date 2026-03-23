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
  {
    id: 1,
    title: 'Market Intelligence',
    desc: '24⁄7, AI-powered scraping of industry chatter, social signals, and competitor moves that flow straight into your pipeline to power every strategic decision.',
    Icon: Brain,
    span: 'md:col-span-4 md:row-span-2'
  },
  {
    id: 2,
    title: 'Strategic ideation',
    desc: 'Our sprints distill plans into episodic campaigns, each pinned to a growth goal.',
    Icon: Sparkles, span: 'md:col-span-3 md:row-span-1' },
  {
    id: 3,
    title: 'Usatii Editor',
    desc: 'Our in-house editing OS allows you to create anything with the use of AI or by hand. A solid CapCut replacement.',
    Icon: Layers,
    span: 'md:col-span-5 md:row-span-2',
    img: 'USATII_EDITOR_DEMO.gif' },
  {
    id: 4,
    title: 'Syndication systems',
    desc: 'We syndicate content for every platform with per-algo and last-hour metrics sustaining content variety.',
    Icon: Share,
    span: 'md:col-span-3 md:row-span-2' },
  {
    id: 5,
    title: 'Feedback formula',
    desc: 'Our clean marketing hubs surface hook-rate, retention curves, and conversion velocity – anomalies trigger retros.',
    Icon: BarChart2,
    span: 'md:col-span-4 md:row-span-1'
  },
  {
    id: 6,
    title: 'Automation loop',
    desc: 'Zapier + aws lambdas recycle winning patterns into reusable playbooks, shaving ≥20 hrs of operator toil per week.',
    Icon: RefreshCw,
    span: 'md:col-span-5 md:row-span-1'
  },
];

function BentoTile({ id, title, desc, Icon, span, img }) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
      className={`relative col-span-full sm:col-span-6 flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 ${span}`}
    >
      {/* glass backdrop */}
      {id==3 ?
      <span className="absolute inset-0 rounded-2xl  ring-1 ring-neutral-300/30 border border-neutral-300/40" />
      : <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-200/30 via-neutral-100/20 to-neutral-100/10 backdrop-blur-md ring-1 ring-neutral-300/30 border border-neutral-300/40" />}

      <div className="relative z-10 space-y-4">
        {id==3 ?
        <div className="mt-[75px] aspect-video w-full max-w-4xl flex items-center justify-center">
        <img
          alt="diagram"
          src="/USATII_EDITOR_DEMO.gif"
          width={600}
          height={500}
          className='rounded-[20px] box-shadow-xl'
          // unoptimized
        />
        </div>
        : <Icon className="h-8 w-8 text-fuchsia-300/80" />
        }
        <header className="space-y-1">
          <h4 className="text-left text-lg font-bold tracking-tight">{title}</h4>
          <p className="text-sm text-left leading-snug text-neutral-700/80">{desc}</p>
        </header>

      <div className='text-left'>
      <Link
        href={id === 1 ? `/demos/${id}` : id === 2 || id === 4 || id === 5 || id === 6 ? 'https://cal.com/usatii/onboarding' : '/editor'}
        className={`self-start items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium shadow transition bg-fuchsia-600/80 text-white hover:bg-fuchsia-600`}
        >
        {id == 1 ? 'Purchase' : id == 2 || id == 4 || id == 5 || id == 6 ? 'Book Demo' : 'Get Access'}
        </Link>
      </div>
      </div>
    </motion.article>
  );
}

export default function SystemsBentoGrid() {
  return (
    <section className="relative isolate overflow-hidden pt-[100px] mb-5 text-black">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h3 className="text-2xl font-medium tracking-tight sm:text-4xl">
          What we build today helps you make better decisions <span className='text-indigo-500'>tomorrow</span>.
        </h3>
        <p className="mt-4 text-lg text-center text-neutral-800">
        <span className='text-indigo-500'>Our</span> products track what works in real-time.<br /><span className='text-indigo-500'>Our</span> team builds your marketing strategy.<br /><span className='text-indigo-500'>You</span> use the data to help you power operations.
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
