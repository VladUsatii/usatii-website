import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { getAdminClientById } from '@/lib/portal/admin-data';

export const runtime = 'nodejs';

export async function GET(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const idValue = String(params?.id || '').trim();
  if (!/^\d+$/.test(idValue)) {
    return NextResponse.json({ error: 'Client id must be numeric.' }, { status: 400 });
  }

  const clientUserId = Number(idValue);

  try {
    const result = await getAdminClientById(clientUserId);

    if (!result) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
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

    console.error('Failed to load admin client detail', error);
    return NextResponse.json({ error: 'Unable to load client detail right now.' }, { status: 500 });
  }
}
