import { NextResponse } from 'next/server';
import {
  createQuoteRequest,
  getClientIp,
  inferUrgencyLabel,
  recordTelemetryApiRequest,
  recordTelemetryEvent,
  resolveSourceFromRequest,
} from '@/lib/portal/telemetry';

export const runtime = 'nodejs';

function toTrimmed(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizePath(value) {
  const raw = toTrimmed(value, 255);
  if (!raw) return '/';
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function isLikelySignup(customerType) {
  const normalized = String(customerType || '').toLowerCase();
  if (!normalized) return false;
  if (normalized.includes('potential new customer')) return true;
  return normalized === 'yes' || normalized.startsWith('yes,');
}

function toApiRequest(row) {
  return {
    id: Number(row.id),
    fullName: String(row.full_name || '').trim(),
    email: String(row.email || '').trim(),
    phone: String(row.phone || '').trim(),
    address: String(row.address || '').trim(),
    customerType: String(row.customer_type || '').trim(),
    message: String(row.message || '').trim(),
    originPath: String(row.origin_path || '/').trim() || '/',
    source: String(row.source || 'direct').trim() || 'direct',
    urgency: String(row.urgency || 'normal').trim() || 'normal',
    status: String(row.status || 'new').trim() || 'new',
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : null,
  };
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

    const fullName = toTrimmed(body?.fullName, 120);
    const email = toTrimmed(body?.email, 255).toLowerCase();
    const phone = toTrimmed(body?.phone, 80);
    const address = toTrimmed(body?.address, 255);
    const customerType = toTrimmed(body?.customerType, 160);
    const message = toTrimmed(body?.message, 5000);
    const sessionId = toTrimmed(body?.sessionId, 96) || null;
    const sourceInput = toTrimmed(body?.source, 160).toLowerCase();
    const source = sourceInput || resolveSourceFromRequest(request, 'direct');
    const originPath = normalizePath(body?.originPath || body?.path);
    const requestedUrgency = toTrimmed(body?.urgency, 32);

    if (!fullName || !email || !message) {
      statusCode = 400;
      errorMessage = 'Full name, email, and message are required.';
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      statusCode = 400;
      errorMessage = 'Please enter a valid email address.';
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    const quoteRequest = await createQuoteRequest({
      sessionId,
      fullName,
      email,
      phone,
      address,
      customerType,
      message,
      originPath,
      source,
      urgency: requestedUrgency,
    });

    const telemetryBase = {
      sessionId,
      path: originPath,
      source,
      referrer: request.headers.get('referer'),
      ipAddress: getClientIp(request),
      userAgent: request.headers.get('user-agent'),
      metadata: {
        quoteRequestId: quoteRequest?.id ? Number(quoteRequest.id) : null,
        urgency: inferUrgencyLabel({ message, customerType, requestedUrgency }),
        customerType,
      },
    };

    await recordTelemetryEvent({
      eventType: 'quote_submit',
      ...telemetryBase,
    });

    if (isLikelySignup(customerType)) {
      await recordTelemetryEvent({
        eventType: 'signup',
        ...telemetryBase,
      });
    }

    return NextResponse.json(
      {
        success: true,
        quoteRequest: toApiRequest(quoteRequest || {}),
      },
      { status: statusCode }
    );
  } catch (error) {
    console.error('Failed to store quote request', error);
    statusCode = 500;
    errorMessage = 'Unable to submit quote request right now.';
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  } finally {
    await recordTelemetryApiRequest({
      routeKey: '/api/quote-requests',
      method: 'POST',
      statusCode,
      latencyMs: Date.now() - startedAt,
      errorMessage,
    });
  }
}

