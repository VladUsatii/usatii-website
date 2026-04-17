import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import {
  deleteAdminNote,
  getAdminNote,
  renameAdminNote,
  updateAdminNote,
} from '@/lib/portal/admin-notes';

export const runtime = 'nodejs';

function mapNoteError(error) {
  if (error?.code === 'admin_note_invalid_id') {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error?.code === 'admin_note_invalid_content') {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error?.code === 'admin_note_invalid_title') {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error?.code === 'admin_note_not_found') {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  console.error('Admin note detail failure', error);
  return NextResponse.json({ error: 'Unable to process this note right now.' }, { status: 500 });
}

export async function GET(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  try {
    const note = await getAdminNote(params?.id);
    return NextResponse.json({ note }, { status: 200 });
  } catch (err) {
    return mapNoteError(err);
  }
}

export async function PATCH(request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    let note;

    if (typeof body?.title === 'string' && typeof body?.content === 'string') {
      await updateAdminNote(params?.id, body.content);
      note = await renameAdminNote(params?.id, body.title);
    } else if (typeof body?.title === 'string' && typeof body?.content !== 'string') {
      note = await renameAdminNote(params?.id, body.title);
    } else if (typeof body?.content === 'string') {
      note = await updateAdminNote(params?.id, body?.content);
    } else {
      return NextResponse.json(
        { error: 'Expected either content or title in the request payload.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ note }, { status: 200 });
  } catch (err) {
    return mapNoteError(err);
  }
}

export async function DELETE(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  try {
    await deleteAdminNote(params?.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return mapNoteError(err);
  }
}
