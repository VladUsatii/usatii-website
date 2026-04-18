import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { updateDeliverableItemStep } from '@/lib/portal/deliverables';

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
  const itemId = parseNumericId(params?.itemId);

  if (Number.isNaN(clientUserId) || Number.isNaN(itemId)) {
    return NextResponse.json({ error: 'Client id and item id must be numeric.' }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const updated = await updateDeliverableItemStep({
      clientUserId,
      itemId,
      stepStatus: body?.stepStatus,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Deliverable item not found.' }, { status: 404 });
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

    if (routeError?.code === 'invalid_step_status') {
      return NextResponse.json({ error: routeError.message }, { status: 400 });
    }

    console.error('Failed to update deliverable item', routeError);
    return NextResponse.json(
      { error: 'Unable to update deliverable item right now.' },
      { status: 500 }
    );
  }
}
