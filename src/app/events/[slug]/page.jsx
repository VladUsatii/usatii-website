import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { events, getEvent } from "@/lib/events";
import { notFound } from "next/navigation";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import { buildEventSchema, buildFounderPersonSchema, buildOrganizationSchema } from "@/lib/trades-schema";

export function generateStaticParams() { return events.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }) {
  const event = getEvent((await params).slug);
  if (!event) return {};
  return { title: event.title, description: event.summary, alternates: { canonical: `/events/${event.slug}` } };
}

export default async function EventPage({ params }) {
  const event = getEvent((await params).slug);
  if (!event) notFound();
  const schemas = [buildOrganizationSchema(), buildFounderPersonSchema(), buildEventSchema(event)];
  return <div className="min-h-screen bg-white text-neutral-950"><Header /><main>
    <SchemaScripts schemas={schemas} />
    <section className="mx-auto max-w-[1180px] px-5 pb-28 pt-10 sm:px-7 lg:pb-36 lg:pt-16">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black"><ArrowLeft className="h-4 w-4" />All events</Link>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_330px] lg:gap-20">
        <div>
          <h1 className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-7xl">{event.title}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">{event.summary}</p>
        </div>
        <aside className="border-t border-neutral-950 pt-5 lg:mt-8">
          <dl className="space-y-6 text-sm"><div><dt className="text-xs text-neutral-500">Date and time</dt><dd className="mt-1 font-medium">{event.dateLabel}<br />{event.timeLabel}</dd></div><div><dt className="text-xs text-neutral-500">Location</dt><dd className="mt-1 font-medium">{event.location}</dd></div><div><dt className="text-xs text-neutral-500">Hosted by</dt><dd className="mt-1 font-medium">{event.organizer}</dd></div></dl>
          <Link href={event.sourceUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">Official event page <ArrowUpRight className="h-4 w-4" /></Link>
        </aside>
      </div>
      <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-8">
        <article className="border-t border-neutral-950 pt-6"><h2 className="text-xl font-medium tracking-[-0.025em]">Why we’re attending</h2><p className="mt-5 leading-7 text-neutral-700">{event.why}</p></article>
        <article className="border-t border-neutral-950 pt-6"><h2 className="text-xl font-medium tracking-[-0.025em]">Who’s attending</h2><p className="mt-5 text-xl font-medium tracking-[-0.025em]">Vlad Usatii</p><p className="mt-1 text-sm text-neutral-500">Founder, Usatii</p></article>
        <article className="border-t border-neutral-950 pt-6"><h2 className="text-xl font-medium tracking-[-0.025em]">We’d like to meet</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-neutral-700">{event.meet.map((item) => <li key={item}>— {item}</li>)}</ul></article>
      </div>
    </section>
  </main><Footer /></div>;
}
