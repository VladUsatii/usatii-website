'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

function pad(value) {
  return String(value).padStart(2, '0');
}

function todayInputDate() {
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function minusDaysInputDate(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value) || 0);
}

function formatPercent(value) {
  return `${(Number(value) || 0).toFixed(2)}%`;
}

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return payload;
}

function cardTone(tone = 'gray') {
  const tones = {
    green: 'border-emerald-200',
    yellow: 'border-amber-200',
    red: 'border-rose-200',
    blue: 'border-blue-200',
    gray: 'border-neutral-200',
  };

  return tones[tone] || tones.gray;
}

function statusTone(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'resolved') return 'green';
  if (normalized === 'in_review') return 'blue';
  if (normalized === 'declined') return 'red';
  if (normalized === 'urgent') return 'red';
  return 'yellow';
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
  return (
    <div className={`rounded-xl border bg-white p-4 ${cardTone(tone)}`}>
      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">{value}</p>
      {helper ? <p className="mt-1 text-xs text-neutral-600">{helper}</p> : null}
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center">
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-xs text-neutral-600">{description}</p>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

export default function AdminTelemetryPane() {
  const timezoneOffsetMinutes = useMemo(() => new Date().getTimezoneOffset(), []);
  const [fromDate, setFromDate] = useState(() => minusDaysInputDate(30));
  const [toDate, setToDate] = useState(() => todayInputDate());
  const [includeDeclined, setIncludeDeclined] = useState(false);
  const [quoteQueryInput, setQuoteQueryInput] = useState('');
  const [quoteQuery, setQuoteQuery] = useState('');

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  const [quoteData, setQuoteData] = useState({ rows: [], summary: null });
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState('');
  const [quoteNotice, setQuoteNotice] = useState('');
  const [savingQuoteId, setSavingQuoteId] = useState(null);

  const [refreshToken, setRefreshToken] = useState(0);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('from', fromDate);
    params.set('to', toDate);
    params.set('tzOffsetMinutes', String(timezoneOffsetMinutes));
    params.set('includeDeclined', includeDeclined ? 'true' : 'false');
    if (quoteQuery.trim()) params.set('q', quoteQuery.trim());
    params.set('limit', '300');
    return params.toString();
  }, [fromDate, toDate, includeDeclined, quoteQuery, timezoneOffsetMinutes]);

  const exportHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set('from', fromDate);
    params.set('to', toDate);
    params.set('tzOffsetMinutes', String(timezoneOffsetMinutes));
    params.set('includeDeclined', includeDeclined ? 'true' : 'false');
    if (quoteQuery.trim()) params.set('q', quoteQuery.trim());
    return `/api/admin/telemetry/quotes/export?${params.toString()}`;
  }, [fromDate, toDate, includeDeclined, quoteQuery, timezoneOffsetMinutes]);

  const loadTelemetrySummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError('');

    try {
      const params = new URLSearchParams();
      params.set('from', fromDate);
      params.set('to', toDate);
      params.set('tzOffsetMinutes', String(timezoneOffsetMinutes));
      const payload = await fetchJson(`/api/admin/telemetry?${params.toString()}`);
      setSummary(payload);
    } catch (error) {
      setSummaryError(error.message || 'Unable to load telemetry summary.');
    } finally {
      setSummaryLoading(false);
    }
  }, [fromDate, toDate, timezoneOffsetMinutes]);

  const loadQuoteRequests = useCallback(async () => {
    setQuoteLoading(true);
    setQuoteError('');
    setQuoteNotice('');

    try {
      const payload = await fetchJson(`/api/admin/telemetry/quotes?${queryString}`);
      setQuoteData({
        rows: Array.isArray(payload.rows) ? payload.rows : [],
        summary: payload.summary || null,
      });
    } catch (error) {
      setQuoteError(error.message || 'Unable to load quote requests.');
    } finally {
      setQuoteLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    loadTelemetrySummary();
    loadQuoteRequests();
  }, [loadTelemetrySummary, loadQuoteRequests, refreshToken]);

  async function updateQuoteStatus(id, nextStatus) {
    setSavingQuoteId(id);
    setQuoteError('');
    setQuoteNotice('');

    const payload = { status: nextStatus };
    if (nextStatus === 'declined') {
      const reason = window.prompt('Optional decline reason:', '');
      if (reason !== null) payload.declineReason = reason;
    }

    try {
      await fetchJson(`/api/admin/telemetry/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setQuoteNotice('Quote request status updated.');
      await loadQuoteRequests();
    } catch (error) {
      setQuoteError(error.message || 'Unable to update quote request.');
    } finally {
      setSavingQuoteId(null);
    }
  }

  function applyDatePreset(daysBack) {
    setFromDate(minusDaysInputDate(daysBack));
    setToDate(todayInputDate());
  }

  const kpis = summary?.kpis || {};
  const funnel = summary?.funnel || {};
  const quoteSummary = quoteData.summary || {
    total: quoteData.rows.length,
    newCount: 0,
    inReviewCount: 0,
    declinedCount: 0,
    resolvedCount: 0,
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Telemetry Window</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">Site and API performance</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-black"
            />
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={() => applyDatePreset(7)}
              className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              Last 7d
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset(30)}
              className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              Last 30d
            </button>
            <button
              type="button"
              onClick={() => setRefreshToken((value) => value + 1)}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {summaryError ? (
        <EmptyState title="Telemetry unavailable" description={summaryError} />
      ) : summaryLoading && !summary ? (
        <LoadingGrid />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Visits" value={formatNumber(kpis.visits)} tone="blue" />
            <MetricCard label="Signups" value={formatNumber(kpis.signups)} tone="green" />
            <MetricCard label="Activated Employee Accounts" value={formatNumber(kpis.activatedEmployeeAccounts)} tone="green" />
            <MetricCard label="Active Quote Request Users" value={formatNumber(kpis.activeQuoteRequestUsers)} tone="yellow" />
            <MetricCard label="Error Rate" value={formatPercent(kpis.errorRate)} tone={Number(kpis.errorRate) > 2 ? 'red' : 'green'} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Average API Latency" value={`${formatNumber(kpis.apiAverageLatencyMs)} ms`} tone={Number(kpis.apiAverageLatencyMs) > 800 ? 'red' : 'blue'} />
            <MetricCard label="API Error Count" value={formatNumber(kpis.apiErrorCount)} tone={Number(kpis.apiErrorCount) > 0 ? 'red' : 'green'} />
            <MetricCard label="API Request Count" value={formatNumber(kpis.apiRequestCount)} tone="blue" />
            <MetricCard label="Failing Jobs" value={formatNumber(kpis.failingJobs)} tone={Number(kpis.failingJobs) > 0 ? 'red' : 'green'} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Traffic by Source</p>
              {summary?.trafficBySource?.length ? (
                <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Source</th>
                        <th className="px-3 py-2 text-left font-semibold">Visits</th>
                        <th className="px-3 py-2 text-left font-semibold">Signups</th>
                        <th className="px-3 py-2 text-left font-semibold">Source to Signup</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.trafficBySource.map((row) => (
                        <tr key={row.source} className="border-t border-neutral-100">
                          <td className="px-3 py-2 font-medium text-neutral-900">{row.source}</td>
                          <td className="px-3 py-2 text-neutral-700">{formatNumber(row.visits)}</td>
                          <td className="px-3 py-2 text-neutral-700">{formatNumber(row.signups)}</td>
                          <td className="px-3 py-2 text-neutral-700">{formatPercent(row.sourceToSignup)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-xs text-neutral-500">No source traffic yet in this range.</p>
              )}
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Landing Pages</p>
              {summary?.landingPages?.length ? (
                <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Path</th>
                        <th className="px-3 py-2 text-left font-semibold">Sessions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.landingPages.map((row) => (
                        <tr key={`${row.path}-${row.sessions}`} className="border-t border-neutral-100">
                          <td className="px-3 py-2 font-medium text-neutral-900">{row.path}</td>
                          <td className="px-3 py-2 text-neutral-700">{formatNumber(row.sessions)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-xs text-neutral-500">No landing sessions yet in this range.</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Top Pages Visited</p>
              {summary?.topPagesVisited?.length ? (
                <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Page</th>
                        <th className="px-3 py-2 text-left font-semibold">Visits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.topPagesVisited.map((row) => (
                        <tr key={`${row.path}-${row.visits}`} className="border-t border-neutral-100">
                          <td className="px-3 py-2 font-medium text-neutral-900">{row.path}</td>
                          <td className="px-3 py-2 text-neutral-700">{formatNumber(row.visits)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-xs text-neutral-500">No page-visit rows in this range.</p>
              )}
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Funnel Conversion</p>
              <div className="mt-3 space-y-2 rounded-lg border border-neutral-200 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Landing Sessions</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(funnel.landingSessions)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Contact Intent Sessions</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(funnel.contactIntentSessions)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Quote Submit Sessions</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(funnel.quoteSubmitSessions)}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill tone="blue">L→I {formatPercent(funnel.lToIRate)}</StatusPill>
                <StatusPill tone="green">I→S {formatPercent(funnel.iToSRate)}</StatusPill>
                <StatusPill tone="yellow">L→S {formatPercent(funnel.lToSRate)}</StatusPill>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Accounts</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">Quote requests with urgency labeling</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              value={quoteQueryInput}
              onChange={(event) => setQuoteQueryInput(event.target.value)}
              placeholder="Search name, email, source..."
              className="rounded-md border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={() => setQuoteQuery(quoteQueryInput)}
              className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              Apply
            </button>
            <a
              href={exportHref}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400"
            >
              Export CSV
            </a>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIncludeDeclined((value) => !value)}
            className={`cursor-pointer rounded-md border px-3 py-2 text-xs font-semibold transition ${
              includeDeclined
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
            }`}
          >
            Show declined quote requests ({formatNumber(quoteSummary.declinedCount)})
          </button>
          <StatusPill tone="yellow">New {formatNumber(quoteSummary.newCount)}</StatusPill>
          <StatusPill tone="blue">In Review {formatNumber(quoteSummary.inReviewCount)}</StatusPill>
          <StatusPill tone="green">Resolved {formatNumber(quoteSummary.resolvedCount)}</StatusPill>
        </div>

        {quoteError ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{quoteError}</p>
        ) : null}

        {quoteNotice ? (
          <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{quoteNotice}</p>
        ) : null}

        {quoteLoading && quoteData.rows.length === 0 ? (
          <LoadingGrid />
        ) : quoteData.rows.length === 0 ? (
          <EmptyState
            title="No quote requests in this range"
            description="Submissions from the quick quote form will show here automatically."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Summary</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-left font-semibold">Timestamp</th>
                  <th className="px-3 py-2 text-left font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {quoteData.rows.map((row) => {
                  const statusLabel = `${row.status}${row.urgency === 'urgent' ? 'Urgent' : row.urgency === 'low' ? 'Low' : ''}`;
                  return (
                    <tr key={row.id} className="border-t border-neutral-100 align-top">
                      <td className="px-3 py-2">
                        <p className="font-medium text-neutral-900">{row.fullName}</p>
                        <p className="text-xs text-neutral-500">{row.originPath}</p>
                        <p className="text-xs text-neutral-500">Source: {row.source}</p>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col items-start gap-2">
                          <StatusPill tone={statusTone(row.status)}>{statusLabel}</StatusPill>
                          <select
                            value={row.status}
                            disabled={savingQuoteId === row.id}
                            onChange={(event) => updateQuoteStatus(row.id, event.target.value)}
                            className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <option value="new">new</option>
                            <option value="in_review">in_review</option>
                            <option value="resolved">resolved</option>
                            <option value="declined">declined</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-neutral-700">{formatDateTime(row.submittedAt)}</td>
                      <td className="px-3 py-2 text-xs leading-5 text-neutral-700">
                        <p>Email: {row.email || '—'}</p>
                        <p>Phone: {row.phone || '—'}</p>
                        <p>Address: {row.address || '—'}</p>
                        <p>Customer Type: {row.customerType || '—'}</p>
                        <p className="mt-1 whitespace-pre-wrap">Message: {row.message}</p>
                        {row.declineReason ? <p className="mt-1 text-rose-700">Decline reason: {row.declineReason}</p> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
