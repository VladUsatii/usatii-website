'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNotesPane from '@/app/admin/_components/admin-notes-pane';

const ACTIVE_NAV_ITEMS = [
  { id: 'command', label: 'Overview' },
  { id: 'clients', label: 'Clients' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'applications', label: 'Applications' },
  { id: 'notes', label: 'Notes' },
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

const DELIVERABLE_PACK_TYPE_OPTIONS = [
  { value: 'video_pack', label: 'Video Pack' },
  { value: 'website_pack', label: 'Website Pack' },
];

const DELIVERABLE_STEP_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'queued', label: 'Queued' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'quality_assurance', label: 'Quality Assurance' },
  { value: 'completed', label: 'Completed' },
];

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

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
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

function getPurchaseStateTone(state) {
  if (state === 'fully_paid') return 'green';
  if (state === 'semi_paid') return 'blue';
  if (state === 'active') return 'yellow';
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

function ownerNameFromEmail(email) {
  const normalized = String(email || '').trim();
  if (!normalized) return 'Owner';

  const [handle] = normalized.split('@');
  const cleaned = String(handle || '')
    .replace(/[._-]+/g, ' ')
    .trim();

  if (!cleaned) return 'Owner';

  return cleaned
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
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
      <span className="flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">?</span>
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

  const [applications, setApplications] = useState([]);
  const [applicationsSummary, setApplicationsSummary] = useState(null);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const [clientDetail, setClientDetail] = useState(null);
  const [clientDetailLoading, setClientDetailLoading] = useState(false);
  const [clientDetailError, setClientDetailError] = useState('');
  const [deliverablesData, setDeliverablesData] = useState(null);
  const [deliverablesLoading, setDeliverablesLoading] = useState(false);
  const [deliverablesError, setDeliverablesError] = useState('');
  const [deliverablesNotice, setDeliverablesNotice] = useState('');
  const [deliverablesMutating, setDeliverablesMutating] = useState(false);
  const [manualPackForms, setManualPackForms] = useState({});
  const [packDrafts, setPackDrafts] = useState({});

  const [provisionForm, setProvisionForm] = useState(PROVISION_INITIAL_STATE);
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [provisionError, setProvisionError] = useState('');
  const [provisionSuccess, setProvisionSuccess] = useState('');
  const [driveWorkspaceForm, setDriveWorkspaceForm] = useState({
    driveFolderId: '',
    driveFolderUrl: '',
  });
  const [driveWorkspaceLoading, setDriveWorkspaceLoading] = useState(false);
  const [driveWorkspaceError, setDriveWorkspaceError] = useState('');
  const [driveWorkspaceSuccess, setDriveWorkspaceSuccess] = useState('');

  const [systemErrorBanner, setSystemErrorBanner] = useState('');

  const selectedClient = useMemo(
    () => selectorClients.find((client) => String(client.userId) === selectedClientId) || null,
    [selectorClients, selectedClientId]
  );

  const currentScopeLabel = selectedClient ? clientLabel(selectedClient) : 'All Clients';
  const activeNavLabel = ACTIVE_NAV_ITEMS.find((item) => item.id === activeNav)?.label || 'Overview';
  const searchPlaceholder =
    activeNav === 'applications'
      ? 'Search applicants, roles, emails, portfolio links...'
      : 'Search clients, issues, activity...';

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

  const selectedApplication = useMemo(() => {
    if (applications.length === 0) return null;

    const found = applications.find(
      (application) => String(application.id) === String(selectedApplicationId)
    );

    return found || applications[0];
  }, [applications, selectedApplicationId]);

  const totalAlerts = filteredAttentionRows.length;
  const ownerLabel = ownerNameFromEmail(adminEmail);

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

  const loadDeliverables = useCallback(async () => {
    if (selectedClientId === 'all') {
      setDeliverablesData(null);
      setDeliverablesError('');
      setDeliverablesNotice('');
      setManualPackForms({});
      setPackDrafts({});
      return;
    }

    setDeliverablesLoading(true);
    setDeliverablesError('');
    setDeliverablesNotice('');

    try {
      const payload = await fetchJson(`/api/admin/clients/${selectedClientId}/deliverables`);
      setDeliverablesData(payload);
    } catch (error) {
      setDeliverablesError(error.message || 'Unable to load deliverables.');
      setDatabaseBannerFromError(error);
    } finally {
      setDeliverablesLoading(false);
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

  const loadApplications = useCallback(async () => {
    setApplicationsLoading(true);
    setApplicationsError('');

    const params = new URLSearchParams();
    params.set('limit', '200');
    if (globalSearch.trim()) params.set('q', globalSearch.trim());

    try {
      const payload = await fetchJson(`/api/admin/careers?${params.toString()}`);
      const nextApplications = payload.applications || [];

      setApplications(nextApplications);
      setApplicationsSummary(payload.summary || null);
      setSelectedApplicationId((previous) => {
        if (nextApplications.length === 0) return null;
        if (
          previous !== null &&
          nextApplications.some((application) => String(application.id) === String(previous))
        ) {
          return previous;
        }
        return nextApplications[0].id;
      });
    } catch (error) {
      setApplicationsError(error.message || 'Unable to load careers applications.');
      setDatabaseBannerFromError(error);
    } finally {
      setApplicationsLoading(false);
    }
  }, [globalSearch, setDatabaseBannerFromError]);

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
    loadDeliverables();
  }, [loadDeliverables]);

  useEffect(() => {
    if (activeNav !== 'revenue') return;
    loadPayPalRevenue();
  }, [activeNav, loadPayPalRevenue]);

  useEffect(() => {
    if (activeNav !== 'applications') return;
    loadApplications();
  }, [activeNav, loadApplications]);

  useEffect(() => {
    if (!selectedClient) {
      setDriveWorkspaceForm({
        driveFolderId: '',
        driveFolderUrl: '',
      });
      setDriveWorkspaceError('');
      setDriveWorkspaceSuccess('');
      return;
    }

    setDriveWorkspaceForm({
      driveFolderId: selectedClient.driveFolderId || '',
      driveFolderUrl: selectedClient.driveFolderUrl || '',
    });
    setDriveWorkspaceError('');
    setDriveWorkspaceSuccess('');
  }, [selectedClient?.driveFolderId, selectedClient?.driveFolderUrl, selectedClient?.userId]);

  useEffect(() => {
    if (!deliverablesData?.invoices) {
      setManualPackForms({});
      setPackDrafts({});
      return;
    }

    setManualPackForms((previous) => {
      const next = { ...previous };

      for (const invoice of deliverablesData.invoices) {
        if (next[invoice.invoiceId]) continue;
        const firstLine = invoice.lineOptions?.[0];
        next[invoice.invoiceId] = {
          sourceLineKey: firstLine?.lineKey || 'invoice_text',
          sourceLineLabel: firstLine?.label || 'Invoice details',
          packType: 'video_pack',
          quantity: 1,
        };
      }

      return next;
    });

    setPackDrafts((previous) => {
      const next = { ...previous };

      for (const invoice of deliverablesData.invoices) {
        for (const pack of invoice.packs || []) {
          if (next[pack.id]) continue;
          next[pack.id] = {
            packType: pack.packType,
            quantity: String(pack.quantity),
          };
        }
      }

      return next;
    });
  }, [deliverablesData]);

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

  async function handleDriveWorkspaceUpdate(nextDriveFolderId, nextDriveFolderUrl = '') {
    if (!selectedClient) return;

    setDriveWorkspaceLoading(true);
    setDriveWorkspaceError('');
    setDriveWorkspaceSuccess('');

    try {
      const payload = await fetchJson(`/api/admin/clients/${selectedClient.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driveFolderId: nextDriveFolderId,
          driveFolderUrl: nextDriveFolderUrl,
        }),
      });

      setDriveWorkspaceForm({
        driveFolderId: payload.client?.driveFolderId || '',
        driveFolderUrl: payload.client?.driveFolderUrl || '',
      });
      setDriveWorkspaceSuccess(
        payload.client?.driveFolderId
          ? 'Drive workspace updated.'
          : 'Drive workspace removed. You can add one at any time.'
      );

      await Promise.all([loadSelectorClients(), loadClients(), loadOverview(), loadClientDetail()]);
    } catch (error) {
      setDriveWorkspaceError(error.message || 'Unable to update Drive workspace.');
      setDatabaseBannerFromError(error);
    } finally {
      setDriveWorkspaceLoading(false);
    }
  }

  async function handleDriveWorkspaceSubmit(event) {
    event.preventDefault();

    await handleDriveWorkspaceUpdate(
      driveWorkspaceForm.driveFolderId,
      driveWorkspaceForm.driveFolderUrl
    );
  }

  async function handleDriveWorkspaceClear() {
    await handleDriveWorkspaceUpdate('', '');
  }

  function setManualPackFormValue(invoiceId, key, value) {
    setManualPackForms((previous) => ({
      ...previous,
      [invoiceId]: {
        ...(previous[invoiceId] || {}),
        [key]: value,
      },
    }));
  }

  function setPackDraftValue(packId, key, value) {
    setPackDrafts((previous) => ({
      ...previous,
      [packId]: {
        ...(previous[packId] || {}),
        [key]: value,
      },
    }));
  }

  async function handleManualPackCreate(invoice) {
    if (!selectedClient) return;

    const invoiceId = String(invoice?.invoiceId || invoice?.invoiceNumber || '').trim();
    if (!invoiceId) {
      setDeliverablesError('This invoice is missing an id. Refresh the board and try again.');
      return;
    }

    const form = manualPackForms[invoiceId] || {};
    const lineOption = (invoice.lineOptions || []).find((line) => line.lineKey === form.sourceLineKey);

    setDeliverablesMutating(true);
    setDeliverablesError('');
    setDeliverablesNotice('');

    try {
      await fetchJson(`/api/admin/clients/${selectedClient.userId}/deliverables/packs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceInvoiceId: invoiceId,
          sourceInvoiceNumber: invoice.invoiceNumber,
          sourceLineKey: form.sourceLineKey || 'invoice_text',
          sourceLineLabel: lineOption?.label || form.sourceLineLabel || 'Invoice details',
          packType: form.packType || 'video_pack',
          quantity: Number.parseInt(String(form.quantity || '1'), 10) || 1,
        }),
      });

      setDeliverablesNotice('Manual deliverable pack created.');
      await loadDeliverables();
    } catch (error) {
      setDeliverablesError(error.message || 'Unable to create manual deliverable pack.');
      setDatabaseBannerFromError(error);
    } finally {
      setDeliverablesMutating(false);
    }
  }

  async function handlePackSave(pack) {
    if (!selectedClient) return;

    const draft = packDrafts[pack.id] || {
      packType: pack.packType,
      quantity: String(pack.quantity),
    };

    setDeliverablesMutating(true);
    setDeliverablesError('');
    setDeliverablesNotice('');

    try {
      await fetchJson(`/api/admin/clients/${selectedClient.userId}/deliverables/packs/${pack.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packType: draft.packType,
          quantity: Number.parseInt(String(draft.quantity || pack.quantity), 10) || pack.quantity,
        }),
      });

      setDeliverablesNotice('Deliverable pack updated.');
      await loadDeliverables();
    } catch (error) {
      setDeliverablesError(error.message || 'Unable to update deliverable pack.');
      setDatabaseBannerFromError(error);
    } finally {
      setDeliverablesMutating(false);
    }
  }

  async function handlePackDelete(pack) {
    if (!selectedClient) return;

    setDeliverablesMutating(true);
    setDeliverablesError('');
    setDeliverablesNotice('');

    try {
      await fetchJson(`/api/admin/clients/${selectedClient.userId}/deliverables/packs/${pack.id}`, {
        method: 'DELETE',
      });

      setDeliverablesNotice('Deliverable pack deleted.');
      await loadDeliverables();
    } catch (error) {
      setDeliverablesError(error.message || 'Unable to delete deliverable pack.');
      setDatabaseBannerFromError(error);
    } finally {
      setDeliverablesMutating(false);
    }
  }

  async function handleItemStepChange(item, nextStepStatus) {
    if (!selectedClient) return;

    setDeliverablesMutating(true);
    setDeliverablesError('');
    setDeliverablesNotice('');

    try {
      await fetchJson(`/api/admin/clients/${selectedClient.userId}/deliverables/items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stepStatus: nextStepStatus,
        }),
      });

      await loadDeliverables();
    } catch (error) {
      setDeliverablesError(error.message || 'Unable to update item step.');
      setDatabaseBannerFromError(error);
    } finally {
      setDeliverablesMutating(false);
    }
  }

  async function handleInvoiceFulfill(invoice) {
    if (!selectedClient) return;

    setDeliverablesMutating(true);
    setDeliverablesError('');
    setDeliverablesNotice('');

    try {
      await fetchJson(`/api/admin/clients/${selectedClient.userId}/deliverables/invoices/${encodeURIComponent(invoice.invoiceId)}/fulfill`, {
        method: 'POST',
      });

      setDeliverablesNotice('Invoice deliverables marked as completed.');
      await loadDeliverables();
    } catch (error) {
      setDeliverablesError(error.message || 'Unable to fulfill this invoice.');
      setDatabaseBannerFromError(error);
    } finally {
      setDeliverablesMutating(false);
    }
  }

  function getBreadcrumb() {
    if (activeNav === 'applications') {
      return 'Careers / Applications / Inbox';
    }

    if (activeNav === 'clients' && selectedClient) {
      return `Clients / ${currentScopeLabel} / Workspace`;
    }

    return `Clients / ${currentScopeLabel} / ${activeNavLabel}`;
  }

  function getHeaderTitle() {
    if (activeNav === 'applications') {
      return 'Careers Applications Inbox';
    }

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

  function renderDeliverablesTracking() {
    const summary = deliverablesData?.summary || {
      invoiceCount: 0,
      packCount: 0,
      totalItems: 0,
      completedItems: 0,
    };

    return (
      <div className="mt-4 rounded-lg border border-neutral-200 p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Deliverables Tracking</p>
            <HintTooltip text="Auto-syncs inferred packs from recent invoices and lets you manually track every deliverable step." />
          </div>

          <button
            type="button"
            onClick={loadDeliverables}
            disabled={deliverablesLoading || deliverablesMutating}
            className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deliverablesLoading ? 'Syncing...' : 'Sync now'}
          </button>
        </div>

        <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Invoices" value={String(summary.invoiceCount)} />
          <MetricCard label="Packs" value={String(summary.packCount)} />
          <MetricCard label="Deliverables" value={String(summary.totalItems)} />
          <MetricCard
            label="Completed"
            value={String(summary.completedItems)}
            helper={summary.totalItems > 0 ? `${Math.round((summary.completedItems / summary.totalItems) * 100)}% done` : '0% done'}
            tone={summary.completedItems > 0 ? 'green' : 'gray'}
          />
        </div>

        {deliverablesData?.syncedAt ? (
          <p className="mb-2 text-[11px] text-neutral-500">
            Last synced {formatDate(deliverablesData.syncedAt)}
            {deliverablesData.insertedCount > 0 ? ` • ${deliverablesData.insertedCount} auto-created` : ''}
          </p>
        ) : null}

        {deliverablesData?.warnings?.length > 0 ? (
          <p className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {deliverablesData.warnings[0]}
          </p>
        ) : null}

        {deliverablesError ? (
          <p className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {deliverablesError}
          </p>
        ) : null}

        {deliverablesNotice ? (
          <p className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {deliverablesNotice}
          </p>
        ) : null}

        {deliverablesLoading && !deliverablesData ? (
          <LoadingGrid />
        ) : null}

        {!deliverablesLoading && (!deliverablesData?.invoices || deliverablesData.invoices.length === 0) ? (
          <EmptyState
            title="No deliverable packs yet"
            description="When invoice text contains numeric quantities, packs are auto-created. You can still create packs manually."
          />
        ) : null}

        <div className="space-y-3">
          {(deliverablesData?.invoices || []).map((invoice) => {
            const form = manualPackForms[invoice.invoiceId] || {};
            return (
              <div key={invoice.invoiceId} className="rounded-lg border border-neutral-200 bg-white p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {invoice.invoiceNumber || invoice.invoiceId}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {formatDate(invoice.createdAt)} • Due {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill tone={getPurchaseStateTone(invoice.purchaseState)}>
                      {invoice.purchaseStateLabel || invoice.purchaseState || 'Other'}
                    </StatusPill>
                    <button
                      type="button"
                      onClick={() => handleInvoiceFulfill(invoice)}
                      disabled={deliverablesMutating || invoice.packCount === 0}
                      className="cursor-pointer rounded-md border border-neutral-300 px-2 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark Invoice Fulfilled
                    </button>
                  </div>
                </div>

                <div className="mb-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full bg-neutral-900 transition-all"
                    style={{ width: `${invoice.progressPercent || 0}%` }}
                  />
                </div>
                <p className="mb-3 text-xs text-neutral-600">
                  {invoice.completedItems}/{invoice.totalItems} deliverables completed
                </p>

                {(invoice.inferred || []).length > 0 ? (
                  <div className="mb-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Auto inference</p>
                    <div className="mt-1 space-y-1">
                      {invoice.inferred.map((inferred, index) => (
                        <p key={`${invoice.invoiceId}-${inferred.lineKey}-${inferred.packType}-${index}`} className="text-xs text-neutral-700">
                          {inferred.quantity} {inferred.packType === 'video_pack' ? 'video' : 'website feature'} deliverable(s) from{' '}
                          <span className="font-medium">{inferred.lineLabel || inferred.lineKey}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mb-3 text-xs text-neutral-500">No numeric inference matched this invoice.</p>
                )}

                <div className="mb-3 rounded-lg border border-dashed border-neutral-300 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Manual pack</p>
                  <div className="mt-2 grid gap-2 md:grid-cols-4">
                    <select
                      value={form.sourceLineKey || 'invoice_text'}
                      onChange={(event) => {
                        const selectedLine = (invoice.lineOptions || []).find((line) => line.lineKey === event.target.value);
                        setManualPackFormValue(invoice.invoiceId, 'sourceLineKey', event.target.value);
                        setManualPackFormValue(invoice.invoiceId, 'sourceLineLabel', selectedLine?.label || 'Invoice details');
                      }}
                      className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-2 text-xs outline-none focus:border-black"
                    >
                      {(invoice.lineOptions || []).map((line) => (
                        <option key={line.lineKey} value={line.lineKey}>
                          {line.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={form.packType || 'video_pack'}
                      onChange={(event) => setManualPackFormValue(invoice.invoiceId, 'packType', event.target.value)}
                      className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-2 text-xs outline-none focus:border-black"
                    >
                      {DELIVERABLE_PACK_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      value={form.quantity || 1}
                      onChange={(event) => setManualPackFormValue(invoice.invoiceId, 'quantity', event.target.value)}
                      className="rounded-md border border-neutral-300 px-2 py-2 text-xs outline-none focus:border-black"
                    />

                    <button
                      type="button"
                      onClick={() => handleManualPackCreate(invoice)}
                      disabled={deliverablesMutating}
                      className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Add Manual Pack
                    </button>
                  </div>
                </div>

                {(invoice.packs || []).length === 0 ? (
                  <p className="text-xs text-neutral-500">No packs tracked for this invoice yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(invoice.packs || []).map((pack) => {
                      const draft = packDrafts[pack.id] || {
                        packType: pack.packType,
                        quantity: String(pack.quantity),
                      };

                      return (
                        <div key={pack.id} className="rounded-lg border border-neutral-200 p-3">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-neutral-900">
                                {pack.packTypeLabel} • {pack.sourceLineLabel || pack.sourceLineKey}
                              </p>
                              <p className="text-[11px] text-neutral-500">
                                {pack.origin === 'auto_inferred' ? 'Auto-inferred' : 'Manual'} • {pack.completedCount}/{pack.quantity} complete
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={draft.packType}
                                onChange={(event) => setPackDraftValue(pack.id, 'packType', event.target.value)}
                                className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-black"
                              >
                                {DELIVERABLE_PACK_TYPE_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="number"
                                min={1}
                                value={draft.quantity}
                                onChange={(event) => setPackDraftValue(pack.id, 'quantity', event.target.value)}
                                className="w-20 rounded-md border border-neutral-300 px-2 py-1.5 text-xs outline-none focus:border-black"
                              />
                              <button
                                type="button"
                                onClick={() => handlePackSave(pack)}
                                disabled={deliverablesMutating}
                                className="cursor-pointer rounded-md border border-neutral-300 px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePackDelete(pack)}
                                disabled={deliverablesMutating}
                                className="cursor-pointer rounded-md border border-rose-200 px-2 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="mb-2 h-2 overflow-hidden rounded-full bg-neutral-200">
                            <div
                              className="h-full bg-neutral-900 transition-all"
                              style={{ width: `${pack.progressPercent || 0}%` }}
                            />
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {(pack.items || []).map((item) => (
                              <div key={item.id} className="rounded-md border border-neutral-200 px-2 py-2">
                                <p className="text-[11px] font-semibold text-neutral-800">Deliverable {item.itemIndex}</p>
                                <select
                                  value={item.stepStatus}
                                  onChange={(event) => handleItemStepChange(item, event.target.value)}
                                  disabled={deliverablesMutating}
                                  className="cursor-pointer mt-1 w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {DELIVERABLE_STEP_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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

            <div className="mb-4 rounded-lg border border-neutral-200 p-3">
              <div className="mb-2 flex items-center gap-2">
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Drive Workspace</p>
                <HintTooltip text="Optional. You can add, change, or remove this at any time." />
              </div>

              <form onSubmit={handleDriveWorkspaceSubmit} className="space-y-2">
                <input
                  value={driveWorkspaceForm.driveFolderId}
                  onChange={(event) =>
                    setDriveWorkspaceForm((previous) => ({
                      ...previous,
                      driveFolderId: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                  placeholder="Drive folder ID (optional)"
                />
                <input
                  value={driveWorkspaceForm.driveFolderUrl}
                  onChange={(event) =>
                    setDriveWorkspaceForm((previous) => ({
                      ...previous,
                      driveFolderUrl: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                  placeholder="Drive folder URL (optional)"
                />

                {driveWorkspaceError ? (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    {driveWorkspaceError}
                  </p>
                ) : null}

                {driveWorkspaceSuccess ? (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    {driveWorkspaceSuccess}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={driveWorkspaceLoading}
                    className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {driveWorkspaceLoading ? 'Saving...' : 'Save Drive workspace'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDriveWorkspaceClear}
                    disabled={driveWorkspaceLoading}
                    className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              </form>
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

            {renderDeliverablesTracking()}
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

  function renderApplicationsSection() {
    const summary = applicationsSummary || {
      total: applications.length,
      withResume: applications.filter((application) => Boolean(application.resumeName)).length,
      withPortfolioLink: applications.filter((application) => Boolean(application.linkedin)).length,
      latestSubmittedAt: applications[0]?.submittedAt || null,
      roleBreakdown: [],
    };

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Applications" value={String(summary.total)} tone="blue" />
          <MetricCard
            label="Resume Included"
            value={String(summary.withResume)}
            tone={summary.withResume > 0 ? 'green' : 'gray'}
          />
          <MetricCard
            label="Portfolio Link"
            value={String(summary.withPortfolioLink)}
            tone={summary.withPortfolioLink > 0 ? 'blue' : 'gray'}
          />
          <MetricCard
            label="Latest Submission"
            value={summary.latestSubmittedAt ? formatDate(summary.latestSubmittedAt) : '—'}
            helper={summary.latestSubmittedAt ? formatDateTime(summary.latestSubmittedAt) : 'No applications yet'}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Inbox</p>
              <button
                type="button"
                onClick={loadApplications}
                disabled={applicationsLoading}
                className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {applicationsLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {summary.roleBreakdown?.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {summary.roleBreakdown.map((role) => (
                  <StatusPill key={`${role.roleId || role.roleTitle}-${role.count}`}>
                    {role.roleTitle} ({role.count})
                  </StatusPill>
                ))}
              </div>
            ) : null}

            {applicationsError ? (
              <EmptyState
                title="Could not load applications"
                description={applicationsError}
                actionLabel="Retry"
                onAction={loadApplications}
              />
            ) : applicationsLoading && applications.length === 0 ? (
              <LoadingGrid />
            ) : applications.length === 0 ? (
              <EmptyState
                title="No careers submissions yet"
                description="New applications from your careers form will appear here automatically."
              />
            ) : (
              <div className="space-y-2">
                {applications.map((application) => {
                  const isSelected = String(selectedApplication?.id) === String(application.id);
                  return (
                    <button
                      key={application.id}
                      type="button"
                      onClick={() => setSelectedApplicationId(application.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{application.fullName}</p>
                          <p className={`text-xs ${isSelected ? 'text-neutral-200' : 'text-neutral-500'}`}>
                            {application.email}
                          </p>
                        </div>
                        <StatusPill tone={isSelected ? 'gray' : 'blue'}>{application.roleTitle}</StatusPill>
                      </div>
                      <p className={`mt-2 text-xs ${isSelected ? 'text-neutral-200' : 'text-neutral-600'}`}>
                        {application.notesPreview}
                      </p>
                      <p className={`mt-2 text-[11px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {formatDateTime(application.submittedAt)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            {!selectedApplication ? (
              <EmptyState
                title="Select an application"
                description="Choose any row from the inbox to open the full submission."
              />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Full Application</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                      {selectedApplication.fullName}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">{selectedApplication.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone="blue">{selectedApplication.roleTitle}</StatusPill>
                    <StatusPill tone={selectedApplication.resumeName ? 'green' : 'gray'}>
                      {selectedApplication.resumeName ? 'Resume attached' : 'No resume file'}
                    </StatusPill>
                    <StatusPill tone={selectedApplication.linkedin ? 'blue' : 'gray'}>
                      {selectedApplication.linkedin ? 'Portfolio included' : 'No portfolio link'}
                    </StatusPill>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Submitted</p>
                    <p className="mt-1 text-sm text-neutral-900">{formatDateTime(selectedApplication.submittedAt)}</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Location</p>
                    <p className="mt-1 text-sm text-neutral-900">{selectedApplication.location || '—'}</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Portfolio</p>
                    {selectedApplication.linkedin ? (
                      <a
                        href={selectedApplication.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block break-all text-sm font-medium text-blue-700 underline decoration-blue-200 underline-offset-4"
                      >
                        {selectedApplication.linkedin}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-neutral-500">Not provided</p>
                    )}
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Resume Name</p>
                    <p className="mt-1 break-all text-sm text-neutral-900">
                      {selectedApplication.resumeName || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Why They Are a Fit</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-800">
                    {selectedApplication.notes || 'No fit statement provided.'}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">Quick Actions</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${selectedApplication.email}`}
                      className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400"
                    >
                      Email applicant
                    </a>
                    {selectedApplication.linkedin ? (
                      <a
                        href={selectedApplication.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400"
                      >
                        Open portfolio
                      </a>
                    ) : null}
                  </div>
                  {selectedApplication.ipAddress ? (
                    <p className="mt-2 text-[11px] text-neutral-500">
                      Submitter IP: {selectedApplication.ipAddress}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
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
              placeholder="Drive folder ID (optional)"
            />
            <input
              value={provisionForm.driveFolderUrl}
              onChange={(event) => setProvisionForm((previous) => ({ ...previous, driveFolderUrl: event.target.value }))}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Drive folder URL (optional)"
            />

            <p className="md:col-span-2 text-xs text-neutral-500">
              Drive workspace is optional during creation. You can add, change, or remove it later from the client workspace card.
            </p>

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

  function renderNotesSection() {
    return <AdminNotesPane />;
  }

  function renderMainPanel() {
    if (activeNav === 'command') return renderCommandCenter();
    if (activeNav === 'clients') return renderClientsSection();
    if (activeNav === 'revenue') return renderRevenueSection();
    if (activeNav === 'applications') return renderApplicationsSection();
    if (activeNav === 'notes') return renderNotesSection();
    if (activeNav === 'settings') return renderSettingsSection();
    return renderCommandCenter();
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="min-w-[140px]">
            <span className="text-sm font-black tracking-tight sm:text-base">USATII MEDIA</span>
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
              placeholder={searchPlaceholder}
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

          <details className="relative">
            <summary className="cursor-pointer list-none rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                {ownerLabel}
                <span className="text-[10px] text-neutral-500">▼</span>
              </span>
            </summary>

            <div className="absolute right-0 z-50 mt-2 w-52 rounded-md border border-neutral-200 bg-white p-1 shadow-lg">
              <p className="truncate px-3 py-2 text-xs text-neutral-500">{adminEmail}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
              >
                Sign out
              </button>
            </div>
          </details>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-neutral-200 bg-white lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
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

        <main className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm text-neutral-500">{getBreadcrumb()}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">{getHeaderTitle()}</h1>
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
