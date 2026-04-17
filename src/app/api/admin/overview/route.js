import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { getAdminOverview } from '@/lib/portal/admin-data';

export const runtime = 'nodejs';

function parseClientUserId(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed || trimmed === 'all') return null;
  if (!/^\d+$/.test(trimmed)) return NaN;
  return Number(trimmed);
}

export async function GET(request) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const parsedClientUserId = parseClientUserId(searchParams.get('clientId'));

  if (Number.isNaN(parsedClientUserId)) {
    return NextResponse.json({ error: 'clientId must be numeric or "all".' }, { status: 400 });
  }

  try {
    const overview = await getAdminOverview({
      clientUserId: parsedClientUserId,
    });

    return NextResponse.json(overview, { status: 200 });
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

    console.error('Failed to load admin overview', error);
    return NextResponse.json({ error: 'Unable to load overview right now.' }, { status: 500 });
  }
}
