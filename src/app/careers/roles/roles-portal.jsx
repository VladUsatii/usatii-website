'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Search } from 'lucide-react';

export default function RolesPortal({ roles }) {
  const [query, setQuery] = useState('');
  const [team, setTeam] = useState('');
  const [location, setLocation] = useState('');
  const filtered = roles.filter(role =>
    `${role.title} ${role.team} ${role.location} ${role.arrangement} ${role.status}`.toLowerCase().includes(query.trim().toLowerCase()) &&
    (!team || role.team === team) && (!location || role.location === location)
  );
  function reset() { setQuery(''); setTeam(''); setLocation(''); }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-16 lg:px-8 lg:pt-24">
      <h1 className="mb-20 text-center text-4xl font-medium tracking-[-0.045em] md:mb-28 md:text-5xl">Careers at USATII</h1>
      <section aria-label="Search available roles" className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
        <div className="relative min-w-48 flex-1">
          <label htmlFor="role-search" className="sr-only">Search available roles</label>
          <Search className="pointer-events-none absolute left-0 top-3.5 h-5 w-5" aria-hidden="true" />
          <input id="role-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={`${filtered.length} ${filtered.length === 1 ? 'role' : 'roles'}`} className="h-12 w-full rounded-none border-0 bg-white pl-10 pr-4 text-base text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950" />
          <span role="status" className="sr-only">{filtered.length} {filtered.length === 1 ? 'role' : 'roles'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {[['Team', 'team', team, setTeam], ['Location', 'location', location, setLocation]].map(([label, field, value, setter]) => (
            <label key={field} className="relative max-w-full">
              <span className="sr-only">{label}</span>
              <select value={value} onChange={event => setter(event.target.value)} className="min-h-12 max-w-full appearance-none rounded-none border-0 bg-white py-2 pr-7 text-base text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950">
                <option value="">All {label.toLowerCase()}s</option>
                {[...new Set(roles.map(role => role[field]))].map(option => <option key={option}>{option}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-4 h-4 w-4" aria-hidden="true" />
            </label>
          ))}
        </div>
      </section>
      <section aria-label="Available roles" className="mt-12 md:mt-16">
        {filtered.map(role => <Link key={role.slug} href={`/careers/roles/${role.slug}`} className="group flex flex-col justify-between gap-6 border-b border-neutral-100 py-8 focus-visible:outline-neutral-950 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-normal leading-6 group-hover:underline group-hover:underline-offset-4">{role.title}</h2>
            <p className="mt-3 text-base leading-6 text-neutral-500">{role.displayLocation || `${role.location} (${role.arrangement})`}</p>
            {role.openings && <p className="mt-3 text-sm leading-6 text-neutral-500">{role.openings}</p>}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-base">View role <ArrowUpRight size={18} aria-hidden="true" /></span>
        </Link>)}
        {!filtered.length && <div className="py-8 text-sm leading-6 text-neutral-500"><p>No matching roles.</p><button onClick={reset} className="mt-3 min-h-11 text-neutral-950 underline underline-offset-4">Clear search and filters</button></div>}
      </section>
    </div>
  );
}
