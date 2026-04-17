import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPayPalClientInvoicesSnapshot,
  PayPalApiError,
  PayPalConfigError,
} from '@/lib/portal/paypal';

export const runtime = 'nodejs';

export async function GET() {
  const { session, error } = await requirePortalSession('client');
  if (error) return error;

  try {
    const snapshot = await getPayPalClientInvoicesSnapshot({
      clientEmail: session.email,
    });

    return NextResponse.json(
      {
        configured: true,
        clientEmail: session.email,
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
          summary: {
            totalCount: 0,
            activeCount: 0,
            semiPaidCount: 0,
            fullyPaidCount: 0,
            otherCount: 0,
            totalCents: 0,
            currency: 'USD',
          },
          invoices: [],
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

    console.error('Failed to load client invoices', err);
    return NextResponse.json(
      { error: 'Unable to load invoices right now.' },
      { status: 500 }
    );
  }
}
