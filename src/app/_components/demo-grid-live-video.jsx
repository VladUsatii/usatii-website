'use client';
import React from 'react';

const VIDEOS = [
  { id: '1', title: 'Video for Chris Stocks', src: 'https://player.vimeo.com/video/1111406856?badge=0&autopause=0&player_id=0&app_id=58479' },
  { id: '2', title: 'Video for Spectres', src: 'https://player.vimeo.com/video/1111404306' },
  { id: '3', title: 'Video for Bigbrain', src: 'https://player.vimeo.com/video/1111404009' },
  { id: '4', title: 'Video for Airbo', src: 'https://player.vimeo.com/video/1111402315' },
  { id: '5', title: 'Video for Usatii', src: 'https://player.vimeo.com/video/1111401934' },
  { id: '6', title: 'Video for KALM', src: 'https://player.vimeo.com/video/1111401779' },
  { id: '7', title: 'Video for James', src: 'https://player.vimeo.com/video/1111401393' },
  { id: '8', title: 'Video for TheCPADude', src: 'https://player.vimeo.com/video/1111411624?share=copy#t=0' },
];

export default function DemoGridWithLiveVideo() {
  const [currentId, setCurrentId] = React.useState(VIDEOS[0].id);

  const current = React.useMemo(
    () => VIDEOS.find(v => v.id === currentId) ?? VIDEOS[0],
    [currentId]
  );

  return (
    <section className="relative isolate overflow-hidden pt-[100px] mb-5">
      {/* Top labels forced black for visibility */}
      <div className="mx-auto max-w-6xl px-6 text-center lg:px-8 text-black">
        <h3 className="text-3xl font-black tracking-tight sm:text-5xl">
          Content is king.
        </h3>
        <p className="mt-3 text-lg font-medium">
          Here is some of our proudest work.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-[minmax(0,1fr)_64px] lg:grid-cols-[minmax(0,1fr)_520px]">
          {/* Left: sticky 9:16 player */}
          <div className="lg:sticky lg:top-24">
            <div className="mx-auto w-full max-w-[560px]">
              <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-neutral-950 ring-1 ring-inset ring-white/10 shadow-2xl">
                <iframe
                  key={current.src}
                  src={current.src}
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={current.title}
                />
                {/* Prominent TOP label */}
                <div className="absolute left-3 right-3 top-3">
                  <div className="flex items-center gap-2 rounded-2xl bg-black/80 px-4 py-2 text-white backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm ring-1 ring-white/20">
                    <span className="text-[11px] uppercase tracking-wider text-white/80">preview</span>
                    <span className="truncate text-base font-semibold">{current.title}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right rail */}
          <aside className="relative">
            {/* Desktop: horizontal scrollable rows with titles + UI toggles */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto snap-x snap-mandatory pr-1">
                <ul className="grid grid-flow-row auto-cols-[minmax(300px,1fr)] gap-3">
                  {VIDEOS.map((v, idx) => {
                    const active = v.id === currentId;
                    return (
                      <li key={v.id}>
                        <button
                          type="button"
                          onClick={() => setCurrentId(v.id)}
                          aria-pressed={active}
                          className={[
                            'flex h-[75px] w-full items-center gap-3 rounded-2xl px-3',
                            'ring-1 ring-inset transition-colors',
                            active
                              ? 'bg-purple-500 text-white/80 ring-purple-300'
                              : 'bg-neutral-100 text-black ring-neutral-300 hover:bg-neutral-200'
                          ].join(' ')}
                        >
                          {/* index */}
                          <div
                            className={[
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                              active ? 'bg-white/15 text-white/60' : 'bg-black/15 text-white'
                            ].join(' ')}
                          >
                            {idx + 1}
                          </div>

                          {/* title */}
                          <div className="min-w-0 text-left">
                            <p className="truncate text-sm font-semibold">{v.title}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Small screens: vertical numbered pills */}
            <div className="lg:hidden">
              <div className="max-h-[70vh] overflow-y-auto">
                <ul className="flex flex-col items-stretch gap-2">
                  {VIDEOS.map((v, idx) => {
                    const active = v.id === currentId;
                    return (
                      <li key={v.id}>
                        <button
                          type="button"
                          onClick={() => setCurrentId(v.id)}
                          aria-pressed={active}
                          className={[
                            'flex cursor-pointer h-12 w-12 items-center justify-center rounded-full ring-1 transition-colors',
                            active
                              ? 'bg-purple-500 text-purple-300 ring-purple-400/50 '
                              : 'bg-neutral-900 text-white ring-white/10 hover:bg-neutral-800'
                          ].join(' ')}
                          aria-label={`Show ${v.title}`}
                          title={v.title}
                        >
                          {idx + 1}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* subtle background polish */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1100px_circle_at_10%_-20%,rgba(250,204,21,0.06),transparent_40%),radial-gradient(800px_circle_at_110%_0%,rgba(250,204,21,0.04),transparent_40%)]"
      />
    </section>
  );
}
