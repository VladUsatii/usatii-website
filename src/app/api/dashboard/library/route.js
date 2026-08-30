import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { createLibraryFile, createLibraryFolder, deleteLibraryFolder, listLibrary, moveLibraryFile, renameLibraryFile, renameLibraryFolder } from '@/lib/portal/dashboard-records';
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database';

export const runtime = 'nodejs';
const MAX_FILE_BYTES = 10 * 1024 * 1024;
function fail(error) {
  if (isPortalDatabaseConfigError(error)) return NextResponse.json({ error: getPortalDatabaseConfigPublicMessage() }, { status: 503 });
  if (String(error?.code || '').startsWith('invalid_')) return NextResponse.json({ error: error.message }, { status: 400 });
  console.error('Dashboard library request failed', error); return NextResponse.json({ error: 'Unable to update the Library.' }, { status: 500 });
}
export async function GET() { const { error } = await requirePortalSession('admin'); if (error) return error; try { return NextResponse.json(await listLibrary()); } catch (caught) { return fail(caught); } }
export async function POST(request) {
  const { error } = await requirePortalSession('admin'); if (error) return error;
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData(); const file = form.get('file');
      if (!(file instanceof File)) return NextResponse.json({ error: 'A file is required.' }, { status: 400 });
      if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: 'Files must be 10 MB or smaller.' }, { status: 413 });
      const saved = await createLibraryFile({ folderId: form.get('folderId'), name: file.name, mimeType: file.type, bytes: Buffer.from(await file.arrayBuffer()) });
      return NextResponse.json({ file: saved }, { status: 201 });
    }
    const body = await request.json();
    if (body.action === 'createFolder') return NextResponse.json({ folder: await createLibraryFolder(body.name) }, { status: 201 });
    if (body.action === 'renameFolder') return NextResponse.json({ folder: await renameLibraryFolder(body.folderId, body.name) });
    if (body.action === 'deleteFolder') { await deleteLibraryFolder(body.folderId); return NextResponse.json({ success: true }); }
    if (body.action === 'moveFile') return NextResponse.json({ file: await moveLibraryFile(body.fileId, body.folderId) });
    if (body.action === 'renameFile') return NextResponse.json({ file: await renameLibraryFile(body.fileId, body.name) });
    return NextResponse.json({ error: 'Invalid library action.' }, { status: 400 });
  } catch (caught) { return fail(caught); }
}
