import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { setGuideClientAssignments } from '@/lib/portal/education';

export const runtime = 'nodejs';

function parseGuideId(value) {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return NaN;
  return Number(trimmed);
}

export async function PUT(request, { params }) {
  const { session, error } = await requirePortalSession('admin');
  if (error) return error;

  const guideId = parseGuideId(params?.guideId);
  if (Number.isNaN(guideId)) {
    return NextResponse.json({ error: 'Guide id must be numeric.' }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    const updated = await setGuideClientAssignments({
      guideId,
      clientUserIds: body?.clientUserIds,
      assignedByUserId: session.userId,
    });

    return NextResponse.json(
      {
        success: true,
        ...updated,
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

    if (
      routeError?.code === 'invalid_guide_id' ||
      routeError?.code === 'invalid_client_ids'
    ) {
      return NextResponse.json({ error: routeError.message }, { status: 400 });
    }

    if (routeError?.code === 'guide_not_found') {
      return NextResponse.json({ error: routeError.message }, { status: 404 });
    }

    console.error('Failed to update education assignments', routeError);
    return NextResponse.json(
      { error: 'Unable to update guide assignments right now.' },
      { status: 500 }
    );
  }
}
