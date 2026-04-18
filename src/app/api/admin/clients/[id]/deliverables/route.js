import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { getAdminClientById } from '@/lib/portal/admin-data';
import { getAdminDeliverablesBoard } from '@/lib/portal/deliverables';

export const runtime = 'nodejs';

function parseClientUserId(value) {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return NaN;
  return Number(trimmed);
}

export async function GET(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const clientUserId = parseClientUserId(params?.id);

  if (Number.isNaN(clientUserId)) {
    return NextResponse.json({ error: 'Client id must be numeric.' }, { status: 400 });
  }

  try {
    const clientDetail = await getAdminClientById(clientUserId);

    if (!clientDetail?.client) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    const board = await getAdminDeliverablesBoard({
      clientUserId,
      clientEmail: clientDetail.client.email,
    });

    return NextResponse.json(
      {
        clientUserId,
        clientEmail: clientDetail.client.email,
        ...board,
      },
      { status: 200 }
    );
  } catch (routeError) {
    if (isPortalDatabaseConfigError(routeError)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    console.error('Failed to load admin deliverables board', routeError);
    return NextResponse.json(
      { error: 'Unable to load deliverables right now.' },
      { status: 500 }
    );
  }
}
