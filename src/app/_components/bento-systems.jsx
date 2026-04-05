'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Layers, BarChart2, RefreshCw } from 'lucide-react';

const tiles = [
  {
    id: 1,
    title: 'Market Intelligence Beta',
    desc: '24⁄7, AI-powered scraping of industry chatter, social signals, and competitor moves that flow straight into your pipeline to power every strategic decision. Think of this as your Marketing OS. Currently, we are only giving this to Enterprise clients as part of a Web Development Package.',
    Icon: Brain,
    span: 'lg:col-span-7 lg:row-span-2',
    href: '/demos/1',
    cta: 'Purchase',
  },
  {
    id: 2,
    title: 'Feedback formula',
    desc: 'Our clean marketing hubs and analytics tools help us create better ad campaigns that optimize spending and catch attention quickly.',
    Icon: BarChart2,
    span: 'lg:col-span-5 lg:row-span-1',
    href: 'https://cal.com/usatii/onboarding',
    cta: 'Book Demo',
  },
  {
    id: 3,
    title: 'Usatii Editor',
    desc: 'Our in-house editing OS allows you to create anything with the use of AI or by hand. A solid CapCut replacement.',
    Icon: Layers,
    span: 'lg:col-span-5 lg:row-span-2',
    href: '/editor',
    cta: 'Get Access',
    img: '/USATII_EDITOR_DEMO.gif',
  },
  {
    id: 4,
    title: 'Short-form Content Automation',
    desc: 'We can create over 100+ daily pieces of content for your company. It is a first-class mission of ours to help your business be seen and taken seriously in the attention economy.',
    Icon: RefreshCw,
    span: 'lg:col-span-7 lg:row-span-1',
    href: 'https://cal.com/usatii/onboarding',
    cta: 'Book Demo',
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
          What we build today helps you make better decisions{' '}
          <span className="text-indigo-500">tomorrow</span>.
        </h3>
        <p className="mt-4 text-lg text-neutral-800">
          <span className="text-indigo-500">Our</span> content lets us track
          what works in real-time.
          <br />
          <span className="text-indigo-500">Our</span> websites help funnel
          people to your brand.
          <br />
          <span className="text-indigo-500">You</span> use the data we collect
          to power operations.
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