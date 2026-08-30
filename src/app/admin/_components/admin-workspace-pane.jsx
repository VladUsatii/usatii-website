'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const TOOLS = [
  { id: 'team', label: 'Team Directory', description: 'People, roles, departments, and contact details.', subtitle: 'Role or department', statuses: ['active', 'inactive'] },
  { id: 'access', label: 'Access Queue', description: 'Account unlocks and access-change requests.', subtitle: 'Requester or system', statuses: ['pending', 'approved', 'rejected'] },
  { id: 'recruiting', label: 'Recruiting Pipeline', description: 'Candidates and review stages.', subtitle: 'Role applied for', statuses: ['new', 'screening', 'interview', 'offer', 'rejected'] },
  { id: 'media', label: 'Media Library', description: 'Important creative assets and source links.', subtitle: 'Asset type or owner', statuses: ['active', 'archived'] },
  { id: 'content', label: 'Content Registry', description: 'Reusable page models, messages, and publishing records.', subtitle: 'Model or channel', statuses: ['draft', 'review', 'published', 'archived'] },
];

const EMPTY_FORM = { title: '', subtitle: '', status: '', details: '', url: '' };

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { ...options, cache: 'no-store' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status}).`);
  return payload;
}

export default function AdminWorkspacePane() {
  const [activeType, setActiveType] = useState('team');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const tool = TOOLS.find((entry) => entry.id === activeType) || TOOLS[0];
  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (item.type !== activeType) return false;
      if (!needle) return true;
      return [item.title, item.subtitle, item.status, item.details].some((value) => String(value || '').toLowerCase().includes(needle));
    });
  }, [activeType, items, query]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await fetchJson('/api/admin/workspace');
      setItems(Array.isArray(payload.items) ? payload.items : []);
    } catch (caughtError) {
      setError(caughtError.message || 'Unable to load workspace tools.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  function selectTool(type) {
    setActiveType(type);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setQuery('');
    setError('');
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({ title: item.title, subtitle: item.subtitle, status: item.status, details: item.details, url: item.url });
  }

  async function saveItem(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = await fetchJson('/api/admin/workspace', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editingId, type: activeType, status: form.status || tool.statuses[0] }),
      });
      setItems((current) => editingId
        ? current.map((item) => item.id === editingId ? payload.item : item)
        : [payload.item, ...current]);
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (caughtError) {
      setError(caughtError.message || 'Unable to save item.');
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(item, status) {
    setError('');
    try {
      const payload = await fetchJson('/api/admin/workspace', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, status }),
      });
      setItems((current) => current.map((entry) => entry.id === item.id ? payload.item : entry));
    } catch (caughtError) {
      setError(caughtError.message || 'Unable to update status.');
    }
  }

  async function removeItem(item) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setError('');
    try {
      await fetchJson('/api/admin/workspace', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }),
      });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      if (editingId === item.id) { setEditingId(null); setForm(EMPTY_FORM); }
    } catch (caughtError) {
      setError(caughtError.message || 'Unable to delete item.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {TOOLS.map((entry) => {
          const count = items.filter((item) => item.type === entry.id).length;
          return (
            <button key={entry.id} type="button" onClick={() => selectTool(entry.id)} className={`cursor-pointer rounded-xl border p-4 text-left transition ${activeType === entry.id ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-200 bg-white hover:border-neutral-400'}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] opacity-60">{count} records</p>
              <p className="mt-2 font-semibold">{entry.label}</p>
              <p className="mt-1 text-xs leading-5 opacity-65">{entry.description}</p>
            </button>
          );
        })}
      </div>

      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <form onSubmit={saveItem} className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">{editingId ? 'Edit record' : 'New record'}</p>
          <h3 className="mt-1 text-xl font-semibold">{tool.label}</h3>
          <div className="mt-4 grid gap-3">
            <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder={activeType === 'team' ? 'Name' : 'Title'} className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black" />
            <input value={form.subtitle} onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))} placeholder={tool.subtitle} className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black" />
            <select value={form.status || tool.statuses[0]} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black">
              {tool.statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <input value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} placeholder="Related URL (optional)" className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black" />
            <textarea rows={5} value={form.details} onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))} placeholder="Notes and details" className="resize-y rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black" />
            <div className="flex gap-2">
              <button disabled={saving} className="cursor-pointer rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add record'}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} className="cursor-pointer rounded-md border border-neutral-300 px-4 py-2 text-sm">Cancel</button> : null}
            </div>
          </div>
        </form>

        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Records</p><h3 className="mt-1 text-xl font-semibold">{tool.label}</h3></div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search…" className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black" />
          </div>
          {loading ? <p className="mt-6 text-sm text-neutral-500">Loading…</p> : visibleItems.length === 0 ? <p className="mt-6 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center text-sm text-neutral-500">No records yet.</p> : (
            <div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
              {visibleItems.map((item) => (
                <article key={item.id} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_140px_auto] md:items-start">
                  <div><p className="font-semibold text-neutral-950">{item.title}</p>{item.subtitle ? <p className="mt-1 text-sm text-neutral-500">{item.subtitle}</p> : null}{item.details ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">{item.details}</p> : null}{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-violet-700 underline">Open resource</a> : null}</div>
                  <select value={item.status} onChange={(event) => updateStatus(item, event.target.value)} className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none">
                    {tool.statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <div className="flex gap-2"><button type="button" onClick={() => startEdit(item)} className="cursor-pointer text-xs font-semibold text-neutral-700 underline">Edit</button><button type="button" onClick={() => removeItem(item)} className="cursor-pointer text-xs font-semibold text-rose-700 underline">Delete</button></div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
