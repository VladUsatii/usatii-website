import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
} from '@/lib/portal/database';
import { listClientAssignedEducation } from '@/lib/portal/education';

export const runtime = 'nodejs';

export async function GET() {
  const { session, error } = await requirePortalSession('client');
  if (error) return error;

  try {
    const payload = await listClientAssignedEducation({
      clientUserId: session.userId,
    });

    return NextResponse.json(payload, { status: 200 });
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

    console.error('Failed to load client education assignments', routeError);
    return NextResponse.json(
      { error: 'Unable to load education assignments right now.' },
      { status: 500 }
    );
  }
}
