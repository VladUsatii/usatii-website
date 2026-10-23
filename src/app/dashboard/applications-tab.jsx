'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { APPLICATION_SECTIONS } from '@/lib/careers/application-fields';
import { applicationAdminPath } from '@/lib/careers/admin-links';

async function getApplications(params) {
  const response = await fetch(`/api/admin/careers?${params}`, { cache: 'no-store' });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Unable to load applications.');
  return payload.applications || [];
}

export default function ApplicationsTab() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('application');
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(requestedId);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ limit: '120' });
      if (query.trim()) params.set('q', query.trim());
      let rows = await getApplications(params);
      if (requestedId && !rows.some(row => String(row.id) === requestedId)) {
        const exact = await getApplications(new URLSearchParams({ id: requestedId }));
        rows = [...exact, ...rows];
        if (!exact.length) setError('The linked application was not found.');
      }
      setApplications(rows);
    } catch (caught) { setError(caught.message); }
    finally { setLoading(false); }
  }, [query, requestedId]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSelectedId(requestedId); }, [requestedId]);
  const selected = applications.find(row => String(row.id) === String(selectedId)) || (!requestedId ? applications[0] : null);
  function select(id) {
    setSelectedId(String(id));
    window.history.replaceState(window.history.state, '', applicationAdminPath(id));
  }
  return <section className="space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-2xl font-semibold text-slate-950">Applications</h1><button type="button" onClick={load} disabled={loading} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-50">{loading ? 'Loading…' : 'Refresh'}</button></header>
    <label className="block text-sm text-slate-600">Search candidates or roles<input type="search" value={query} onChange={event => setQuery(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2" /></label>
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {applications.map(row => <button key={row.id} type="button" onClick={() => select(row.id)} aria-pressed={selected?.id === row.id} className={`block w-full border-b border-slate-100 p-4 text-left ${selected?.id === row.id ? 'bg-violet-50' : 'hover:bg-slate-50'}`}><p className="font-semibold text-slate-950">{row.fullName}</p><p className="mt-1 text-sm text-slate-600">{row.roleTitle}</p><p className="mt-2 text-xs text-slate-500">{row.submittedAt ? new Date(row.submittedAt).toLocaleString() : ''}</p></button>)}
        {!applications.length && !loading && <p className="p-5 text-sm text-slate-500">No applications found.</p>}
      </div>
      {selected && <article className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 md:p-7">
        <header><h2 className="text-2xl font-semibold text-slate-950">{selected.fullName}</h2><p className="mt-2 text-sm text-slate-600">{selected.roleTitle}</p><a href={`mailto:${selected.email}`} className="mt-2 inline-block break-all text-sm text-violet-700 underline">{selected.email}</a><p className="mt-2 text-xs text-slate-500">Application #{selected.id}</p></header>
        {selected.resumeAvailable && <a href={`/api/admin/careers/${selected.id}/resume`} className="inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">Download résumé · {selected.resumeName}</a>}
        {APPLICATION_SECTIONS.map(section => {
          const fields = section.fields.filter(field => selected.answers?.[field.name]?.length);
          if (!fields.length) return null;
          return <section key={section.title} className="border-t border-slate-200 pt-5"><h3 className="font-semibold text-slate-950">{section.title}</h3><dl className="mt-4 space-y-4">{fields.map(field => <div key={field.name}><dt className="text-xs font-medium text-slate-500">{field.label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">{Array.isArray(selected.answers[field.name]) ? selected.answers[field.name].join(', ') : String(selected.answers[field.name])}</dd></div>)}</dl></section>;
        })}
        {!Object.keys(selected.answers || {}).length && <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{selected.notes || 'No additional answers provided.'}</p>}
      </article>}
    </div>
  </section>;
}
