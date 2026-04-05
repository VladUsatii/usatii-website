"use client";

import { useMemo, useState } from "react";

function useActiveDoc(docs, index) {
  return useMemo(() => {
    if (!docs.length) return null;
    return docs[index] || docs[0];
  }, [docs, index]);
}

export default function DocumentationCarousel({ docs }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDoc = useActiveDoc(docs, activeIndex);

  if (!docs.length || !activeDoc) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-950 p-8 text-center text-slate-200">
        Add PDF files to `public/documentation` to populate this viewer.
      </div>
    );
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + docs.length) % docs.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % docs.length);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <iframe
        key={activeDoc.id}
        src={`${activeDoc.url}#toolbar=0&navpanes=0`}
        title={activeDoc.title}
        className="absolute inset-0 h-full w-full border-0 bg-white"
      />

      <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
        <div className="rounded-full border border-slate-300 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
          {activeDoc.index}/{docs.length}
        </div>
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full border border-slate-300 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-400"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          className="rounded-full border border-slate-300 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-400"
        >
          Next
        </button>
      </div>

      <aside className="absolute left-4 top-4 z-30 hidden w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-slate-300/90 bg-white/92 p-5 text-slate-900 shadow-[0_18px_48px_rgba(15,23,42,0.22)] backdrop-blur-md sm:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Documentation Note
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{activeDoc.title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">{activeDoc.summary}</p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          <span className="font-semibold text-slate-900">Purpose: </span>
          {activeDoc.purpose}
        </p>
      </aside>

      <aside className="absolute inset-x-0 bottom-0 z-30 border-t border-slate-300 bg-white/97 px-4 py-4 text-slate-900 backdrop-blur-sm sm:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Documentation Note
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">{activeDoc.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">{activeDoc.summary}</p>
      </aside>
    </div>
  );
}
