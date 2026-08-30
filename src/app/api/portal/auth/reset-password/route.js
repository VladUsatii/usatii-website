import { NextResponse } from 'next/server';
import { resetPasswordWithToken } from '@/lib/portal/password-reset';
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const result = await resetPasswordWithToken(body.token, body.password);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

    return NextResponse.json({
      success: true,
      redirectTo: result.role === 'admin' ? '/admin/login' : '/portal/login',
    });
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return NextResponse.json({ error: getPortalDatabaseConfigPublicMessage(), code: 'portal_db_not_configured' }, { status: 503 });
    }

    console.error('Password reset failed', error);
    return NextResponse.json({ error: 'Unable to reset the password right now.' }, { status: 500 });
  }
}
