import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import {
  recordTelemetryApiRequest,
  toPublicQuoteRequestRow,
  updateQuoteRequestStatus,
} from '@/lib/portal/telemetry';

export const runtime = 'nodejs';

function parseQuoteRequestId(value) {
  const raw = String(value || '').trim();
  if (!/^\d+$/.test(raw)) return NaN;
  return Number(raw);
}

export async function PATCH(request, context) {
  const startedAt = Date.now();
  let statusCode = 200;
  let errorMessage = null;

  try {
    const { error } = await requirePortalSession('admin');
    if (error) {
      statusCode = error.status || 401;
      errorMessage = 'Unauthorized.';
      return error;
    }

    const resolvedParams = await context.params;
    const quoteRequestId = parseQuoteRequestId(resolvedParams?.id);

    if (Number.isNaN(quoteRequestId)) {
      statusCode = 400;
      errorMessage = 'Quote request id must be numeric.';
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      statusCode = 400;
      errorMessage = 'Invalid JSON payload.';
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    const updated = await updateQuoteRequestStatus({
      id: quoteRequestId,
      status: body?.status,
      declineReason: body?.declineReason,
    });

    return NextResponse.json(
      {
        success: true,
        quoteRequest: toPublicQuoteRequestRow(updated),
      },
      { status: statusCode }
    );
  } catch (error) {
    if (error?.code === 'invalid_quote_status') {
      statusCode = 400;
      errorMessage = error.message;
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    if (error?.code === 'quote_request_not_found') {
      statusCode = 404;
      errorMessage = error.message;
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    if (isPortalDatabaseConfigError(error)) {
      statusCode = 503;
      errorMessage = getPortalDatabaseConfigPublicMessage();
      return NextResponse.json(
        {
          error: errorMessage,
          code: 'portal_db_not_configured',
        },
        { status: statusCode }
      );
    }

    console.error('Failed to update quote request status', error);
    statusCode = 500;
    errorMessage = 'Unable to update quote request right now.';
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  } finally {
    await recordTelemetryApiRequest({
      routeKey: '/api/admin/telemetry/quotes/[id]',
      method: 'PATCH',
      statusCode,
      latencyMs: Date.now() - startedAt,
      errorMessage,
    });
  }
}

