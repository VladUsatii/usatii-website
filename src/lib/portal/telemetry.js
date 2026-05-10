import { ensurePortalTables } from '@/lib/portal/schema';
import { portalSql } from '@/lib/portal/database';

let tableInitPromise;

const TELEMETRY_EVENT_TYPES = new Set([
  'page_view',
  'contact_intent',
  'quote_submit',
  'signup',
]);

function toTrimmedString(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizePath(value) {
  const raw = toTrimmedString(value, 255);
  if (!raw) return '/';
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  return withSlash.slice(0, 255);
}

function normalizeSource(value) {
  const source = toTrimmedString(value, 160).toLowerCase();
  if (!source) return 'direct';
  return source;
}

export function isTelemetryExcludedPath(value) {
  const path = normalizePath(value);
  return path === '/admin' || path.startsWith('/admin/');
}

export function resolveSourceFromRequest(request, fallback = 'direct') {
  const forwardedHost = toTrimmedString(request.headers.get('host'), 160).toLowerCase();
  const refererRaw = toTrimmedString(request.headers.get('referer'), 500);
  const fallbackSource = normalizeSource(fallback);

  if (!refererRaw) return fallbackSource;

  try {
    const refererUrl = new URL(refererRaw);
    const refererHost = toTrimmedString(refererUrl.hostname, 160).toLowerCase();
    if (!refererHost) return fallbackSource;
    if (!forwardedHost || refererHost === forwardedHost || refererHost.endsWith(`.${forwardedHost}`)) {
      return fallbackSource;
    }
    return refererHost;
  } catch {
    return fallbackSource;
  }
}

export function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstHop = forwardedFor.split(',')[0]?.trim();
    if (firstHop) return firstHop.slice(0, 64);
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp?.trim()) return realIp.trim().slice(0, 64);

  if (process.env.NODE_ENV === 'development') return '127.0.0.1';
  return null;
}

export function inferUrgencyLabel({ message = '', customerType = '', requestedUrgency = '' } = {}) {
  const normalizedRequested = toTrimmedString(requestedUrgency, 32).toLowerCase();
  if (normalizedRequested === 'urgent' || normalizedRequested === 'normal' || normalizedRequested === 'low') {
    return normalizedRequested;
  }

  const content = `${String(message || '')} ${String(customerType || '')}`.toLowerCase();
  if (/\b(asap|urgent|immediately|right away|emergency)\b/.test(content)) return 'urgent';
  if (/\b(flexible|no rush|whenever)\b/.test(content)) return 'low';
  return 'normal';
}

