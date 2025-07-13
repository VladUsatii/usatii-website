// app/demos/[id]/page.jsx
'use client';

import { useMemo, useState, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { Check, BarChart3, Info, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Metric from '../_components/metric';

/* -------------------------------------------------------------------------- */
/* demo catalogue (swap for cms / api later)                                  */
/* -------------------------------------------------------------------------- */
const DEMOS = [
  {
    id: '1',
    title: 'Market intelligence.',
    tagline: '24⁄7 scraping of industry chatter, social signals, and competitor moves flows into a data bank powering every strategic decision. In this video, Vlad explains our market intelligence system and how it can benefit you.',
    video: '/',
    bullets: [
      'Autonomous scrapers monitor ~100 sources every 5 minutes for maximal topic relevancy.',
      'Recommendation engines built to filter data banks of top performers.',
      'In-house, multi-step reasoning models allow us to piece together high-quality content scripts for high engagement.',
    ],
    kpis: [
      { label: 'queries / day',         value: 185000 },
      { label: 'avg. latency',          value: 2.3, unit: 's' },
      { label: 'cost / 1k rows',        value: 0.07, unit: '$' },
      { label: 'sources tracked',       value: 104 },
      { label: 'content scripts / week',value: 320 },
      { label: 'signal-to-noise ratio', value: 93, unit: '%' },
      { label: 'engagement lift',       value: 4.7, unit: 'x' },
      { label: 'competitive insights / mo', value: 260 },
    ],
    steps: [
      'Webhooks trigger in-house fetch cycles',
      'LLM functions enrich & normalize content',
      'Scores push to our analytics hub',
      'Weekly retro auto-generates improvement PR',
    ],
    faqs: [
      {
        q: 'Can I use my own data warehouse?',
        a: 'Yes. Our engine can handle packaged, external data by default, BUT: we can not make any promises that your data is superior for marketing inference.',
      },
      {
        q: 'How long until we see lift?',
        a: 'Most clients see the first actionable edge in week 2, with statistically significant ROI by day 50.',
      },
      {
        q: 'What does your onboarding look like?',
        a: 'A 30-min kickoff call for some housekeeping - then we fire up our intelligence systems for market research and start creating content same-day.',
      },
    ]
  },
];

/* -------------------------------------------------------------------------- */
/* cheap, generic player wrapper                                              */
/* -------------------------------------------------------------------------- */
function Media({ src }) {
  const [showVid, setShowVid] = useState(false);
  const isIframe = /youtube\.com|youtu\.be|vimeo\.com/.test(src);

  const handleClick = useCallback(() => setShowVid(true), []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl ring-1 ring-neutral-300/10">
      {/* poster overlay */}
      {!showVid && (
        <button
          onClick={handleClick}
          className="absolute inset-0 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm"
        >
          <PlayCircle className="h-20 w-20 text-white/80 transition hover:scale-110" />
        </button>
      )}

      {/* actual media */}
      {showVid && (
        isIframe ? (
          <iframe
            src={src}
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video
            src={src}
            controls
            playsInline
            preload="none"
            className="h-full w-full bg-black object-cover"
          />
        )
      )}

      {/* frosted border */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-white/3 to-transparent" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* page                                                                       */
/* -------------------------------------------------------------------------- */
export default function DemoPage() {
  const { id } = useParams();
  const demo = useMemo(() => DEMOS.find((d) => d.id === id), [id]);
  if (!demo) notFound();

  return (
    <main className="relative isolate min-h-screen bg-black text-neutral-100">
      {/* Brand */}
      <Link href="/">
        <h1 className="font-black pt-8 text-center text-md text-neutral-600 hover:text-neutral-500 transition-colors">
          USATII MEDIA
        </h1>
      </Link>

      {/* hero */}
      <section className="mx-auto max-w-5xl px-6 pt-10 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl"
        >
          {demo.title}
        </motion.h1>
        <div className='flex items-center justify-center'>
        <div className='max-w-[650px] w-full'>
          <p className="mt-4 text-center text-md text-neutral-500">{demo.tagline}</p>
        </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 90 }}
          className="mx-auto mt-12"
        >
          <Media src={demo.video} />
        </motion.div>
      </section>

      {/* bullets */}
      <section className="mx-auto mt-16 grid max-w-3xl gap-6 px-6 lg:px-8">
        <h3 className='font-black text-3xl text-white'>Key points</h3>
        {demo.bullets.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-md"
          >
            <Check className="mt-0.5 h-5 w-5 flex-none text-fuchsia-400" />
            <p className="text-sm leading-snug text-neutral-200">{b}</p>
          </motion.div>
        ))}
      </section>

      {/* kpis */}
      <section className="mx-auto mt-16 max-w-3xl px-6 lg:px-8">
        <h3 className='font-black text-3xl text-white'>Average KPIs</h3>
      </section>
      <section className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 lg:px-8">
        {demo.kpis.map((k) => <Metric key={k.label} {...k} />)}
      </section>

      {/* timeline */}
      <section className="mx-auto mt-24 max-w-3xl px-6 lg:px-8">
      <h2 className="text-2xl font-bold">How it works</h2>
      <ol className="mt-6 border-l border-neutral-700/40 pl-6">
        {demo.steps.map((step, i) => (
          <motion.li
            key={step}
            initial={{ opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative mb-10 last:mb-0"
          >
            <span className="absolute -left-[30px] top-0 h-3 w-3 rounded-full bg-fuchsia-400" />
            <p className="text-neutral-200">{step}</p>
          </motion.li>
        ))}
      </ol>
    </section>

      {/* faq */}
      <section className="mx-auto mt-24 max-w-3xl px-6 lg:px-8">
        <h2 className="text-2xl font-black italic">GENERAL FAQ</h2>
        <p className='text-sm text-neutral-100'>Don't be left in the dark. Ask good questions, get good answers. Read <Link className='text-neutral-400 underline hover:text-neutral-600' href="http://www.catb.org/~esr/faqs/hacker-howto.html">this</Link> and <Link className='text-neutral-400 underline hover:text-neutral-600' href="http://www.catb.org/~esr/faqs/smart-questions.html">this</Link> to understand what a good question looks like. If you have such a question, please email vladusatii@gmail.com, our founder, for assistance.</p>
        <div className="mt-6 divide-y divide-neutral-700/50">
          {demo.faqs.map(({ q, a }, i) => (
            <details key={q} className="group py-4 transition-colors hover:bg-white/5 hover:backdrop-blur-md">
              <summary className="flex cursor-pointer list-none items-start gap-2 text-neutral-100">
                <Info className="mt-0.5 h-5 w-5 flex-none text-fuchsia-300 transition-transform group-open:rotate-90" />
                <span className="flex-1 select-none text-sm font-medium">{q}</span>
              </summary>
              <p className="mt-2 pl-7 text-sm text-neutral-300">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="text-center mt-20 pb-20 flex flex-col items-center justify-center gap-y-8">
        <h2 className="text-2xl font-black italic">
          READY TO PLUG OUR SYSTEMS<br />INTO YOUR STACK?
        </h2>
        <Link
          href="/contact"
          className="items-center gap-1 rounded-xl bg-fuchsia-600 px-5 py-3 w-fit text-sm font-bold text-white shadow-md transition hover:bg-fuchsia-500"
        >
          Book a call with Vlad
        </Link>
      </section>
    </main>
  );
}
