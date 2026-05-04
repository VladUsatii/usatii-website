'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const PAYMENT_INTERVAL_OPTIONS = [
  { value: '7d', label: 'Last 7d' },
  { value: '30d', label: 'Last 30d' },
  { value: '90d', label: 'Last 90d' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
];

const FEDERAL_LOWEST_RATE = 0.1;
const NY_STATE_LOWEST_RATE = 0.04;

const DEFAULT_PAYMENTS_PORTAL_URL = process.env.NEXT_PUBLIC_ONLINE_PAYMENT_PORTAL_URL || 'https://www.paypal.com/businessmanage/transactions';

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

function toSearchBlob(value) {
  return String(value || '').toLowerCase();
}

function matchSearch(query, values) {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return values.some((value) => toSearchBlob(value).includes(normalized));
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

function isReceivedPayment(payment) {
  return payment?.includeInTaxEstimate === true;
}

function netFromGrossAndFee(payment) {
  const grossCents = Number(payment?.grossCents || 0);
  const feeCents = Math.abs(Number(payment?.feeCents || 0));
  return grossCents - feeCents;
}

function buildPaymentPortalUrl(paymentId = '') {
  const trimmed = String(paymentId || '').trim();
  if (!trimmed) return DEFAULT_PAYMENTS_PORTAL_URL;

  const separator = DEFAULT_PAYMENTS_PORTAL_URL.includes('?') ? '&' : '?';
  return `${DEFAULT_PAYMENTS_PORTAL_URL}${separator}query=${encodeURIComponent(trimmed)}`;
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

function clientLabel(client) {
  return client?.displayName || client?.company || client?.email || 'All Clients';
}

export default function AdminPaymentsPane({
  selectedClient = null,
  globalSearch = '',
  onDatabaseError,
}) {
  const [interval, setInterval] = useState('30d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contextMenu, setContextMenu] = useState(null);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    const hasCustomRange = Boolean(customStartDate && customEndDate);

    if (hasCustomRange && new Date(customStartDate) > new Date(customEndDate)) {
      setLoading(false);
      setError('Custom start date must be on or before end date.');
      return;
    }

    if (hasCustomRange) {
      params.set('start', customStartDate);
      params.set('end', customEndDate);
    } else {
      params.set('interval', interval);
    }

    if (selectedClient?.email) {
      params.set('clientEmail', String(selectedClient.email).toLowerCase());
    }

    try {
      const payload = await fetchJson(`/api/admin/revenue/paypal?${params.toString()}`);
      setData(payload);
    } catch (nextError) {
      setError(nextError.message || 'Unable to load payments.');
      if (typeof onDatabaseError === 'function') {
        onDatabaseError(nextError);
      }
    } finally {
      setLoading(false);
    }
  }, [interval, customStartDate, customEndDate, selectedClient?.email, onDatabaseError]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    if (!contextMenu) return undefined;

    function closeMenu() {
      setContextMenu(null);
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    window.addEventListener('click', closeMenu);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('click', closeMenu);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [contextMenu]);

  const portalUrl = useMemo(() => {
    const configured = String(data?.paymentPortalUrl || '').trim();
    return configured || DEFAULT_PAYMENTS_PORTAL_URL;
  }, [data?.paymentPortalUrl]);

  const paymentCurrency = data?.paymentSummary?.currency || data?.invoiceSummary?.currency || 'USD';

  const allReceivedPayments = useMemo(() => {
    const rows = Array.isArray(data?.transactions) ? data.transactions : [];
    return rows.filter(isReceivedPayment);
  }, [data?.transactions]);

  const receivedPayments = useMemo(() => {
    return allReceivedPayments.filter((payment) =>
      matchSearch(globalSearch, [
        payment.id,
        payment.payerDisplay,
        payment.payerName,
        payment.email,
        payment.status,
        payment.grossCents,
        payment.netCents,
        payment.occurredAt,
      ])
    );
  }, [allReceivedPayments, globalSearch]);

  const totals = useMemo(() => {
    return allReceivedPayments.reduce(
      (summary, payment) => {
        summary.receivedCount += 1;
        summary.grossCents += Number(payment.grossCents || 0);
        summary.feeCents += Math.abs(Number(payment.feeCents || 0));
        summary.netCents += netFromGrossAndFee(payment);
        return summary;
      },
      {
        receivedCount: 0,
        grossCents: 0,
        feeCents: 0,
        netCents: 0,
      }
    );
  }, [allReceivedPayments]);

  const federalEstimateCents = Math.round(totals.netCents * FEDERAL_LOWEST_RATE);
  const nyStateEstimateCents = Math.round(totals.netCents * NY_STATE_LOWEST_RATE);
  const totalEstimateCents = federalEstimateCents + nyStateEstimateCents;

  function openPaymentPortal(paymentId = '') {
    const url = paymentId ? buildPaymentPortalUrl(paymentId) : portalUrl;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function openContextMenu(event, payment) {
    event.preventDefault();

    const menuWidth = 240;
    const menuHeight = 120;
    const x = Math.min(event.clientX, window.innerWidth - menuWidth - 10);
    const y = Math.min(event.clientY, window.innerHeight - menuHeight - 10);

    setContextMenu({
      x: Math.max(10, x),
      y: Math.max(10, y),
      payment,
    });
  }

  const scopeLabel = selectedClient ? clientLabel(selectedClient) : 'All Clients';
  const range = data?.range || null;
  const rangeLabel = range?.label || 'Selected range';
  const rangeDates = range
    ? `${formatDate(range.start)} to ${formatDate(range.end)}`
    : '—';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Payments Received</p>
            <p className="mt-1 text-sm text-neutral-600">
              Showing successful payments linked to created invoices for {scopeLabel}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={interval}
              onChange={(event) => setInterval(event.target.value)}
              disabled={Boolean(customStartDate && customEndDate)}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-black"
            >
              {PAYMENT_INTERVAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadPayments}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400"
            >
              Refresh
            </button>

            <input
              type="date"
              value={customStartDate}
              onChange={(event) => setCustomStartDate(event.target.value)}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-black"
              aria-label="Custom start date"
            />

            <input
              type="date"
              value={customEndDate}
              onChange={(event) => setCustomEndDate(event.target.value)}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-black"
              aria-label="Custom end date"
            />

            <button
              type="button"
              onClick={() => {
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              disabled={!customStartDate && !customEndDate}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear Dates
            </button>

            <button
              type="button"
              onClick={() => openPaymentPortal()}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400"
            >
              Open Portal
            </button>
          </div>
        </div>

        <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Tax estimate assumes NY lowest bracket: 10% federal + 4% NY state, applied to net received in this time block.
          This is a planning estimate, not tax advice. Payer-email blocklist exclusions (including Namecheap) are applied.
        </p>

        <p className="mt-2 text-[11px] text-neutral-500">
          Right-click any payment row to jump to the online payment portal.
        </p>

        {customStartDate || customEndDate ? (
          <p className="mt-1 text-[11px] text-neutral-500">
            Custom range mode is active only when both dates are set.
          </p>
        ) : null}
      </div>

      {loading && !data ? <LoadingGrid /> : null}

      {error ? (
        <EmptyState
          title="Payments unavailable"
          description={error}
          actionLabel="Retry"
          onAction={loadPayments}
        />
      ) : null}

      {!error && data?.configured === false ? (
        <EmptyState
          title="PayPal not connected"
          description={data?.message || 'Add PayPal credentials to enable received payment tracking.'}
        />
      ) : null}

      {!error && data && data.configured !== false ? (
        <div className="space-y-4">
          {Array.isArray(data?.warnings) && data.warnings.length > 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {data.warnings[0]}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Received Payments"
              value={String(totals.receivedCount)}
              helper={`${rangeLabel} • ${rangeDates}`}
              tone="green"
            />
            <MetricCard label="Gross Received" value={formatMoneyFromCents(totals.grossCents, paymentCurrency)} tone="blue" />
            <MetricCard label="Fees" value={formatMoneyFromCents(totals.feeCents, paymentCurrency)} tone="yellow" />
            <MetricCard label="Net Received" value={formatMoneyFromCents(totals.netCents, paymentCurrency)} tone="green" />
            <MetricCard
              label="Est. Tax Payment"
              value={formatMoneyFromCents(totalEstimateCents, paymentCurrency)}
              helper={`${formatMoneyFromCents(federalEstimateCents, paymentCurrency)} federal • ${formatMoneyFromCents(nyStateEstimateCents, paymentCurrency)} NY`}
              tone="red"
            />
          </div>

          {receivedPayments.length === 0 ? (
            <EmptyState
              title="No received payments in this range"
              description="Try another interval, or remove filters to see more activity."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Payment ID</th>
                    <th className="px-3 py-2 text-left font-semibold">Payer</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                    <th className="px-3 py-2 text-left font-semibold">Gross</th>
                    <th className="px-3 py-2 text-left font-semibold">Fee</th>
                    <th className="px-3 py-2 text-left font-semibold">Net</th>
                    <th className="px-3 py-2 text-left font-semibold">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedPayments.map((payment) => (
                    <tr
                      key={payment.id || `${payment.email}-${payment.occurredAt}`}
                      className="border-t border-neutral-100 transition hover:bg-neutral-50"
                      onContextMenu={(event) => openContextMenu(event, payment)}
                    >
                      <td className="px-3 py-2 font-medium text-neutral-900">{payment.id || '—'}</td>
                      <td className="px-3 py-2 text-neutral-700">{payment.payerDisplay || payment.email || '—'}</td>
                      <td className="px-3 py-2">
                        <StatusPill tone={getPaymentStatusTone(payment.status)}>
                          {payment.status || 'UNKNOWN'}
                        </StatusPill>
                      </td>
                      <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(payment.grossCents, payment.currency || paymentCurrency)}</td>
                      <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(Math.abs(Number(payment.feeCents || 0)), payment.currency || paymentCurrency)}</td>
                      <td className="px-3 py-2 text-neutral-700">{formatMoneyFromCents(netFromGrossAndFee(payment), payment.currency || paymentCurrency)}</td>
                      <td className="px-3 py-2 text-neutral-700">{formatDateTime(payment.occurredAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {contextMenu ? (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu(null)}
          role="presentation"
        >
          <div
            className="absolute z-50 w-60 rounded-lg border border-neutral-200 bg-white p-2 shadow-xl"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(event) => event.stopPropagation()}
            role="menu"
            tabIndex={-1}
          >
            <button
              type="button"
              onClick={() => {
                openPaymentPortal(contextMenu.payment?.id || '');
                setContextMenu(null);
              }}
              className="cursor-pointer w-full rounded-md px-2 py-2 text-left text-sm text-neutral-800 transition hover:bg-neutral-100"
            >
              Open this payment in portal
            </button>
            <button
              type="button"
              onClick={() => {
                openPaymentPortal();
                setContextMenu(null);
              }}
              className="cursor-pointer mt-1 w-full rounded-md px-2 py-2 text-left text-sm text-neutral-800 transition hover:bg-neutral-100"
            >
              Open payments portal
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
