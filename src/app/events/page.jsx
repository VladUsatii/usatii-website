import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { events } from "@/lib/events";

export const metadata = {
  title: "Events",
  description: "See where Usatii is attending, learning, and meeting partners next.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return <div className="min-h-screen bg-white text-neutral-950"><Header /><main>
    <section className="mx-auto max-w-[1180px] px-5 pb-28 pt-16 sm:px-7 lg:pb-36 lg:pt-24">
      <h1 className="max-w-3xl text-5xl font-medium leading-[0.96] tracking-[-0.055em] sm:text-7xl">Where to find Usatii</h1>
      <p className="mt-7 max-w-xl text-base leading-7 text-neutral-600">We show up where technology, operations, and ambitious regional businesses meet. If you’ll be there too, let’s make the introduction in advance.</p>
      <div className="mt-20 flex items-center justify-between border-b border-neutral-950 pb-4"><h2 className="text-2xl font-medium tracking-[-0.03em]">Upcoming</h2><span className="text-xs text-neutral-500">{events.length} events</span></div>
      <div>
        {events.map((event) => <Link key={event.slug} href={`/events/${event.slug}`} className="group -mx-5 grid gap-5 border-b border-neutral-200 px-5 py-8 transition-colors duration-200 hover:border-violet-600 hover:bg-accent hover:text-white sm:-mx-7 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:px-7">
          <div><p className="text-sm font-semibold">{event.dateLabel}</p></div>
          <div><h3 className="max-w-2xl text-xl font-medium tracking-[-0.025em] sm:text-2xl">{event.title}</h3><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-500 transition-colors group-hover:text-white/75"><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{event.timeLabel}</span><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.location}</span></div></div>
          <ArrowRight className="hidden h-5 w-5 transition-transform group-hover:translate-x-1 sm:block" />
        </Link>)}
      </div>
      <div className="mt-24 border-t border-neutral-200 pt-8"><h2 className="text-2xl font-medium tracking-[-0.03em]">Past events</h2><p className="mt-3 text-sm text-neutral-500">The archive will appear here after each event concludes.</p></div>
    </section>
  </main><Footer /></div>;
}
