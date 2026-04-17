import { NextResponse } from 'next/server';
import { ensurePortalTables } from '@/lib/portal/schema';
import { normalizeEmail, verifyPassword } from '@/lib/portal/passwords';
import {
  attachPortalSessionCookie,
  createPortalSession,
} from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
  portalSql,
} from '@/lib/portal/database';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const mode = body.mode === 'admin' ? 'admin' : 'client';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  try {
    await ensurePortalTables();

    const userResult = await portalSql`
      SELECT id, email, password_hash, role, is_active
      FROM portal_users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return NextResponse.json({ error: 'This account is currently disabled.' }, { status: 403 });
    }

    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (mode === 'admin' && user.role !== 'admin') {
      return NextResponse.json({ error: 'This account does not have admin access.' }, { status: 403 });
    }

    if (mode === 'client' && user.role !== 'client') {
      return NextResponse.json({ error: 'Use the admin login for this account.' }, { status: 403 });
    }

    const session = await createPortalSession({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        role: user.role,
        redirectTo: user.role === 'admin' ? '/admin' : '/portal/dashboard',
      },
      { status: 200 }
    );

    attachPortalSessionCookie(response, session);

    return response;
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    console.error('Portal login failed', error);
    return NextResponse.json({ error: 'Unable to login right now.' }, { status: 500 });
  }
}
