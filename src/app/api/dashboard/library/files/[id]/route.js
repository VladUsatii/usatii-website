import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { deleteLibraryFile, getLibraryFile } from '@/lib/portal/dashboard-records';

export const runtime = 'nodejs';
export async function GET(request, { params }) {
  const { error } = await requirePortalSession('admin'); if (error) return error;
  const { id } = await params; const file = await getLibraryFile(id);
  if (!file) return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  const download = new URL(request.url).searchParams.get('download') === '1';
  return new Response(file.file_data, { headers: { 'Content-Type': file.mime_type, 'Content-Length': String(file.size_bytes), 'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${String(file.name).replaceAll('"', '')}"`, 'Cache-Control': 'private, no-store' } });
}
export async function DELETE(request, { params }) { const { error } = await requirePortalSession('admin'); if (error) return error; const { id } = await params; await deleteLibraryFile(id); return NextResponse.json({ success: true }); }
