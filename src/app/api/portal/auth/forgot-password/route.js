import { NextResponse } from 'next/server';
import { getBaseUrlFromRequest } from '@/lib/portal/constants';
import { createPasswordResetToken } from '@/lib/portal/password-reset';
import { sendPasswordResetEmail } from '@/lib/portal/resend';
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database';

export const runtime = 'nodejs';

const PUBLIC_MESSAGE = 'If an active account exists for that email, a password reset link has been sent.';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const reset = await createPasswordResetToken(body.email);
    if (reset) {
      const resetUrl = `${getBaseUrlFromRequest(request)}/reset-password?token=${encodeURIComponent(reset.token)}`;
      await sendPasswordResetEmail({ email: reset.email, resetUrl });
    }

    return NextResponse.json({ success: true, message: PUBLIC_MESSAGE });
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return NextResponse.json({ error: getPortalDatabaseConfigPublicMessage(), code: 'portal_db_not_configured' }, { status: 503 });
    }

    console.error('Password reset request failed', error);
    if (error?.code === 'resend_not_configured' || error?.code === 'resend_delivery_failed') {
      return NextResponse.json({ success: true, message: PUBLIC_MESSAGE });
    }

    return NextResponse.json({ error: 'Unable to process the password reset request right now.' }, { status: 500 });
  }
}
