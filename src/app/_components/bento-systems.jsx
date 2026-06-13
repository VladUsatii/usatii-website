'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Layers, BarChart2, RefreshCw } from 'lucide-react';

const tiles = [
  {
    id: 1,
    title: 'Operational Software Modernization',
    desc: 'Custom internal systems for organizations that need cleaner intake, task tracking, reporting, permissions, audit trails, and workflow visibility. We replace expensive subscriptions and bad tooling with owned software that teams use professionally and own forever.',
    Icon: Brain,
    span: 'lg:col-span-7 lg:row-span-2',
    href: 'https://cal.com/usatii/onboarding',
    cta: 'Discuss a Pilot',
  },
  {
    id: 2,
    title: 'Workflow & Data Infrastructure',
    desc: 'Dashboards, databases, role-based portals, automations, and integrations that connect daily operations to executive reporting. Built for teams that need a trusted platform for operations.',
    Icon: BarChart2,
    span: 'lg:col-span-5 lg:row-span-1',
    href: 'https://cal.com/usatii/onboarding',
    cta: 'Book Discovery',
  },
  {
    id: 3,
    title: 'Content Operations Systems',
    desc: 'We started in content marketing. Now we also do internal tooling for planning, producing, reviewing, approving, and publishing content across channels. We help teams turn content from an ad hoc creative process into a managed operational pipeline.',
    Icon: Layers,
    span: 'lg:col-span-5 lg:row-span-2',
    href: '/editor',
    cta: 'View Our Systems',
    img: '/USATII_EDITOR_DEMO.gif',
  },
  {
    id: 4,
    title: 'Public-Facing Growth Infrastructure',
    desc: 'Websites, landing pages, lead intake flows, campaign tracking, SEO support, paid search infrastructure, and communications pipelines built to connect public attention with measurable business outcomes.',
    Icon: RefreshCw,
    span: 'lg:col-span-7 lg:row-span-1',
    href: 'https://cal.com/usatii/onboarding',
    cta: 'Discuss Deployment',
  },
];

function BentoTile({ title, desc, Icon, span, img, href, cta }) {
  const isExternal = href.startsWith('http');
  const isMediaTile = Boolean(img);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`group relative col-span-1 overflow-hidden rounded-[28px] ${span}`}
    >
      <div className="absolute inset-0 rounded-[28px] bg-white/80 backdrop-blur-sm" />
      <div className="absolute inset-0 rounded-[28px] border border-neutral-200/80 shadow-[0_16px_60px_-30px_rgba(0,0,0,0.28)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-fuchsia-100/70 via-indigo-50/40 to-transparent" />

      <div
        className={`relative z-10 flex h-full min-h-[260px] flex-col p-6 sm:p-7 ${
          isMediaTile ? 'justify-between' : ''
        }`}
      >
        {isMediaTile ? (
          <>
            <div className="mb-6 overflow-hidden rounded-[22px] border border-neutral-200 bg-neutral-100 shadow-sm">
              <img
                src={img}
                alt={title}
                className="aspect-video w-full object-cover"
              />
            </div>

            <div className="mt-auto">
              <header className="space-y-2 text-left">
                <h4 className="text-xl font-semibold tracking-tight text-neutral-950">
                  {title}
                </h4>
                <p className="max-w-[60ch] text-sm leading-6 text-neutral-700">
                  {desc}
                </p>
              </header>

              <div className="mt-5 text-left">
                <Link
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className="inline-flex items-center rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-700"
                >
                  {cta}
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200">
              <Icon className="h-6 w-6" />
            </div>

            <header className="space-y-2 text-left">
              <h4 className="text-xl font-semibold tracking-tight text-neutral-950">
                {title}
              </h4>
              <p className="max-w-[62ch] text-sm leading-6 text-neutral-700">
                {desc}
              </p>
            </header>

            <div className="mt-6 text-left">
              <Link
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                className="inline-flex items-center rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-700"
              >
                {cta}
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
}

export default function SystemsBentoGrid() {
  return (
    <section className="relative isolate overflow-hidden pb-4 pt-[100px] text-black">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h3 className="text-2xl font-medium tracking-tight sm:text-4xl">
          Systems we build today help you make better decisions{' '}
          <span className="text-indigo-500">tomorrow</span>.
        </h3>
        <p className="mt-4 text-lg text-neutral-800">
          <span className="text-indigo-500">We</span> modernize internal workflows,
          public systems, and marketing operations.
          <br />
          <span className="text-indigo-500">You</span> get compliant and efficient data handling, tools, automations, and dashboards.
          <br />
          <span className="text-indigo-500">The result:</span> cleaner execution,
          higher efficiency, and stronger operational control.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:[grid-template-columns:repeat(12,minmax(0,1fr))] lg:auto-rows-[minmax(180px,auto)] lg:px-8">
        {tiles.map((tile) => (
          <BentoTile key={tile.id} {...tile} />
        ))}
      </div>
    </section>
  );
}