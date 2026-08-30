import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  createAdminWorkspaceItem,
  deleteAdminWorkspaceItem,
  listAdminWorkspaceItems,
  updateAdminWorkspaceItem,
} from '@/lib/portal/admin-workspace';
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database';

export const runtime = 'nodejs';

function errorResponse(error) {
  if (isPortalDatabaseConfigError(error)) {
    return NextResponse.json({ error: getPortalDatabaseConfigPublicMessage(), code: 'portal_db_not_configured' }, { status: 503 });
  }
  if (error?.code === 'not_found') return NextResponse.json({ error: error.message }, { status: 404 });
  if (String(error?.code || '').startsWith('invalid_')) return NextResponse.json({ error: error.message }, { status: 400 });
  console.error('Admin workspace request failed', error);
  return NextResponse.json({ error: 'Unable to update workspace tools right now.' }, { status: 500 });
}

export async function GET() {
  const { error } = await requirePortalSession('admin');
  if (error) return error;
  try {
    return NextResponse.json({ items: await listAdminWorkspaceItems() });
  } catch (caughtError) {
    return errorResponse(caughtError);
  }
}

export async function POST(request) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;
  try {
    const body = await request.json();
    return NextResponse.json({ item: await createAdminWorkspaceItem(body) }, { status: 201 });
  } catch (caughtError) {
    return errorResponse(caughtError);
  }
}

export async function PATCH(request) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;
  try {
    const body = await request.json();
    return NextResponse.json({ item: await updateAdminWorkspaceItem(body.id, body) });
  } catch (caughtError) {
    return errorResponse(caughtError);
  }
}

export async function DELETE(request) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;
  try {
    const body = await request.json();
    await deleteAdminWorkspaceItem(body.id);
    return NextResponse.json({ success: true });
  } catch (caughtError) {
    return errorResponse(caughtError);
  }
}
