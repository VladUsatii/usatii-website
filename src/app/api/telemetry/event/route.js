import { NextResponse } from 'next/server';
import {
  getClientIp,
  recordTelemetryApiRequest,
  recordTelemetryEvent,
  resolveSourceFromRequest,
} from '@/lib/portal/telemetry';

export const runtime = 'nodejs';

const ALLOWED_EVENT_TYPES = new Set(['page_view', 'contact_intent', 'quote_submit', 'signup']);

function toTrimmed(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

function sanitizePath(value) {
  const raw = toTrimmed(value, 255);
  if (!raw) return '/';
  return raw.startsWith('/') ? raw : `/${raw}`;
}

export async function POST(request) {
  const startedAt = Date.now();
  let statusCode = 201;
  let errorMessage = null;

  try {
    let body;

    try {
      body = await request.json();
    } catch {
      statusCode = 400;
      errorMessage = 'Invalid JSON payload.';
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    const eventType = toTrimmed(body?.eventType, 32);
    if (!ALLOWED_EVENT_TYPES.has(eventType)) {
      statusCode = 400;
      errorMessage = 'Invalid eventType.';
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    const sessionId = toTrimmed(body?.sessionId, 96) || null;
    const path = sanitizePath(body?.path);
    const source =
      toTrimmed(body?.source, 160).toLowerCase() || resolveSourceFromRequest(request, 'direct');
    const referrer = toTrimmed(body?.referrer, 1000) || request.headers.get('referer') || null;
    const userAgent = toTrimmed(request.headers.get('user-agent'), 500);
    const metadata = body?.metadata && typeof body.metadata === 'object' ? body.metadata : {};

    await recordTelemetryEvent({
      eventType,
      sessionId,
      path,
      source,
      referrer,
      ipAddress: getClientIp(request),
      userAgent,
      metadata,
    });

    return NextResponse.json({ success: true }, { status: statusCode });
  } catch (error) {
    console.error('Failed to record telemetry event', error);
    statusCode = 500;
    errorMessage = 'Unable to record telemetry event.';
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  } finally {
    await recordTelemetryApiRequest({
      routeKey: '/api/telemetry/event',
      method: 'POST',
      statusCode,
      latencyMs: Date.now() - startedAt,
      errorMessage,
    });
  }
}

