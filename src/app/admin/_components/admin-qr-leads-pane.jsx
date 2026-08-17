'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function csvCell(value) {
  return `"${String(value || '').replaceAll('"', '""')}"`;
}

export default function AdminQrLeadsPane() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/qr-leads', { cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Unable to load QR leads.');
      setLeads(payload.leads || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return leads;
    return leads.filter((lead) => `${lead.fullName} ${lead.phone}`.toLowerCase().includes(needle));
  }, [leads, query]);

  function exportCsv() {
    const rows = [['Name', 'Phone', 'Campaign', 'Submitted'], ...filtered.map((lead) => [lead.fullName, lead.phone, lead.campaign, lead.createdAt])];
    const blob = new Blob([rows.map((row) => row.map(csvCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usatii-qr-leads.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-violet-700">Total QR leads</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-950">{leads.length}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or phone" className="min-w-64 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500" />
        <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"><RefreshCw className="h-4 w-4" /> Refresh</button>
        <button type="button" onClick={exportCsv} disabled={!filtered.length} className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"><Download className="h-4 w-4" /> Export CSV</button>
      </div>
      {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Campaign</th><th className="px-4 py-3">Submitted</th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((lead) => <tr key={lead.id}><td className="px-4 py-3 font-medium text-neutral-950">{lead.fullName}</td><td className="px-4 py-3"><a className="text-violet-700 hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a></td><td className="px-4 py-3 text-neutral-600">{lead.campaign}</td><td className="px-4 py-3 text-neutral-600">{formatDateTime(lead.createdAt)}</td></tr>)}
            {!loading && !filtered.length ? <tr><td colSpan="4" className="px-4 py-10 text-center text-neutral-500">No QR leads found.</td></tr> : null}
            {loading ? <tr><td colSpan="4" className="px-4 py-10 text-center text-neutral-500">Loading leads…</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
