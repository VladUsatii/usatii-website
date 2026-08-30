"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Search } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { capabilityCategories } from "@/lib/software-capabilities";

export default function ResourcesExplorer({ features }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All capabilities");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return features.filter((feature) => {
      const inCategory = category === "All capabilities" || feature.category === category;
      const searchable = `${feature.title} ${feature.summary} ${feature.category}`.toLowerCase();
      return inCategory && (!needle || searchable.includes(needle));
    });
  }, [category, features, query]);

  const groups = capabilityCategories.map((name) => ({ name, items: filtered.filter((feature) => feature.category === name) })).filter((group) => group.items.length);

  return <>
    <div className="mt-16 flex flex-col gap-3 border-y border-neutral-200 py-4 sm:flex-row sm:items-center">
      <label className="relative flex-1"><span className="sr-only">Search capabilities</span><Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search capabilities" className="h-11 w-full bg-transparent pl-7 pr-4 text-sm outline-none placeholder:text-neutral-400" /></label>
      <label className="relative shrink-0"><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 min-w-[230px] cursor-pointer appearance-none bg-white pl-4 pr-10 text-sm font-medium outline-none"><option>All capabilities</option>{capabilityCategories.map((item) => <option key={item}>{item}</option>)}</select><ArrowDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" /></label>
    </div>
    <p className="mt-6 text-sm text-neutral-500">{filtered.length} capabilities</p>

    <div className="mt-12 space-y-20">
      {groups.map((group) => { const headingId = `capability-${group.name.replaceAll(" ", "-")}`; return <section key={group.name} aria-labelledby={headingId}>
        <div className="flex items-end justify-between border-b border-neutral-950 pb-4"><h2 id={headingId} className="text-2xl font-medium tracking-[-0.03em]">{group.name}</h2><span className="text-xs text-neutral-500">{group.items.length}</span></div>
        <div>{group.items.map((feature) => <button key={feature.id} type="button" onClick={() => setSelected(feature)} className="group -mx-5 grid w-[calc(100%+2.5rem)] gap-4 border-b border-neutral-200 px-5 py-7 text-left transition-colors hover:border-violet-600 hover:bg-accent hover:text-white sm:-mx-7 sm:w-[calc(100%+3.5rem)] sm:grid-cols-[minmax(220px,0.85fr)_minmax(0,1.4fr)_auto] sm:items-center sm:px-7">
          <h3 className="text-lg font-medium tracking-[-0.02em] sm:text-xl">{feature.title}</h3><p className="max-w-2xl text-sm leading-6 text-neutral-600 transition-colors group-hover:text-white/80">{feature.summary}</p><ArrowRight className="hidden h-5 w-5 transition-transform group-hover:translate-x-1 sm:block" />
        </button>)}</div>
      </section>; })}
    </div>

    {!filtered.length && <div className="py-24 text-center"><p className="text-lg font-medium">No matching capabilities.</p><button type="button" onClick={() => { setQuery(""); setCategory("All capabilities"); }} className="mt-3 text-sm font-semibold text-violet-700">Clear filters</button></div>}

    <Sheet open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}><SheetContent side="right" className="w-full overflow-y-auto border-l border-neutral-200 bg-white p-0 sm:max-w-[620px]">
      {selected && <><SheetHeader className="border-b border-neutral-200 px-6 pb-8 pt-16 sm:px-10 sm:pb-10 sm:pt-20"><SheetTitle className="max-w-lg text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-neutral-950 sm:text-5xl">{selected.title}</SheetTitle><SheetDescription className="mt-5 max-w-xl text-base leading-7 text-neutral-600">{selected.summary}</SheetDescription></SheetHeader>
      <div className="px-6 py-8 sm:px-10 sm:py-10"><h3 className="text-xl font-medium tracking-[-0.025em]">How it is structured</h3><div className="mt-8">{selected.architecture.map((node, index) => <div key={node.label} className="relative pb-9 pl-10 last:pb-0">{index < selected.architecture.length - 1 && <div className="absolute left-[11px] top-6 h-[calc(100%-0.25rem)] w-px bg-neutral-300" />}<div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-semibold text-white">{index + 1}</div><h4 className="text-base font-semibold">{node.label}</h4><p className="mt-2 text-sm leading-6 text-neutral-600">{node.detail}</p></div>)}</div></div></>}
    </SheetContent></Sheet>
  </>;
}
