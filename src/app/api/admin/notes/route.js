import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { createAdminNote, listAdminNotes } from '@/lib/portal/admin-notes';

export const runtime = 'nodejs';

function buildErrorResponse(error) {
  if (error?.code === 'admin_note_invalid_content') {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error?.code === 'admin_note_create_failed') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.error('Admin notes API failure', error);
  return NextResponse.json({ error: 'Unable to process notes right now.' }, { status: 500 });
}

export async function GET() {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  try {
    const notes = await listAdminNotes();
    return NextResponse.json({ notes }, { status: 200 });
  } catch (err) {
    return buildErrorResponse(err);
  }
}

export async function POST(request) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  let body = null;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  try {
    const note = await createAdminNote(typeof body?.content === 'string' ? body.content : undefined);
    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    return buildErrorResponse(err);
  }
}

