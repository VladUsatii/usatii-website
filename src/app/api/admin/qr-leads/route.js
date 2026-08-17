import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { listQrLeads } from '@/lib/portal/qr-leads';
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { error } = await requirePortalSession('admin');
    if (error) return error;
    return NextResponse.json({ leads: await listQrLeads() });
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return NextResponse.json({ error: getPortalDatabaseConfigPublicMessage() }, { status: 503 });
    }
    console.error('Failed to load QR leads', error);
    return NextResponse.json({ error: 'Unable to load QR leads right now.' }, { status: 500 });
  }
}

