import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { ensurePortalTables } from '@/lib/portal/schema';
import {
  getBaseUrlFromRequest,
  VIDEO_REQUEST_STATUSES,
  VIDEO_REQUEST_TYPES,
} from '@/lib/portal/constants';
import { getStripeClient } from '@/lib/portal/stripe';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
  portalSql,
} from '@/lib/portal/database';

export const runtime = 'nodejs';

function trimValue(value, maxLength = 5000) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeRequestType(value) {
  if (value === VIDEO_REQUEST_TYPES.LONG_FORM) return VIDEO_REQUEST_TYPES.LONG_FORM;
  if (value === VIDEO_REQUEST_TYPES.SHORT_FORM) return VIDEO_REQUEST_TYPES.SHORT_FORM;
  return null;
}

function getPriceIdForType(requestType) {
  if (requestType === VIDEO_REQUEST_TYPES.LONG_FORM) {
    return process.env.STRIPE_PRICE_ID_LONG_FORM || '';
  }

  if (requestType === VIDEO_REQUEST_TYPES.SHORT_FORM) {
    return process.env.STRIPE_PRICE_ID_SHORT_FORM || '';
  }

  return '';
}

export async function POST(request) {
  const { session, error } = await requirePortalSession('client');
  if (error) return error;

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const requestType = normalizeRequestType(body.requestType);

  if (!requestType) {
    return NextResponse.json(
      { error: 'requestType must be either long_form or short_form.' },
      { status: 400 }
    );
  }

  const priceId = getPriceIdForType(requestType);
  if (!priceId) {
    return NextResponse.json(
      { error: 'Stripe price ID is missing for this request type.' },
      { status: 500 }
    );
  }

  const brief = {
    projectName: trimValue(body.projectName, 160),
    goal: trimValue(body.goal, 1000),
    deliverables: trimValue(body.deliverables, 1500),
    deadline: trimValue(body.deadline, 80),
    referenceLinks: trimValue(body.referenceLinks, 4000),
    assetLinks: trimValue(body.assetLinks, 4000),
    notes: trimValue(body.notes, 5000),
  };

  if (!brief.projectName || !brief.goal) {
    return NextResponse.json(
      { error: 'Project name and goal are required.' },
      { status: 400 }
    );
  }

  try {
    await ensurePortalTables();

    const inserted = await portalSql`
      INSERT INTO video_requests (
        client_user_id,
        request_type,
        brief_json,
        status
      ) VALUES (
        ${session.userId},
        ${requestType},
        ${JSON.stringify(brief)}::jsonb,
        ${VIDEO_REQUEST_STATUSES.PENDING_CHECKOUT}
      )
      RETURNING id
    `;

    const videoRequestId = inserted.rows[0].id;

    const stripe = getStripeClient();
    const baseUrl = getBaseUrlFromRequest(request);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/portal/request/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/portal/dashboard?checkout=cancelled`,
      customer_email: session.email,
      metadata: {
        video_request_id: String(videoRequestId),
        client_user_id: String(session.userId),
        request_type: requestType,
      },
    });

    await portalSql`
      UPDATE video_requests
      SET stripe_checkout_session_id = ${checkoutSession.id},
          updated_at = NOW()
      WHERE id = ${videoRequestId}
    `;

    return NextResponse.json(
      {
        success: true,
        checkoutUrl: checkoutSession.url,
        videoRequestId: Number(videoRequestId),
      },
      { status: 200 }
    );
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

    console.error('Failed to create Stripe checkout session', err);
    return NextResponse.json(
      { error: 'Unable to start checkout right now. Please try again.' },
      { status: 500 }
    );
  }
}
