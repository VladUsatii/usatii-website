'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const ACTIVE_NAV_ITEMS = [
  { id: 'command', label: 'Overview' },
  { id: 'clients', label: 'Clients' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'settings', label: 'Settings' },
];

const PAYPAL_INTERVAL_OPTIONS = [
  { value: '7d', label: 'Last 7d' },
  { value: '30d', label: 'Last 30d' },
  { value: '90d', label: 'Last 90d' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
];

const PROVISION_INITIAL_STATE = {
  email: '',
  password: '',
  displayName: '',
  company: '',
  driveFolderId: '',
  driveFolderUrl: '',
};

function formatMoneyFromCents(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format((Number(value) || 0) / 100);
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function clientLabel(client) {
  return client?.displayName || client?.company || client?.email || 'Client';
}

function getHealthTone(score) {
  if (score >= 80) return 'green';
  if (score >= 65) return 'yellow';
  return 'red';
}

function getInvoiceStatusTone(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'PAID') return 'green';
  if (normalized === 'PARTIALLY PAID') return 'blue';
  if (normalized === 'OVERDUE') return 'red';
  if (normalized === 'UNPAID' || normalized === 'PENDING' || normalized === 'SENT') return 'yellow';
  return 'gray';
}

function getPaymentStatusTone(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'S' || normalized === 'SUCCESS' || normalized === 'COMPLETED') return 'green';
  if (normalized === 'P' || normalized === 'PENDING') return 'yellow';
  if (normalized === 'D' || normalized === 'DENIED' || normalized === 'FAILED' || normalized === 'REVERSED' || normalized === 'REFUNDED') {
    return 'red';
  }
  return 'gray';
}

function toSearchBlob(value) {
  return String(value || '').toLowerCase();
}

function matchSearch(query, values) {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return values.some((value) => toSearchBlob(value).includes(normalized));
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status}).`);
    error.code = payload.code || null;
    error.status = response.status;
    throw error;
  }

  return payload;
}

function StatusPill({ tone = 'gray', children }) {
  const tones = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    yellow: 'bg-amber-50 border-amber-200 text-amber-700',
    red: 'bg-rose-50 border-rose-200 text-rose-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    gray: 'bg-neutral-100 border-neutral-200 text-neutral-700',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function MetricCard({ label, value, helper, tone = 'gray' }) {
  const borderTone = {
    green: 'border-emerald-200',
    yellow: 'border-amber-200',
    red: 'border-rose-200',
    blue: 'border-blue-200',
    gray: 'border-neutral-200',
  };

  return (
    <div className={`rounded-xl border bg-white p-4 ${borderTone[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">{value}</p>
      {helper ? <p className="mt-1 text-xs text-neutral-600">{helper}</p> : null}
    </div>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-xs text-neutral-600">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="cursor-pointer mt-4 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="h-24 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
        />
      ))}
    </div>
  );
}

