import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import {
  listAdminQuoteRequests,
  quoteRequestsToCsv,
  resolveTelemetryDateRange,
} from '@/lib/portal/telemetry-admin-data';
import { recordTelemetryApiRequest } from '@/lib/portal/telemetry';

export const runtime = 'nodejs';

function parseBoolean(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function parseTimezoneOffset(value) {
  const raw = String(value || '').trim();
  if (!raw) return 0;
  if (!/^-?\d+$/.test(raw)) return NaN;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < -840 || parsed > 840) return NaN;
  return parsed;
}

export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const tzOffsetMinutes = parseTimezoneOffset(searchParams.get('tzOffsetMinutes'));
    if (Number.isNaN(tzOffsetMinutes)) {
      statusCode = 400;
      errorMessage = 'tzOffsetMinutes must be a valid minute offset.';
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    const dateRange = resolveTelemetryDateRange({
      from: searchParams.get('from'),
      to: searchParams.get('to'),
      tzOffsetMinutes,
    });
    const includeDeclined = parseBoolean(searchParams.get('includeDeclined'));

    const { rows } = await listAdminQuoteRequests({
      ...dateRange,
      includeDeclined,
      limit: 10000,
      search: String(searchParams.get('q') || ''),
    });

    const csv = quoteRequestsToCsv(rows);
    const filename = `quote-requests-${dateRange.fromIso.slice(0, 10)}-to-${dateRange.toIso.slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: statusCode,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error?.code === 'invalid_date_range') {
      statusCode = 400;
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

    console.error('Failed to export quote requests CSV', error);
    statusCode = 500;
    errorMessage = 'Unable to export quote requests right now.';
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  } finally {
    await recordTelemetryApiRequest({
      routeKey: '/api/admin/telemetry/quotes/export',
      method: 'GET',
      statusCode,
      latencyMs: Date.now() - startedAt,
      errorMessage,
    });
  }
}
