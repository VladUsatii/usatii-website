import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getClientDeliverablesProgress,
} from '@/lib/portal/deliverables';
import {
  PayPalApiError,
  PayPalConfigError,
} from '@/lib/portal/paypal';

export const runtime = 'nodejs';

export async function GET() {
  const { session, error } = await requirePortalSession('client');
  if (error) return error;

  try {
    const progress = await getClientDeliverablesProgress({
      clientUserId: session.userId,
      clientEmail: session.email,
    });

    return NextResponse.json(
      {
        configured: true,
        ...progress,
      },
      { status: 200 }
    );
  } catch (routeError) {
    if (routeError instanceof PayPalConfigError) {
      return NextResponse.json(
        {
          configured: false,
          message: routeError.message,
          summary: {
            invoiceCount: 0,
            packCount: 0,
            totalItems: 0,
            completedItems: 0,
          },
          invoices: [],
        },
        { status: 200 }
      );
    }

    if (routeError instanceof PayPalApiError) {
      const upstreamStatus = Number(routeError.status || 0);
      const status = upstreamStatus >= 400
        ? ([401, 403].includes(upstreamStatus) ? 502 : upstreamStatus)
        : 502;

      return NextResponse.json(
        {
          error: routeError.message || 'PayPal request failed.',
          code: routeError.code,
          upstreamStatus: upstreamStatus || null,
          upstreamError: routeError?.payload?.name || routeError?.payload?.error || null,
          upstreamDebugId: routeError?.payload?.debug_id || null,
        },
        { status }
      );
    }

    console.error('Failed to load client progress', routeError);
    return NextResponse.json(
      { error: 'Unable to load progress right now.' },
      { status: 500 }
    );
  }
}
