import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import {
  deleteDeliverablePack,
  updateDeliverablePack,
} from '@/lib/portal/deliverables';

export const runtime = 'nodejs';

function parseNumericId(value) {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return NaN;
  return Number(trimmed);
}

export async function PATCH(request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const clientUserId = parseNumericId(params?.id);
  const packId = parseNumericId(params?.packId);

  if (Number.isNaN(clientUserId) || Number.isNaN(packId)) {
    return NextResponse.json({ error: 'Client id and pack id must be numeric.' }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const updated = await updateDeliverablePack({
      clientUserId,
      packId,
      packType: body?.packType,
      quantity: body?.quantity,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Deliverable pack not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
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

    if (
      routeError?.code === 'invalid_pack_type' ||
      routeError?.code === 'invalid_quantity'
    ) {
      return NextResponse.json({ error: routeError.message }, { status: 400 });
    }

    if (routeError?.code === 'quantity_reduce_blocked') {
      return NextResponse.json({ error: routeError.message }, { status: 409 });
    }

    if (routeError?.code === '23505') {
      return NextResponse.json(
        { error: 'Another deliverable pack already exists with this invoice line + type combination.' },
        { status: 409 }
      );
    }

    console.error('Failed to update deliverable pack', routeError);
    return NextResponse.json(
      { error: 'Unable to update deliverable pack right now.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const clientUserId = parseNumericId(params?.id);
  const packId = parseNumericId(params?.packId);

  if (Number.isNaN(clientUserId) || Number.isNaN(packId)) {
    return NextResponse.json({ error: 'Client id and pack id must be numeric.' }, { status: 400 });
  }

  try {
    const deleted = await deleteDeliverablePack({ clientUserId, packId });

    if (!deleted) {
      return NextResponse.json({ error: 'Deliverable pack not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
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

    console.error('Failed to delete deliverable pack', routeError);
    return NextResponse.json(
      { error: 'Unable to delete deliverable pack right now.' },
      { status: 500 }
    );
  }
}
