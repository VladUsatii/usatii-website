import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { getCustomerWorkspace, saveCustomerWorkspace } from '@/lib/portal/dashboard-records';
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database';

export const runtime = 'nodejs';

function failure(error) {
  if (isPortalDatabaseConfigError(error)) return NextResponse.json({ error: getPortalDatabaseConfigPublicMessage() }, { status: 503 });
  if (String(error?.code || '').startsWith('invalid_')) return NextResponse.json({ error: error.message }, { status: 400 });
  console.error('Customer workspace request failed', error);
  return NextResponse.json({ error: 'Unable to update the customer workspace.' }, { status: 500 });
}

export async function GET(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;
  try {
    const { id } = await params;
    return NextResponse.json({ workspace: await getCustomerWorkspace(id) });
  } catch (caught) {
    return failure(caught);
  }
}

export async function PUT(request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;
  try {
    const { id } = await params;
    const body = await request.json();
    return NextResponse.json({ workspace: await saveCustomerWorkspace(id, body?.payload) });
  } catch (caught) {
    return failure(caught);
  }
}