export async function ensureTelemetryTables() {
  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      try {
        await ensurePortalTables();

        await portalSql`
          CREATE TABLE IF NOT EXISTS telemetry_events (
            id BIGSERIAL PRIMARY KEY,
            event_type VARCHAR(32) NOT NULL,
            session_id VARCHAR(96),
            path VARCHAR(255) NOT NULL DEFAULT '/',
            source VARCHAR(160) NOT NULL DEFAULT 'direct',
            referrer TEXT,
            ip_address VARCHAR(64),
            user_agent VARCHAR(500),
            metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS quote_requests (
            id BIGSERIAL PRIMARY KEY,
            session_id VARCHAR(96),
            full_name VARCHAR(120) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(80),
            address VARCHAR(255),
            customer_type VARCHAR(160),
            message TEXT NOT NULL,
            origin_path VARCHAR(255) NOT NULL DEFAULT '/',
            source VARCHAR(160) NOT NULL DEFAULT 'direct',
            urgency VARCHAR(16) NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'urgent')),
            status VARCHAR(24) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'declined', 'resolved')),
            decline_reason TEXT,
            submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS telemetry_api_requests (
            id BIGSERIAL PRIMARY KEY,
            route_key VARCHAR(180) NOT NULL,
            method VARCHAR(12) NOT NULL,
            status_code INTEGER NOT NULL,
            latency_ms INTEGER NOT NULL CHECK (latency_ms >= 0),
            error_message TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE TABLE IF NOT EXISTS telemetry_job_runs (
            id BIGSERIAL PRIMARY KEY,
            job_name VARCHAR(160) NOT NULL,
            status VARCHAR(24) NOT NULL CHECK (status IN ('success', 'failed')),
            detail TEXT,
            started_at TIMESTAMPTZ,
            finished_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_telemetry_events_created_type
          ON telemetry_events (created_at DESC, event_type)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_telemetry_events_session_type
          ON telemetry_events (session_id, event_type, created_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_quote_requests_submitted_status
          ON quote_requests (submitted_at DESC, status)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_quote_requests_email_submitted
          ON quote_requests (email, submitted_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_telemetry_api_requests_created
          ON telemetry_api_requests (created_at DESC)
        `;

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_telemetry_job_runs_created
          ON telemetry_job_runs (created_at DESC, status)
        `;
      } catch (error) {
        tableInitPromise = undefined;
        throw error;
      }
    })();
  }

  await tableInitPromise;
}

export async function recordTelemetryEvent({
  eventType,
  sessionId = null,
  path = '/',
  source = 'direct',
  referrer = null,
  ipAddress = null,
  userAgent = null,
  metadata = {},
}) {
  const normalizedEventType = toTrimmedString(eventType, 32);
  if (!TELEMETRY_EVENT_TYPES.has(normalizedEventType)) return;
  const normalizedPath = normalizePath(path);
  if (isTelemetryExcludedPath(normalizedPath)) return;

  await ensureTelemetryTables();

  await portalSql`
    INSERT INTO telemetry_events (
      event_type,
      session_id,
      path,
      source,
      referrer,
      ip_address,
      user_agent,
      metadata_json
    ) VALUES (
      ${normalizedEventType},
      ${toTrimmedString(sessionId, 96) || null},
      ${normalizedPath},
      ${normalizeSource(source)},
      ${toTrimmedString(referrer, 1000) || null},
      ${toTrimmedString(ipAddress, 64) || null},
      ${toTrimmedString(userAgent, 500) || null},
      ${metadata || {}}
    )
  `;
}

export async function recordTelemetryApiRequest({
  routeKey,
  method,
  statusCode,
  latencyMs,
  errorMessage = null,
}) {
  try {
    await ensureTelemetryTables();

    await portalSql`
      INSERT INTO telemetry_api_requests (
        route_key,
        method,
        status_code,
        latency_ms,
        error_message
      ) VALUES (
        ${toTrimmedString(routeKey, 180) || 'unknown'},
        ${toTrimmedString(method, 12).toUpperCase() || 'GET'},
        ${Math.max(0, Number.parseInt(String(statusCode || 0), 10) || 0)},
        ${Math.max(0, Math.round(Number(latencyMs) || 0))},
        ${toTrimmedString(errorMessage, 2000) || null}
      )
    `;
  } catch (error) {
    // Do not fail primary requests if telemetry logging fails.
    console.error('Failed to record telemetry API request', error);
  }
}

function toInt(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function parseDateBoundary(raw, boundary = 'start', tzOffsetMinutes = 0) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return NaN;

  const offset = toInt(tzOffsetMinutes);
  if (Number.isNaN(offset) || offset < -840 || offset > 840) return NaN;

  const [yearRaw, monthRaw, dayRaw] = trimmed.split('-');
  const year = toInt(yearRaw);
  const monthIndex = toInt(monthRaw) - 1;
  const day = toInt(dayRaw);

  if (Number.isNaN(year) || Number.isNaN(monthIndex) || Number.isNaN(day)) return NaN;

  const hour = boundary === 'end' ? 23 : 0;
  const minute = boundary === 'end' ? 59 : 0;
  const second = boundary === 'end' ? 59 : 0;
  const millisecond = boundary === 'end' ? 999 : 0;

  // Convert local wall-clock boundary to UTC using the caller-provided timezone offset.
  const utcMs = Date.UTC(year, monthIndex, day, hour, minute, second, millisecond) + offset * 60 * 1000;
  const parsed = new Date(utcMs);
  if (Number.isNaN(parsed.getTime())) return NaN;
  return parsed.toISOString();
}

export function toIsoDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export async function createQuoteRequest({
  sessionId = null,
  fullName,
  email,
  phone = '',
  address = '',
  customerType = '',
  message,
  originPath = '/',
  source = 'direct',
  urgency = 'normal',
}) {
  await ensureTelemetryTables();

  const result = await portalSql`
    INSERT INTO quote_requests (
      session_id,
      full_name,
      email,
      phone,
      address,
      customer_type,
      message,
      origin_path,
      source,
      urgency
    ) VALUES (
      ${toTrimmedString(sessionId, 96) || null},
      ${toTrimmedString(fullName, 120)},
      ${toTrimmedString(email, 255).toLowerCase()},
      ${toTrimmedString(phone, 80) || null},
      ${toTrimmedString(address, 255) || null},
      ${toTrimmedString(customerType, 160) || null},
      ${toTrimmedString(message, 5000)},
      ${normalizePath(originPath)},
      ${normalizeSource(source)},
      ${inferUrgencyLabel({ message, customerType, requestedUrgency: urgency })}
    )
    RETURNING
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
  `;

  return result.rows[0] || null;
}

export async function updateQuoteRequestStatus({ id, status, declineReason = '' }) {
  await ensureTelemetryTables();

  const normalizedStatus = toTrimmedString(status, 24).toLowerCase();
  const allowedStatuses = new Set(['new', 'in_review', 'declined', 'resolved']);
  if (!allowedStatuses.has(normalizedStatus)) {
    const error = new Error('Invalid quote request status.');
    error.code = 'invalid_quote_status';
    throw error;
  }

  const result = await portalSql`
    UPDATE quote_requests
    SET
      status = ${normalizedStatus},
      decline_reason = ${normalizedStatus === 'declined' ? toTrimmedString(declineReason, 1500) || null : null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING
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
  `;

  if (result.rowCount === 0) {
    const error = new Error('Quote request not found.');
    error.code = 'quote_request_not_found';
    throw error;
  }

  return result.rows[0];
}

export function toPublicQuoteRequestRow(row) {
  return {
    id: Number(row.id),
    sessionId: toTrimmedString(row.session_id, 96) || '',
    fullName: toTrimmedString(row.full_name, 120),
    email: toTrimmedString(row.email, 255),
    phone: toTrimmedString(row.phone, 80),
    address: toTrimmedString(row.address, 255),
    customerType: toTrimmedString(row.customer_type, 160),
    message: String(row.message || '').trim(),
    originPath: normalizePath(row.origin_path),
    source: normalizeSource(row.source),
    urgency: toTrimmedString(row.urgency, 16) || 'normal',
    status: toTrimmedString(row.status, 24) || 'new',
    declineReason: String(row.decline_reason || '').trim(),
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}
