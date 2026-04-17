import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  clearPortalSessionCookie,
  revokeSessionByCookieValue,
} from '@/lib/portal/auth';
import { PORTAL_SESSION_COOKIE } from '@/lib/portal/constants';
import { isPortalDatabaseConfigError } from '@/lib/portal/database';

export const runtime = 'nodejs';

export async function POST() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

  if (cookieValue) {
    try {
      await revokeSessionByCookieValue(cookieValue);
    } catch (error) {
      if (!isPortalDatabaseConfigError(error)) {
        console.error('Failed to revoke portal session during logout', error);
      }
    }
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  clearPortalSessionCookie(response);

  return response;
}
