'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Boxes,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  MessageCircle,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLiveChatPane from '@/app/admin/_components/admin-live-chat-pane';
import AdminTelemetryPane from '@/app/admin/_components/admin-telemetry-pane';
import CatalogTab from '@/app/dashboard/catalog-tab';
import CalendarTab from '@/app/dashboard/calendar-tab';
import LibraryTab from '@/app/dashboard/library-tab';
import CustomerWorkspace from '@/app/dashboard/customer-workspace';
import { AcademyTab as RichAcademyTab, CourseBuilderTab } from '@/app/dashboard/academy-tab';

const TABS = [
  { id: 'overview', label: 'Overview', note: 'Business intelligence', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', note: 'Clients and workspaces', icon: Users },
  { id: 'catalog', label: 'Catalog', note: 'Software and pricing', icon: Boxes },
  { id: 'calendar', label: 'Calendar', note: 'Calls and milestones', icon: CalendarClock },
  { id: 'library', label: 'Library', note: 'Shared company documents', icon: Library },
  { id: 'live-chat', label: 'Live Chat', note: 'Website inbox', icon: MessageCircle },
  { id: 'academy', label: 'Academy', note: 'Assigned courses', icon: GraduationCap },
  { id: 'course-builder', label: 'Course Builder', note: 'Create and edit courses', icon: BookOpen },
];

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { ...options, cache: 'no-store' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status}).`);
  return payload;
}

function TabList({ activeTab, onSelect, rail = false }) {
  return (
    <div className={rail ? 'mx-auto flex w-full max-w-[86px] flex-col gap-1.5 pb-2' : 'flex w-full flex-col gap-2'}>
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`relative flex w-full items-center border text-center transition ${rail ? 'min-h-[64px] flex-col justify-center gap-1.5 rounded-2xl px-1.5 py-2' : 'min-h-[54px] justify-start gap-3 rounded-xl px-3 py-2'} ${active ? 'border-violet-400 bg-violet-100/70 text-slate-950 shadow-sm' : 'border-slate-200 bg-white text-slate-800 hover:border-violet-300 hover:bg-violet-50'}`}
          >
            <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className={rail ? 'max-w-full text-[10.5px] font-bold leading-tight' : 'text-sm font-bold leading-tight'}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DashboardHero({ email, onSelect }) {
  const [query, setQuery] = useState('');
  const name = String(email || 'there').split('@')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const results = TABS.filter((tab) => `${tab.label} ${tab.note}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{greeting}, {name}.</h1>
        <label className="mt-5 flex w-full items-center gap-3 rounded-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
          <Search className="h-4 w-4 text-slate-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search features..." className="min-w-0 flex-1 bg-transparent outline-none" />
        </label>
        {query ? (
          <div className="mt-3 grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:grid-cols-2">
            {results.map((tab) => <button key={tab.id} type="button" onClick={() => { onSelect(tab.id); setQuery(''); }} className="rounded-xl p-3 text-left hover:bg-slate-50"><p className="text-sm font-bold">{tab.label}</p><p className="mt-1 text-xs text-slate-500">{tab.note}</p></button>)}
            {!results.length ? <p className="p-3 text-sm text-slate-500">No matching feature.</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Stat({ label, value, note }) {
  return <div className="border border-slate-300 bg-white p-4"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>{note ? <p className="mt-1 text-xs text-slate-500">{note}</p> : null}</div>;
}

function OverviewTab({ email, onSelect }) {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [section, setSection] = useState('operations');
  useEffect(() => { fetchJson('/api/admin/overview?clientId=all').then(setOverview).catch((caught) => setError(caught.message)); }, []);
  const totals = overview?.totals || {};
  const sections = [['operations','Operations'],['attention','Attention queue'],['billing','Billing'],['activity','Recent activity'],['acquisition','Acquisition']];
  const dollars = (cents) => (Number(cents || 0) / 100).toLocaleString(undefined,{style:'currency',currency:'USD'});
  return (
    <div className="space-y-5">
      <DashboardHero email={email} onSelect={onSelect} />
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      <section className="lg:grid lg:grid-cols-[184px_minmax(0,1fr)] lg:items-start lg:gap-5">
        <nav className="sticky top-24 hidden space-y-1 lg:block">
          {sections.map(([id,label]) => <button type="button" onClick={()=>setSection(id)} key={id} className={`block w-full border-l-2 px-3 py-2 text-left text-sm font-semibold ${section===id ? 'border-violet-500 text-slate-950' : 'border-transparent text-slate-500 hover:text-slate-950'}`}>{label}</button>)}
        </nav>
        <div>
          <header className="mb-6"><p className="text-3xl font-semibold leading-none tracking-tight text-slate-950">{sections.find(([id])=>id===section)?.[1]}</p></header>
          {section==='operations'?<div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Clients" value={totals.clientCount ?? '—'} note="portal accounts" /><Stat label="Active Work" value={totals.activeWork ?? '—'} note="tracked deliverables" /><Stat label="Blocked" value={totals.blockedWork ?? '—'} note="requires intervention" /><Stat label="Late" value={totals.lateWork ?? '—'} note="past due" /><Stat label="Ready for Review" value={totals.readyForReview ?? '—'} note="awaiting action" /><Stat label="Unpaid Invoices" value={totals.unpaidInvoices ?? '—'} note="open balances" /><Stat label="Open Balance" value={dollars(totals.unpaidAmountCents)} note="accounts receivable" /><Stat label="Paid This Month" value={dollars(totals.paidThisMonthCents)} note="recognized receipts" /></div></div>:null}
          {section==='attention'?<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="divide-y divide-slate-200">{(overview?.ownerAttention||[]).map((item)=><article key={item.clientUserId} className="grid gap-3 p-4 sm:grid-cols-[1fr_180px_1.3fr]"><div><p className="font-bold text-slate-950">{item.clientName}</p><span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase ${item.severity==='high'?'bg-rose-50 text-rose-700':'bg-amber-50 text-amber-700'}`}>{item.severity}</span></div><p className="text-sm font-semibold text-slate-700">{item.issue}</p><p className="text-sm text-slate-500">{item.action}</p></article>)}{!(overview?.ownerAttention||[]).length?<p className="p-8 text-sm text-slate-500">Nothing needs immediate attention.</p>:null}</div></div>:null}
          {section==='billing'?<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Invoice','Customer','Status','Due','Amount'].map((label)=><th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody className="divide-y">{(overview?.unpaidInvoices||[]).map((invoice)=><tr key={invoice.id}><td className="px-4 py-4 font-bold">#{invoice.id}</td><td className="px-4 py-4">{invoice.clientName}</td><td className="px-4 py-4"><span className={`rounded-full px-2 py-1 text-xs font-bold ${invoice.status==='overdue'?'bg-rose-50 text-rose-700':'bg-amber-50 text-amber-700'}`}>{invoice.status}</span></td><td className="px-4 py-4">{invoice.dueDate||'—'}</td><td className="px-4 py-4 font-bold">{dollars(invoice.amountCents)}</td></tr>)}</tbody></table>{!(overview?.unpaidInvoices||[]).length?<p className="p-8 text-sm text-slate-500">No open invoices.</p>:null}</div>:null}
          {section==='activity'?<div className="rounded-2xl border border-slate-200 bg-white p-2">{(overview?.recentActivity||[]).map((item)=><div key={item.id} className="flex gap-3 rounded-xl p-3 hover:bg-slate-50"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-violet-500"/><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><p className="font-bold text-slate-950">{item.clientName}</p><time className="text-xs text-slate-400">{item.happenedAt?new Date(item.happenedAt).toLocaleString():'—'}</time></div><p className="mt-1 text-sm text-slate-600">{item.summary}</p><p className="mt-1 text-[10px] font-black uppercase tracking-wider text-violet-600">{item.type}</p></div></div>)}</div>:null}
          {section==='acquisition'?<AdminTelemetryPane/>:null}
        </div>
      </section>
    </div>
  );
}

function CustomersTab({ clients, loading, onRefresh }) {
  const [query, setQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const visible = clients.filter((client) => `${client.displayName} ${client.company} ${client.email}`.toLowerCase().includes(query.toLowerCase()));
  if (selectedClient) return <CustomerWorkspace client={selectedClient} onBack={() => setSelectedClient(null)} />;
  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-violet-600">Customer operating records</p><h2 className="mt-1 text-2xl font-black text-slate-950">Customers</h2></div><button type="button" onClick={onRefresh} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold">Refresh</button></div>
        <label className="relative mt-4 block"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers, companies, or email…" className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-violet-500"/></label>
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <p className="p-8 text-sm text-slate-500">Loading customers…</p> : visible.length ? <div className="overflow-x-auto"><table className="min-w-[1100px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Customer','Company','Health','Active work','Blocked / late','Review queue','Open balance','Next action'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-200">{visible.map((client) => <tr key={client.userId} onClick={() => setSelectedClient(client)} className="cursor-pointer hover:bg-violet-50/60"><td className="px-4 py-4"><p className="font-bold text-slate-950">{client.displayName || client.email}</p><p className="mt-1 text-xs text-slate-500">{client.email}</p></td><td className="px-4 py-4">{client.company || '—'}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${client.status === 'healthy' ? 'bg-emerald-50 text-emerald-700' : client.status === 'attention' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{client.healthScore}% · {String(client.status || '').replace('_',' ')}</span></td><td className="px-4 py-4 font-semibold">{client.activeWork || 0}</td><td className="px-4 py-4">{client.blockedWork || 0} / {client.lateWork || 0}</td><td className="px-4 py-4">{client.readyForReview || 0}</td><td className="px-4 py-4 font-semibold">${(Number(client.unpaidAmountCents || 0) / 100).toLocaleString(undefined,{minimumFractionDigits:2})}</td><td className="max-w-xs px-4 py-4 text-xs text-slate-600">{client.nextAction}</td></tr>)}</tbody></table></div> : <p className="p-8 text-center text-sm text-slate-500">No customers found.</p>}
      </section>
    </div>
  );
}

function AcademyTab({ onSelect }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJson('/api/admin/education/guides')
      .then((payload) => setGuides(payload.guides || []))
      .catch((caught) => setError(caught.message))
      .finally(() => setLoading(false));
  }, []);

  const courses = guides.length ? guides : [{
    id: 'starter',
    title: 'Operating Software as Organizational Infrastructure',
    summary: 'A practical introduction to mapping workflows, maintaining operational records, using permissions, and measuring whether software is reducing work.',
    questionCount: 4,
    assignments: [],
    filler: true,
  }];

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-violet-600">USATII Academy</p><h2 className="mt-2 text-3xl font-semibold text-slate-950">Assigned learning</h2><p className="mt-2 text-sm text-slate-600">Operational training for the systems we design, build, and maintain.</p></div><button type="button" onClick={() => onSelect('course-builder')} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white">Manage courses</button></header>
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      {loading ? <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading academy…</div> : <div className="grid gap-4">{courses.map((course) => { const completed = (course.assignments || []).filter((assignment) => assignment.completedAt).length; const total = (course.assignments || []).length; const progress = total ? Math.round((completed / total) * 100) : 0; return <article key={course.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">{course.filler ? 'Starter course' : 'USATII course'}</p><h3 className="mt-2 text-2xl font-semibold text-slate-950">{course.title}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{course.summary || 'Internal operating knowledge for the software and workflows USATII maintains.'}</p></div><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">{course.questionCount || 0} checkpoints</span></div><div className="mt-7"><div className="flex justify-between text-xs font-semibold text-slate-500"><span>Team completion</span><span>{progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-violet-600 transition-[width]" style={{ width: `${progress}%` }}/></div></div><button type="button" onClick={() => onSelect('course-builder')} className="mt-6 rounded-full border border-violet-300 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-violet-800">{course.filler ? 'Build this course' : 'Edit assignments'}</button></article>; })}</div>}
    </div>
  );
}

function TemporaryWorkspace({ title, eyebrow, description }) {
  return <div className="mx-auto max-w-[1500px]"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-violet-600">{eyebrow}</p><h2 className="mt-2 text-3xl font-semibold text-slate-950">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p><div className="mt-8 grid min-h-80 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">Persistent USATII workspace integration in progress.</div></section></div>;
}

export default function UsatiiDashboard({ adminEmail }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get('tab');
  const initial = TABS.some((tab) => tab.id === requested) ? requested : 'overview';
  const [activeTab, setActiveTab] = useState(initial);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  const loadClients = useCallback(async () => {
    setClientsLoading(true);
    try { const payload = await fetchJson('/api/admin/clients?clientId=all'); setClients(Array.isArray(payload.clients) ? payload.clients : []); }
    catch { setClients([]); }
    finally { setClientsLoading(false); }
  }, []);
  useEffect(() => { loadClients(); }, [loadClients]);

  function selectTab(tabId) {
    setActiveTab(tabId); setMobileMenuOpen(false);
    const params = new URLSearchParams(window.location.search);
    if (tabId === 'overview') params.delete('tab'); else params.set('tab', tabId);
    window.history.replaceState(window.history.state, '', params.toString() ? `/dashboard?${params}` : '/dashboard');
  }

  const activeLabel = TABS.find((tab) => tab.id === activeTab)?.label || 'Overview';
  const content = useMemo(() => {
    if (activeTab === 'overview') return <OverviewTab email={adminEmail} onSelect={selectTab} />;
    if (activeTab === 'customers') return <CustomersTab clients={clients} loading={clientsLoading} onRefresh={loadClients} />;
    if (activeTab === 'catalog') return <CatalogTab />;
    if (activeTab === 'calendar') return <CalendarTab />;
    if (activeTab === 'library') return <LibraryTab />;
    if (activeTab === 'live-chat') return <AdminLiveChatPane globalSearch="" />;
    if (activeTab === 'academy') return <RichAcademyTab onSelect={selectTab} />;
    if (activeTab === 'course-builder') return <CourseBuilderTab clients={clients} />;
    return null;
  }, [activeTab, adminEmail, clients, clientsLoading, loadClients]);

  async function logout() { await fetch('/api/portal/auth/logout', { method: 'POST' }); router.push('/admin/login'); router.refresh(); }

  return (
    <div className={`min-h-screen bg-slate-100 lg:grid ${collapsed ? 'lg:grid-cols-[minmax(0,1fr)]' : 'lg:grid-cols-[104px_minmax(0,1fr)]'}`}>
      <aside className={`sticky top-0 hidden h-screen overflow-y-auto border-r border-slate-200 bg-white p-1.5 ${collapsed ? 'lg:hidden' : 'lg:flex'}`}><TabList activeTab={activeTab} onSelect={selectTab} rail /></aside>
      <div className="min-w-0 bg-slate-100">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white"><div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8"><div className="flex items-center gap-3"><button type="button" onClick={() => setCollapsed((value) => !value)} className="hidden min-h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-slate-700 lg:inline-flex" aria-label={collapsed ? 'Expand dashboard menu' : 'Collapse dashboard menu'}>{collapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}</button><button type="button" onClick={() => setMobileMenuOpen((value) => !value)} className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-slate-700 lg:hidden">{mobileMenuOpen ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}</button><div><p className="text-xs font-black tracking-tight text-slate-950">USATII MEDIA</p><p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{activeLabel}</p></div></div><div className="flex items-center gap-3"><span className="hidden text-xs text-slate-500 sm:block">{adminEmail}</span><button type="button" onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Logout</button></div></div></header>
        <section className={activeTab === 'library' ? '' : 'px-4 py-5 sm:px-6 lg:px-8 lg:py-6'}><AnimatePresence mode="wait" initial={false}><motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}>{content}</motion.div></AnimatePresence></section>
      </div>
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileMenuOpen ? '' : 'pointer-events-none'}`}><button type="button" onClick={() => setMobileMenuOpen(false)} className={`absolute inset-0 bg-black/55 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} aria-label="Close dashboard menu"/><aside className={`absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-slate-200 bg-white px-4 py-6 transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="mb-4 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">USATII Menu</p><button type="button" onClick={() => setMobileMenuOpen(false)} className="rounded-lg border border-slate-200 p-2"><X className="h-4 w-4"/></button></div><TabList activeTab={activeTab} onSelect={selectTab}/></aside></div>
    </div>
  );
}
