import { portalSql } from '@/lib/portal/database';
import {
  ensureTelemetryTables,
  parseDateBoundary,
  toIsoDate,
  toPublicQuoteRequestRow,
} from '@/lib/portal/telemetry';

function toInt(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function percent(numerator, denominator) {
  if (!denominator || denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function clampDateRange(fromIso, toIso) {
  const fromDate = new Date(fromIso);
  const toDate = new Date(toIso);
  if (fromDate > toDate) {
    return {
      fromIso: new Date(toDate.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      toIso: toDate.toISOString(),
    };
  }
  return { fromIso: fromDate.toISOString(), toIso: toDate.toISOString() };
}

export function resolveTelemetryDateRange({ from, to, tzOffsetMinutes = 0 } = {}) {
  const parsedOffset = Number(tzOffsetMinutes);
  const safeTimezoneOffset = Number.isFinite(parsedOffset) ? parsedOffset : 0;

  const now = new Date();
  const defaultTo = toIsoDate(now.toISOString());
  const defaultFrom = toIsoDate(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString());

  const parsedFrom = parseDateBoundary(from || defaultFrom, 'start', safeTimezoneOffset);
  const parsedTo = parseDateBoundary(to || defaultTo, 'end', safeTimezoneOffset);

  if (Number.isNaN(parsedFrom) || Number.isNaN(parsedTo)) {
    const error = new Error('Invalid date range. Use YYYY-MM-DD.');
    error.code = 'invalid_date_range';
    throw error;
  }

  return clampDateRange(parsedFrom, parsedTo);
}

function normalizeSourceLabel(value) {
  const source = String(value || '').trim().toLowerCase();
  if (!source) return 'direct';
  return source;
}

function normalizePathLabel(value) {
  const raw = String(value || '').trim();
  if (!raw) return '/';
  return raw.startsWith('/') ? raw : `/${raw}`;
}

export async function getAdminTelemetrySummary({ fromIso, toIso }) {
  await ensureTelemetryTables();

  const [
    visitsResult,
    signupsResult,
    activatedAccountsResult,
    activeQuoteUsersResult,
    apiSummaryResult,
    failingJobsResult,
    sourceVisitsResult,
    sourceSignupsResult,
    landingPagesResult,
    topPagesResult,
    funnelResult,
  ] = await Promise.all([
    portalSql`
      SELECT COUNT(DISTINCT session_id)::int AS value
      FROM telemetry_events
      WHERE event_type = 'page_view'
        AND session_id IS NOT NULL
        AND path NOT LIKE '/admin%'
        AND created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
    `,
    portalSql`
      SELECT COUNT(*)::int AS value
      FROM telemetry_events
      WHERE event_type = 'signup'
        AND created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
    `,
    portalSql`
      SELECT COUNT(*)::int AS value
      FROM portal_users
      WHERE role = 'client'
        AND is_active = TRUE
        AND created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
    `,
    portalSql`
      SELECT COUNT(DISTINCT lower(email))::int AS value
      FROM quote_requests
      WHERE status <> 'declined'
        AND submitted_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
    `,
    portalSql`
      SELECT
        COUNT(*)::int AS request_count,
        COUNT(*) FILTER (WHERE status_code >= 400)::int AS error_count,
        COALESCE(AVG(latency_ms), 0)::float8 AS avg_latency_ms
      FROM telemetry_api_requests
      WHERE created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
    `,
    portalSql`
      SELECT COUNT(*)::int AS value
      FROM telemetry_job_runs
      WHERE status = 'failed'
        AND created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
    `,
    portalSql`
      SELECT source, COUNT(*)::int AS visits
      FROM telemetry_events
      WHERE event_type = 'page_view'
        AND path NOT LIKE '/admin%'
        AND created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
      GROUP BY source
      ORDER BY visits DESC, source ASC
      LIMIT 12
    `,
    portalSql`
      SELECT source, COUNT(*)::int AS signups
      FROM telemetry_events
      WHERE event_type = 'signup'
        AND created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
      GROUP BY source
    `,
    portalSql`
      WITH landing AS (
        SELECT
          session_id,
          path,
          ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at ASC, id ASC) AS rank_index
        FROM telemetry_events
        WHERE event_type = 'page_view'
          AND session_id IS NOT NULL
          AND path NOT LIKE '/admin%'
          AND created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
      )
      SELECT path, COUNT(*)::int AS sessions
      FROM landing
      WHERE rank_index = 1
      GROUP BY path
      ORDER BY sessions DESC, path ASC
      LIMIT 12
    `,
    portalSql`
      SELECT path, COUNT(*)::int AS visits
      FROM telemetry_events
      WHERE event_type = 'page_view'
        AND path NOT LIKE '/admin%'
        AND created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
      GROUP BY path
      ORDER BY visits DESC, path ASC
      LIMIT 12
    `,
    portalSql`
      SELECT
        COUNT(DISTINCT session_id) FILTER (
          WHERE event_type = 'page_view'
            AND session_id IS NOT NULL
            AND path NOT LIKE '/admin%'
        )::int AS landing_sessions,
        COUNT(DISTINCT session_id) FILTER (
          WHERE event_type = 'contact_intent'
            AND session_id IS NOT NULL
            AND path NOT LIKE '/admin%'
        )::int AS contact_intent_sessions,
        COUNT(DISTINCT session_id) FILTER (
          WHERE event_type = 'quote_submit'
            AND session_id IS NOT NULL
            AND path NOT LIKE '/admin%'
        )::int AS quote_submit_sessions
      FROM telemetry_events
      WHERE created_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
    `,
  ]);

  const visits = toInt(visitsResult.rows[0]?.value);
  const signups = toInt(signupsResult.rows[0]?.value);
  const activatedEmployeeAccounts = toInt(activatedAccountsResult.rows[0]?.value);
  const activeQuoteRequestUsers = toInt(activeQuoteUsersResult.rows[0]?.value);

  const apiRequestCount = toInt(apiSummaryResult.rows[0]?.request_count);
  const apiErrorCount = toInt(apiSummaryResult.rows[0]?.error_count);
  const apiAverageLatencyMs = Math.round(toNumber(apiSummaryResult.rows[0]?.avg_latency_ms));
  const errorRate = percent(apiErrorCount, apiRequestCount);
  const failingJobs = toInt(failingJobsResult.rows[0]?.value);

  const sourceSignupMap = new Map(
    sourceSignupsResult.rows.map((row) => [normalizeSourceLabel(row.source), toInt(row.signups)])
  );

  const trafficBySource = sourceVisitsResult.rows.map((row) => {
    const source = normalizeSourceLabel(row.source);
    const sourceVisits = toInt(row.visits);
    const sourceSignups = sourceSignupMap.get(source) || 0;
    return {
      source,
      visits: sourceVisits,
      signups: sourceSignups,
      sourceToSignup: percent(sourceSignups, sourceVisits),
    };
  });

  const landingPages = landingPagesResult.rows.map((row) => ({
    path: normalizePathLabel(row.path),
    sessions: toInt(row.sessions),
  }));

  const topPagesVisited = topPagesResult.rows.map((row) => ({
    path: normalizePathLabel(row.path),
    visits: toInt(row.visits),
  }));

  const funnelBase = funnelResult.rows[0] || {};
  const landingSessions = toInt(funnelBase.landing_sessions);
  const contactIntentSessions = toInt(funnelBase.contact_intent_sessions);
  const quoteSubmitSessions = toInt(funnelBase.quote_submit_sessions);

  return {
    dateRange: {
      from: toIsoDate(fromIso),
      to: toIsoDate(toIso),
    },
    kpis: {
      visits,
      signups,
      activatedEmployeeAccounts,
      activeQuoteRequestUsers,
      errorRate,
      apiAverageLatencyMs,
      apiErrorCount,
      apiRequestCount,
      failingJobs,
    },
    trafficBySource,
    landingPages,
    sourcePerformance: trafficBySource,
    topPagesVisited,
    funnel: {
      landingSessions,
      contactIntentSessions,
      quoteSubmitSessions,
      lToIRate: percent(contactIntentSessions, landingSessions),
      iToSRate: percent(quoteSubmitSessions, contactIntentSessions),
      lToSRate: percent(quoteSubmitSessions, landingSessions),
    },
  };
}

export async function listAdminQuoteRequests({
  fromIso,
  toIso,
  includeDeclined = false,
  search = '',
  limit = 200,
} = {}) {
  await ensureTelemetryTables();

  const cappedLimit = Math.max(1, Math.min(600, toInt(limit, 200)));
  const queryText = String(search || '').trim().slice(0, 200);

  const filterSql = includeDeclined
    ? portalSql`
        SELECT
          id,
          session_id,
          full_name,
          email,
          phone,
          address,
          customer_type,
          message,
          origin_path,
          source,
          urgency,
          status,
          decline_reason,
          submitted_at,
          updated_at
        FROM quote_requests
        WHERE submitted_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
          AND (
            ${queryText} = ''
            OR full_name ILIKE ${`%${queryText}%`}
            OR email ILIKE ${`%${queryText}%`}
            OR COALESCE(phone, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(address, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(customer_type, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(message, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(origin_path, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(source, '') ILIKE ${`%${queryText}%`}
          )
        ORDER BY submitted_at DESC, id DESC
        LIMIT ${cappedLimit}
      `
    : portalSql`
        SELECT
          id,
          session_id,
          full_name,
          email,
          phone,
          address,
          customer_type,
          message,
          origin_path,
          source,
          urgency,
          status,
          decline_reason,
          submitted_at,
          updated_at
        FROM quote_requests
        WHERE submitted_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
          AND status <> 'declined'
          AND (
            ${queryText} = ''
            OR full_name ILIKE ${`%${queryText}%`}
            OR email ILIKE ${`%${queryText}%`}
            OR COALESCE(phone, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(address, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(customer_type, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(message, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(origin_path, '') ILIKE ${`%${queryText}%`}
            OR COALESCE(source, '') ILIKE ${`%${queryText}%`}
          )
        ORDER BY submitted_at DESC, id DESC
        LIMIT ${cappedLimit}
      `;

  const summaryResult = await portalSql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
      COUNT(*) FILTER (WHERE status = 'in_review')::int AS in_review_count,
      COUNT(*) FILTER (WHERE status = 'declined')::int AS declined_count,
      COUNT(*) FILTER (WHERE status = 'resolved')::int AS resolved_count
    FROM quote_requests
    WHERE submitted_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
  `;

  const rows = (await filterSql).rows.map(toPublicQuoteRequestRow);
  const summary = summaryResult.rows[0] || {};

  return {
    rows,
    summary: {
      total: toInt(summary.total),
      newCount: toInt(summary.new_count),
      inReviewCount: toInt(summary.in_review_count),
      declinedCount: toInt(summary.declined_count),
      resolvedCount: toInt(summary.resolved_count),
    },
  };
}

function escapeCsvCell(value) {
  const raw = String(value ?? '');
  if (!/[",\n]/.test(raw)) return raw;
  return `"${raw.replace(/"/g, '""')}"`;
}

export function quoteRequestsToCsv(rows = []) {
  const header = [
    'id',
    'full_name',
    'email',
    'phone',
    'address',
    'customer_type',
    'message',
    'origin_path',
    'source',
    'urgency',
    'status',
    'decline_reason',
    'submitted_at',
    'updated_at',
  ];

  const lines = [header.join(',')];

  for (const row of rows) {
    lines.push(
      [
        row.id,
        row.fullName,
        row.email,
        row.phone,
        row.address,
        row.customerType,
        row.message,
        row.originPath,
        row.source,
        row.urgency,
        row.status,
        row.declineReason,
        row.submittedAt,
        row.updatedAt,
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }

  return lines.join('\n');
}
