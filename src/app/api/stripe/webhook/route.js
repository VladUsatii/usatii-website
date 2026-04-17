import { NextResponse } from 'next/server';
import { ensurePortalTables } from '@/lib/portal/schema';
import { VIDEO_REQUEST_STATUSES } from '@/lib/portal/constants';
import { getStripeClient } from '@/lib/portal/stripe';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
  portalSql,
} from '@/lib/portal/database';

export const runtime = 'nodejs';

async function markRequestPaid(checkoutSession) {
  const checkoutSessionId = checkoutSession.id;
  if (!checkoutSessionId) return;

  await portalSql`
    UPDATE video_requests
    SET status = ${VIDEO_REQUEST_STATUSES.PAID},
        stripe_payment_status = ${checkoutSession.payment_status || 'paid'},
        paid_at = NOW(),
        updated_at = NOW()
    WHERE stripe_checkout_session_id = ${checkoutSessionId}
  `;
}

async function markRequestCheckoutExpired(checkoutSession) {
  const checkoutSessionId = checkoutSession.id;
  if (!checkoutSessionId) return;

  await portalSql`
    UPDATE video_requests
    SET status = ${VIDEO_REQUEST_STATUSES.CHECKOUT_EXPIRED},
        stripe_payment_status = ${checkoutSession.payment_status || 'expired'},
        updated_at = NOW()
    WHERE stripe_checkout_session_id = ${checkoutSessionId}
      AND status != ${VIDEO_REQUEST_STATUSES.PAID}
  `;
}

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET.' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  let payload;

  try {
    payload = await request.text();
  } catch {
    return NextResponse.json({ error: 'Unable to read webhook payload.' }, { status: 400 });
  }

  const stripe = getStripeClient();

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid Stripe signature: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    await ensurePortalTables();

    switch (event.type) {
      case 'checkout.session.completed': {
        await markRequestPaid(event.data.object);
        break;
      }
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        await markRequestCheckoutExpired(event.data.object);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    if (isPortalDatabaseConfigError(err)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    console.error('Stripe webhook handler failed', err);
    return NextResponse.json({ error: 'Webhook handling failed.' }, { status: 500 });
  }
}
