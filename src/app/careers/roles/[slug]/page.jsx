import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import PublicLayout from '../../_components/public-layout';
import { roles } from '@/lib/careers/roles';
import styles from './role-description.module.css';
import ApplicationForm from '../application-form';

export function generateStaticParams() {
  return roles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const role = roles.find(role => role.slug === slug);
  if (!role) return { title: 'Role not found' };
  return {
    title: role.title,
    description: `${role.title} · ${role.team} · ${role.location} (${role.arrangement}). ${role.status}.`,
    alternates: { canonical: `/careers/roles/${role.slug}` },
  };
}

export default async function RolePage({ params }) {
  const { slug } = await params;
  const role = roles.find(role => role.slug === slug);
  if (!role) notFound();
  return <PublicLayout className="bg-white text-neutral-950">
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-20">
      <Link href="/careers/roles" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-violet-700"><ArrowLeft size={16} aria-hidden="true" /> All available roles</Link>
      <header className="mt-10 border-b border-neutral-200 pb-10">
        <h1 className="max-w-3xl text-3xl font-medium leading-tight tracking-[-0.045em] md:text-5xl">{role.title}</h1>
        <p className="mt-5 text-sm leading-6 text-neutral-600">{role.displayLocation || `${role.location} (${role.arrangement})`}</p>
        <p className="mt-5 text-xs leading-5 text-neutral-500">{role.status}</p>
        <a href="#apply" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800">Apply for this role <ArrowUpRight size={16} aria-hidden="true" /></a>
      </header>
      <div className="mt-10 grid items-start gap-10">
        <article className="min-w-0 space-y-5 text-sm leading-6 text-neutral-600">
          <ReactMarkdown components={{
            a: ({ href, children }) => {
              const domain = href?.startsWith('https://') ? new URL(href).hostname : 'usatii.com';
              const icon = domain === 'usatii.com'
                ? '/brand/usatii-media-orb-icon.svg'
                : `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
              return <a href={href} className={styles.referenceLink} style={{ '--reference-icon': `url("${icon}")` }}>{children}</a>;
            },
            h2: ({ children }) => <h2 className="pt-7 text-2xl font-medium leading-tight tracking-[-0.03em] text-neutral-950 first:pt-0">{children}</h2>,
            p: ({ children }) => <p>{children}</p>,
            ul: ({ children }) => <ul className="list-disc space-y-4 pl-5 marker:text-neutral-400">{children}</ul>,
          }}>{role.description}</ReactMarkdown>
        </article>
        <aside className="border-t border-neutral-200 pt-6">
          <h2 className="text-lg font-medium">Position details</h2>
          <dl className="mt-6 space-y-5 text-sm leading-6">
            {[['Employment', role.employment], ['Compensation', role.compensation], ['Location', role.locationDetails || `${role.location} (${role.arrangement})`], ['Travel', role.travel], ['Openings', role.openings], ['Status', role.status]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt className="font-medium text-neutral-950">{label}</dt><dd className="mt-1 text-neutral-600">{value}</dd></div>)}
          </dl>
        </aside>
        <ApplicationForm roleId={role.slug} roleTitle={role.title} />
      </div>
    </div>
  </PublicLayout>;
}