function TableHeader({ columns }) {
  return (
    <thead className="bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500">
      <tr>
        {columns.map((column) => (
          <th key={column} className="px-3 py-2 text-left font-semibold">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function HintTooltip({ text }) {
  return (
    <span className="group relative inline-flex items-center">
      <span className="cursor-help rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">?</span>
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 w-max -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

export default function OwnerDashboard({ adminEmail }) {
  const router = useRouter();

  const [activeNav, setActiveNav] = useState('command');
  const [selectedClientId, setSelectedClientId] = useState('all');
  const [globalSearch, setGlobalSearch] = useState('');

  const [selectorClients, setSelectorClients] = useState([]);
  const [selectorLoading, setSelectorLoading] = useState(true);
  const [selectorError, setSelectorError] = useState('');

  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState('');

  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState('');

  const [paypalInterval, setPaypalInterval] = useState('30d');
  const [paypalRevenue, setPaypalRevenue] = useState(null);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalError, setPaypalError] = useState('');

  const [clientDetail, setClientDetail] = useState(null);
  const [clientDetailLoading, setClientDetailLoading] = useState(false);
  const [clientDetailError, setClientDetailError] = useState('');

  const [provisionForm, setProvisionForm] = useState(PROVISION_INITIAL_STATE);
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [provisionError, setProvisionError] = useState('');
  const [provisionSuccess, setProvisionSuccess] = useState('');

  const [systemErrorBanner, setSystemErrorBanner] = useState('');

  const selectedClient = useMemo(
    () => selectorClients.find((client) => String(client.userId) === selectedClientId) || null,
    [selectorClients, selectedClientId]
  );

  const currentScopeLabel = selectedClient ? clientLabel(selectedClient) : 'All Clients';
  const activeNavLabel = ACTIVE_NAV_ITEMS.find((item) => item.id === activeNav)?.label || 'Overview';

  const filteredAttentionRows = useMemo(() => {
    const rows = overview?.ownerAttention || [];
    return rows.filter((row) => matchSearch(globalSearch, [row.clientName, row.issue, row.action]));
  }, [overview, globalSearch]);

  const filteredRecentActivity = useMemo(() => {
    const rows = overview?.recentActivity || [];
    return rows.filter((row) => matchSearch(globalSearch, [row.clientName, row.summary, row.type]));
  }, [overview, globalSearch]);

  const filteredUnpaidInvoices = useMemo(() => {
    const rows = overview?.unpaidInvoices || [];
    return rows.filter((row) => matchSearch(globalSearch, [row.clientName, row.status, row.amountCents]));
  }, [overview, globalSearch]);

  const filteredPayPalInvoices = useMemo(() => {
    const rows = paypalRevenue?.invoices || [];
    return rows.filter((row) => matchSearch(globalSearch, [row.invoiceNumber, row.status, row.recipientEmail]));
  }, [paypalRevenue, globalSearch]);

  const filteredPayPalTransactions = useMemo(() => {
    const rows = paypalRevenue?.transactions || [];
    return rows.filter((row) => matchSearch(globalSearch, [row.id, row.status, row.email, row.grossCents, row.netCents]));
  }, [paypalRevenue, globalSearch]);

  const totalAlerts = filteredAttentionRows.length;

  const setDatabaseBannerFromError = useCallback((error) => {
    if (error?.code === 'portal_db_not_configured') {
      setSystemErrorBanner(error.message);
    }
  }, []);

  const loadSelectorClients = useCallback(async () => {
    setSelectorLoading(true);
    setSelectorError('');

    try {
      const payload = await fetchJson('/api/admin/clients');
      setSelectorClients(payload.clients || []);
    } catch (error) {
      setSelectorError(error.message || 'Unable to load client selector.');
      setDatabaseBannerFromError(error);
    } finally {
      setSelectorLoading(false);
    }
  }, [setDatabaseBannerFromError]);

  const loadClients = useCallback(async () => {
    setClientsLoading(true);
    setClientsError('');

    const params = new URLSearchParams();
    if (selectedClientId !== 'all') params.set('clientId', selectedClientId);
    if (globalSearch.trim()) params.set('q', globalSearch.trim());

    try {
      const payload = await fetchJson(`/api/admin/clients?${params.toString()}`);
      setClients(payload.clients || []);
    } catch (error) {
      setClientsError(error.message || 'Unable to load clients.');
      setDatabaseBannerFromError(error);
    } finally {
      setClientsLoading(false);
    }
  }, [globalSearch, selectedClientId, setDatabaseBannerFromError]);

  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    setOverviewError('');

    const params = new URLSearchParams();
    if (selectedClientId !== 'all') params.set('clientId', selectedClientId);

    try {
      const payload = await fetchJson(`/api/admin/overview?${params.toString()}`);
      setOverview(payload);
    } catch (error) {
      setOverviewError(error.message || 'Unable to load command center.');
      setDatabaseBannerFromError(error);
    } finally {
      setOverviewLoading(false);
    }
  }, [selectedClientId, setDatabaseBannerFromError]);

  const loadClientDetail = useCallback(async () => {
    if (selectedClientId === 'all') {
      setClientDetail(null);
      setClientDetailError('');
      return;
    }

    setClientDetailLoading(true);
    setClientDetailError('');

    try {
      const payload = await fetchJson(`/api/admin/clients/${selectedClientId}`);
      setClientDetail(payload);
    } catch (error) {
      setClientDetailError(error.message || 'Unable to load client workspace.');
      setDatabaseBannerFromError(error);
    } finally {
      setClientDetailLoading(false);
    }
  }, [selectedClientId, setDatabaseBannerFromError]);

  const loadPayPalRevenue = useCallback(async () => {
    setPaypalLoading(true);
    setPaypalError('');

    const params = new URLSearchParams();
    params.set('interval', paypalInterval);
    if (selectedClientId !== 'all' && selectedClient?.email) {
      params.set('clientEmail', selectedClient.email);
    }

    try {
      const payload = await fetchJson(`/api/admin/revenue/paypal?${params.toString()}`);
      setPaypalRevenue(payload);
    } catch (error) {
      setPaypalError(error.message || 'Unable to load PayPal data.');
      setDatabaseBannerFromError(error);
    } finally {
      setPaypalLoading(false);
    }
  }, [paypalInterval, selectedClientId, selectedClient?.email, setDatabaseBannerFromError]);

  useEffect(() => {
    loadSelectorClients();
  }, [loadSelectorClients]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    loadClientDetail();
  }, [loadClientDetail]);

  useEffect(() => {
    if (activeNav !== 'revenue') return;
    loadPayPalRevenue();
  }, [activeNav, loadPayPalRevenue]);

  async function handleLogout() {
    await fetch('/api/portal/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  async function handleProvisionSubmit(event) {
    event.preventDefault();
    setProvisionLoading(true);
    setProvisionError('');
    setProvisionSuccess('');

    try {
      const payload = await fetchJson('/api/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(provisionForm),
      });

      setProvisionSuccess(`Client ${payload.client.email} was created.`);
      setProvisionForm(PROVISION_INITIAL_STATE);

      await Promise.all([loadSelectorClients(), loadClients(), loadOverview()]);
    } catch (error) {
      setProvisionError(error.message || 'Unable to create client account.');
      setDatabaseBannerFromError(error);
    } finally {
      setProvisionLoading(false);
    }
  }

  function getBreadcrumb() {
    if (activeNav === 'clients' && selectedClient) {
      return `Clients / ${currentScopeLabel} / Workspace`;
    }

    return `Clients / ${currentScopeLabel} / ${activeNavLabel}`;
  }

  function getHeaderTitle() {
    if (activeNav === 'clients' && selectedClient) {
      return `${currentScopeLabel} Workspace`;
    }

    return `${currentScopeLabel} ${activeNavLabel}`;
  }

  function renderCommandCenter() {
    if (overviewLoading) return <LoadingGrid />;

    if (overviewError) {
      return (
        <EmptyState
          title="Overview unavailable"
          description={overviewError}
          actionLabel="Retry"
          onAction={loadOverview}
        />
      );
    }

    const totals = overview?.totals || {
      clientCount: 0,
      activeWork: 0,
      blockedWork: 0,
      lateWork: 0,
      readyForReview: 0,
      unpaidInvoices: 0,
      unpaidAmountCents: 0,
      paidThisMonthCents: 0,
    };

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Clients" value={String(totals.clientCount)} tone="blue" />
          <MetricCard label="Active Work" value={String(totals.activeWork)} tone="blue" />
          <MetricCard
            label="Blocked + Late"
            value={String(totals.blockedWork + totals.lateWork)}
            tone={totals.blockedWork + totals.lateWork > 0 ? 'red' : 'green'}
            helper={`${totals.blockedWork} blocked • ${totals.lateWork} late`}
          />
          <MetricCard
            label="Review Queue"
            value={String(totals.readyForReview)}
            tone={totals.readyForReview > 0 ? 'yellow' : 'green'}
          />
          <MetricCard
            label="Unpaid"
            value={formatMoneyFromCents(totals.unpaidAmountCents)}
            tone={totals.unpaidAmountCents > 0 ? 'red' : 'green'}
            helper={`${totals.unpaidInvoices} open invoice${totals.unpaidInvoices === 1 ? '' : 's'}`}
          />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Next Up</p>
            <HintTooltip text="What you should handle first." />
          </div>

          {filteredAttentionRows.length === 0 ? (
            <EmptyState
              title="Nothing next up"
              description="Nothing blocked, late, or unpaid in this scope right now."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="min-w-full text-sm">
                <TableHeader columns={['Client', 'Issue', 'Severity', 'Do This']} />
                <tbody>
                  {filteredAttentionRows.map((row) => (
                    <tr key={`${row.clientUserId}-${row.issue}`} className="border-t border-neutral-100 align-top">
                      <td className="px-3 py-2 font-medium text-neutral-900">{row.clientName}</td>
                      <td className="px-3 py-2 text-neutral-700">{row.issue}</td>
                      <td className="px-3 py-2">
                        <StatusPill tone={row.severity === 'high' ? 'red' : row.severity === 'medium' ? 'yellow' : 'green'}>
                          {row.severity}
                        </StatusPill>
                      </td>
                      <td className="px-3 py-2 text-neutral-700">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Latest Updates</p>
            <HintTooltip text="Newest task and request changes." />
          </div>

          {filteredRecentActivity.length === 0 ? (
            <EmptyState
              title="No recent activity"
              description="Activity appears here as tasks and requests move."
            />
          ) : (
            <div className="space-y-2">
              {filteredRecentActivity.map((item) => (
                <div key={item.id} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-neutral-900">{item.summary}</p>
                    <StatusPill tone={item.type === 'task' ? 'blue' : 'gray'}>{item.type}</StatusPill>
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">
                    {item.clientName} • {formatDate(item.happenedAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderClientsSection() {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Clients</p>
            <p className="text-xs text-neutral-500">
              {clientsLoading ? 'Loading...' : `${clients.length} visible`}
            </p>
          </div>

          {clientsError ? (
            <EmptyState
              title="Could not load clients"
              description={clientsError}
              actionLabel="Retry"
              onAction={loadClients}
            />
          ) : clientsLoading ? (
            <LoadingGrid />
          ) : clients.length === 0 ? (
            <EmptyState
              title="No clients yet"
              description="Create your first client account to start tracking work and revenue."
              actionLabel="Create Client"
              onAction={() => setActiveNav('settings')}
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="min-w-full text-sm">
                <TableHeader columns={['Client', 'Health', 'Active', 'Blocked', 'Late', 'Unpaid', 'Next Action']} />
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.userId}
                      onClick={() => setSelectedClientId(String(client.userId))}
                      className="cursor-pointer border-t border-neutral-100 align-top transition hover:bg-neutral-50"
                    >
                      <td className="px-3 py-2">
                        <p className="font-medium text-neutral-900">{clientLabel(client)}</p>
                        <p className="text-xs text-neutral-500">{client.email}</p>
                      </td>
                      <td className="px-3 py-2">
                        <StatusPill tone={getHealthTone(client.healthScore)}>{client.healthScore}</StatusPill>
                      </td>
                      <td className="px-3 py-2 text-neutral-700">{client.activeWork}</td>
                      <td className="px-3 py-2 text-neutral-700">{client.blockedWork}</td>
                      <td className="px-3 py-2 text-neutral-700">{client.lateWork}</td>
                      <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(client.unpaidAmountCents)}</td>
                      <td className="px-3 py-2 text-neutral-700">{client.nextAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedClient ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Client Snapshot</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">{clientLabel(selectedClient)}</h2>
              </div>
              <StatusPill tone={getHealthTone(selectedClient.healthScore)}>
                Health {selectedClient.healthScore}
              </StatusPill>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Active Work" value={String(selectedClient.activeWork)} />
              <MetricCard label="Blocked" value={String(selectedClient.blockedWork)} tone={selectedClient.blockedWork > 0 ? 'red' : 'green'} />
              <MetricCard label="Late" value={String(selectedClient.lateWork)} tone={selectedClient.lateWork > 0 ? 'yellow' : 'green'} />
              <MetricCard label="Unpaid" value={formatMoneyFromCents(selectedClient.unpaidAmountCents)} tone={selectedClient.unpaidAmountCents > 0 ? 'red' : 'green'} />
            </div>

            {clientDetailError ? (
              <EmptyState title="Could not load workspace detail" description={clientDetailError} actionLabel="Retry" onAction={loadClientDetail} />
            ) : clientDetailLoading ? (
              <LoadingGrid />
            ) : !clientDetail ? (
              <EmptyState title="No workspace data yet" description="Data appears after tasks, invoices, or requests are created." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Recent Tasks</p>
                  <div className="mt-2 space-y-2">
                    {clientDetail.tasks.length === 0 ? (
                      <p className="text-xs text-neutral-500">No tasks yet.</p>
                    ) : (
                      clientDetail.tasks.slice(0, 6).map((task) => (
                        <div key={task.id} className="rounded-md border border-neutral-200 px-2 py-2 text-xs">
                          <p className="font-medium text-neutral-900">{task.title}</p>
                          <p className="mt-1 text-neutral-600">{task.status} • {task.service}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Video Requests</p>
                  <div className="mt-2 space-y-2">
                    {clientDetail.requests.length === 0 ? (
                      <p className="text-xs text-neutral-500">No requests yet.</p>
                    ) : (
                      clientDetail.requests.slice(0, 6).map((request) => (
                        <div key={request.id} className="rounded-md border border-neutral-200 px-2 py-2 text-xs">
                          <p className="font-medium text-neutral-900">
                            {request.requestType === 'long_form' ? 'Long-form' : 'Short-form'}
                          </p>
                          <p className="mt-1 text-neutral-600">{request.status}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Invoices</p>
                  <div className="mt-2 space-y-2">
                    {clientDetail.invoices.length === 0 ? (
                      <p className="text-xs text-neutral-500">No invoices yet.</p>
                    ) : (
                      clientDetail.invoices.slice(0, 6).map((invoice) => (
                        <div key={invoice.id} className="rounded-md border border-neutral-200 px-2 py-2 text-xs">
                          <p className="font-medium text-neutral-900">{formatMoneyFromCents(invoice.amountCents)}</p>
                          <p className="mt-1 text-neutral-600">{invoice.status} • Due {formatDate(invoice.dueDate)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  function renderRevenueSection() {
    if (overviewLoading) return <LoadingGrid />;

    if (overviewError) {
      return (
        <EmptyState
          title="Revenue unavailable"
          description={overviewError}
          actionLabel="Retry"
          onAction={loadOverview}
        />
      );
    }

    const totals = overview?.totals || {
      unpaidAmountCents: 0,
      unpaidInvoices: 0,
      paidThisMonthCents: 0,
      blockedWork: 0,
      lateWork: 0,
    };

    const paypalCurrency = paypalRevenue?.invoiceSummary?.currency || paypalRevenue?.paymentSummary?.currency || 'USD';
    const paypalInvoiceSummary = paypalRevenue?.invoiceSummary || {
      totalCount: 0,
      paidCount: 0,
      unpaidCount: 0,
      overdueCount: 0,
      partiallyPaidCount: 0,
      totalCents: 0,
    };
    const paypalPaymentSummary = paypalRevenue?.paymentSummary || {
      receivedCount: 0,
      grossCents: 0,
      netCents: 0,
      source: 'transactions',
    };
    const paypalWarnings = Array.isArray(paypalRevenue?.warnings)
      ? paypalRevenue.warnings.filter(Boolean)
      : [];

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Paid This Month" value={formatMoneyFromCents(totals.paidThisMonthCents)} tone="green" />
          <MetricCard
            label="Unpaid Amount"
            value={formatMoneyFromCents(totals.unpaidAmountCents)}
            tone={totals.unpaidAmountCents > 0 ? 'red' : 'green'}
            helper={`${totals.unpaidInvoices} open invoice${totals.unpaidInvoices === 1 ? '' : 's'}`}
          />
          <MetricCard label="Blocked Work" value={String(totals.blockedWork)} tone={totals.blockedWork > 0 ? 'red' : 'green'} />
          <MetricCard label="Late Work" value={String(totals.lateWork)} tone={totals.lateWork > 0 ? 'yellow' : 'green'} />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Unpaid Invoices</p>
            <HintTooltip text="Invoices still waiting to be paid." />
          </div>

          {filteredUnpaidInvoices.length === 0 ? (
            <EmptyState
              title="No unpaid invoices"
              description="Cashflow is clear in this scope."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="min-w-full text-sm">
                <TableHeader columns={['Client', 'Amount', 'Status', 'Due Date']} />
                <tbody>
                  {filteredUnpaidInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-t border-neutral-100">
                      <td className="px-3 py-2 font-medium text-neutral-900">{invoice.clientName}</td>
                      <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(invoice.amountCents)}</td>
                      <td className="px-3 py-2">
                        <StatusPill tone={invoice.status === 'overdue' ? 'red' : 'yellow'}>
                          {invoice.status}
                        </StatusPill>
                      </td>
                      <td className="px-3 py-2 text-neutral-700">{formatDate(invoice.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">PayPal</p>
              <HintTooltip text="Invoice status and paid totals from your PayPal business account." />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={paypalInterval}
                onChange={(event) => setPaypalInterval(event.target.value)}
                className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-black"
              >
                {PAYPAL_INTERVAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={loadPayPalRevenue}
                className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400"
              >
                Refresh
              </button>
            </div>
          </div>

          {paypalLoading && !paypalRevenue ? (
            <LoadingGrid />
          ) : null}

          {paypalError ? (
            <EmptyState
              title="PayPal unavailable"
              description={paypalError}
              actionLabel="Retry"
              onAction={loadPayPalRevenue}
            />
          ) : null}

          {!paypalError && paypalRevenue?.configured === false ? (
            <EmptyState
              title="PayPal not connected"
              description={paypalRevenue?.message || 'Add PayPal credentials to enable this section.'}
            />
          ) : null}

          {!paypalError && paypalRevenue && paypalRevenue.configured !== false ? (
            <div className="space-y-4">
              {paypalWarnings.length > 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {paypalWarnings[0]}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard
                  label="Invoices"
                  value={String(paypalInvoiceSummary.totalCount)}
                  tone="blue"
                />
                <MetricCard
                  label="Paid"
                  value={String(paypalInvoiceSummary.paidCount)}
                  tone="green"
                />
                <MetricCard
                  label="Unpaid"
                  value={String(paypalInvoiceSummary.unpaidCount)}
                  tone={paypalInvoiceSummary.unpaidCount > 0 ? 'yellow' : 'green'}
                />
                <MetricCard
                  label="Overdue"
                  value={String(paypalInvoiceSummary.overdueCount)}
                  tone={paypalInvoiceSummary.overdueCount > 0 ? 'red' : 'green'}
                />
                <MetricCard
                  label={paypalPaymentSummary.source === 'invoices' ? 'Collected (est.)' : 'Collected'}
                  value={formatMoneyFromCents(paypalPaymentSummary.netCents, paypalCurrency)}
                  tone="green"
                />
              </div>

              {filteredPayPalInvoices.length === 0 ? (
                <EmptyState
                  title="No PayPal invoices in this range"
                  description="Try another interval."
                />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-neutral-200">
                  <table className="min-w-full text-sm">
                    <TableHeader columns={['Invoice', 'Recipient', 'Status', 'Amount', 'Created', 'Due']} />
                    <tbody>
                      {filteredPayPalInvoices.map((invoice) => (
                        <tr key={invoice.id || `${invoice.invoiceNumber}-${invoice.createdAt}`} className="border-t border-neutral-100">
                          <td className="px-3 py-2 font-medium text-neutral-900">{invoice.invoiceNumber || invoice.id}</td>
                          <td className="px-3 py-2 text-neutral-700">{invoice.recipientEmail || '—'}</td>
                          <td className="px-3 py-2">
                            <StatusPill tone={getInvoiceStatusTone(invoice.status)}>
                              {invoice.status}
                            </StatusPill>
                          </td>
                          <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(invoice.totalCents, invoice.currency || paypalCurrency)}</td>
                          <td className="px-3 py-2 text-neutral-700">{formatDate(invoice.createdAt)}</td>
                          <td className="px-3 py-2 text-neutral-700">{formatDate(invoice.dueDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Payments</p>
                  <HintTooltip text="Incoming PayPal transactions for this range." />
                </div>

                {filteredPayPalTransactions.length === 0 ? (
                  <EmptyState
                    title="No payments in this range"
                    description="Paid activity will show here once transactions are found."
                  />
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-neutral-200">
                    <table className="min-w-full text-sm">
                      <TableHeader columns={['Payment ID', 'Payer', 'Status', 'Gross', 'Fee', 'Net', 'Date']} />
                      <tbody>
                        {filteredPayPalTransactions.map((payment) => (
                          <tr key={payment.id || `${payment.email}-${payment.occurredAt}`} className="border-t border-neutral-100">
                            <td className="px-3 py-2 font-medium text-neutral-900">{payment.id || '—'}</td>
                            <td className="px-3 py-2 text-neutral-700">{payment.email || '—'}</td>
                            <td className="px-3 py-2">
                              <StatusPill tone={getPaymentStatusTone(payment.status)}>
                                {payment.status || 'UNKNOWN'}
                              </StatusPill>
                            </td>
                            <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(payment.grossCents, payment.currency || paypalCurrency)}</td>
                            <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(payment.feeCents, payment.currency || paypalCurrency)}</td>
                            <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(payment.netCents, payment.currency || paypalCurrency)}</td>
                            <td className="px-3 py-2 text-neutral-700">{formatDate(payment.occurredAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function renderSettingsSection() {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Create Client Account</p>
            <HintTooltip text="Use after onboarding call is complete." />
          </div>

          <form onSubmit={handleProvisionSubmit} className="mt-3 grid gap-3 md:grid-cols-2">
            <input
              value={provisionForm.email}
              onChange={(event) => setProvisionForm((previous) => ({ ...previous, email: event.target.value }))}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Client email"
              required
            />
            <input
              value={provisionForm.password}
              onChange={(event) => setProvisionForm((previous) => ({ ...previous, password: event.target.value }))}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Temporary password"
              required
            />
            <input
              value={provisionForm.displayName}
              onChange={(event) => setProvisionForm((previous) => ({ ...previous, displayName: event.target.value }))}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Display name"
              required
            />
            <input
              value={provisionForm.company}
              onChange={(event) => setProvisionForm((previous) => ({ ...previous, company: event.target.value }))}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Company (optional)"
            />
            <input
              value={provisionForm.driveFolderId}
              onChange={(event) => setProvisionForm((previous) => ({ ...previous, driveFolderId: event.target.value }))}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Drive folder ID"
              required
            />
            <input
              value={provisionForm.driveFolderUrl}
              onChange={(event) => setProvisionForm((previous) => ({ ...previous, driveFolderUrl: event.target.value }))}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Drive folder URL (optional)"
            />

            {provisionError ? (
              <p className="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {provisionError}
              </p>
            ) : null}

            {provisionSuccess ? (
              <p className="md:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {provisionSuccess}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={provisionLoading}
              className="cursor-pointer md:col-span-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {provisionLoading ? 'Creating account...' : 'Create client account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  function renderMainPanel() {
    if (activeNav === 'command') return renderCommandCenter();
    if (activeNav === 'clients') return renderClientsSection();
    if (activeNav === 'revenue') return renderRevenueSection();
    if (activeNav === 'settings') return renderSettingsSection();
    return renderCommandCenter();
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3">
          <div className="min-w-[100px]">
            <span className="text-sm font-black tracking-wide">USATII</span>
          </div>

          <select
            value={selectedClientId}
            onChange={(event) => setSelectedClientId(event.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
            disabled={selectorLoading}
          >
            <option value="all">All Clients</option>
            {selectorClients.map((client) => (
              <option key={client.userId} value={String(client.userId)}>
                {clientLabel(client)}
              </option>
            ))}
          </select>

          <div className="flex-1">
            <input
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder="Search clients, issues, activity..."
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveNav('settings')}
            className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
          >
            + Create
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('command')}
            className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
          >
            Next Up ({totalAlerts})
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
          >
            Vlad
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-neutral-200 bg-white lg:min-h-[calc(100vh-61px)] lg:border-b-0 lg:border-r">
          <nav className="space-y-3 p-3">
            <div className="space-y-1">
              {ACTIVE_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`cursor-pointer w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                    activeNav === item.id
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="space-y-5 px-4 py-5 sm:px-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">{getBreadcrumb()}</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">{getHeaderTitle()}</h1>
              </div>
            </div>
          </div>

          {systemErrorBanner ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {systemErrorBanner}
            </div>
          ) : null}

          {selectorError ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Client selector warning: {selectorError}
            </div>
          ) : null}

          {renderMainPanel()}
        </main>
      </div>

      <div className="fixed bottom-4 left-4 hidden rounded-md border border-neutral-300 bg-white px-3 py-2 text-[11px] text-neutral-600 sm:block">
        Logged in as {adminEmail}
      </div>
    </div>
  );
}
