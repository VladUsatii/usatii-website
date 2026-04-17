import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { getPayPalRevenueSnapshot, PayPalApiError, PayPalConfigError } from '@/lib/portal/paypal';

export const runtime = 'nodejs';

function resolvePresetRange(interval) {
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  if (interval === '7d') {
    return {
      label: 'Last 7 days',
      startDate: new Date(todayUtc.getTime() - 6 * 24 * 60 * 60 * 1000),
      endDate: todayUtc,
      interval: '7d',
    };
  }

  if (interval === '90d') {
    return {
      label: 'Last 90 days',
      startDate: new Date(todayUtc.getTime() - 89 * 24 * 60 * 60 * 1000),
      endDate: todayUtc,
      interval: '90d',
    };
  }

  if (interval === 'this_month') {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    return {
      label: 'This month',
      startDate: start,
      endDate: todayUtc,
      interval: 'this_month',
    };
  }

  if (interval === 'last_month') {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999));
    return {
      label: 'Last month',
      startDate: start,
      endDate: end,
      interval: 'last_month',
    };
  }

  return {
    label: 'Last 30 days',
    startDate: new Date(todayUtc.getTime() - 29 * 24 * 60 * 60 * 1000),
    endDate: todayUtc,
    interval: '30d',
  };
}

function parseCustomDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function resolveRange(searchParams) {
  const startRaw = searchParams.get('start');
  const endRaw = searchParams.get('end');

  if (startRaw || endRaw) {
    const startDate = parseCustomDate(startRaw);
    const endDate = parseCustomDate(endRaw);

    if (!startDate || !endDate || startDate > endDate) {
      return null;
    }

    return {
      label: 'Custom range',
      interval: 'custom',
      startDate,
      endDate,
    };
  }

  const interval = String(searchParams.get('interval') || '30d').trim().toLowerCase();
  return resolvePresetRange(interval);
}

export async function GET(request) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const range = resolveRange(searchParams);
  const clientEmail = String(searchParams.get('clientEmail') || '').trim().toLowerCase();

  if (!range) {
    return NextResponse.json(
      { error: 'Invalid date range.' },
      { status: 400 }
    );
  }

  try {
    const snapshot = await getPayPalRevenueSnapshot({
      startDate: range.startDate,
      endDate: range.endDate,
      clientEmail: clientEmail || null,
    });

    return NextResponse.json(
      {
        configured: true,
        range: {
          label: range.label,
          interval: range.interval,
          start: range.startDate.toISOString(),
          end: range.endDate.toISOString(),
        },
        ...snapshot,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof PayPalConfigError) {
      return NextResponse.json(
        {
          configured: false,
          message: err.message,
          code: err.code,
        },
        { status: 200 }
      );
    }

    if (err instanceof PayPalApiError) {
      const upstreamStatus = Number(err.status || 0);
      const status = upstreamStatus >= 400
        ? ([401, 403].includes(upstreamStatus) ? 502 : upstreamStatus)
        : 502;

      return NextResponse.json(
        {
          error: err.message || 'PayPal request failed.',
          code: err.code,
          upstreamStatus: upstreamStatus || null,
          upstreamError: err?.payload?.name || err?.payload?.error || null,
          upstreamDebugId: err?.payload?.debug_id || null,
        },
        { status }
      );
    }

    console.error('Failed to load PayPal revenue data', err);
    return NextResponse.json(
      { error: 'Unable to load PayPal revenue data right now.' },
      { status: 500 }
    );
  }
}
