import { requirePortalSession } from '@/lib/portal/auth';
import { portalSql } from '@/lib/portal/database';
import { ensureCareerApplicationsTable } from '@/lib/careers/applications';

export const runtime = 'nodejs';
export async function GET(request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;
  const { id } = await params;
  const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
  if (!/^\d{1,18}$/.test(id)) return Response.json({ error: 'Application not found.' }, { status: 404, headers });
  try {
    await ensureCareerApplicationsTable();
    const result = await portalSql`SELECT resume_name, resume_type, resume_data FROM career_applications WHERE id = ${id} AND resume_data IS NOT NULL`;
    const row = result.rows[0];
    if (!row) return Response.json({ error: 'Résumé not found.' }, { status: 404, headers });
    const data = Buffer.isBuffer(row.resume_data) ? row.resume_data : Buffer.from(String(row.resume_data).replace(/^\\x/, ''), 'hex');
    return new Response(new Uint8Array(data), { headers: {
      ...headers,
      'Content-Type': row.resume_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="resume"; filename*=UTF-8''${encodeURIComponent(row.resume_name || 'resume').replace(/['()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)}`,
    } });
  } catch {
    return Response.json({ error: 'Unable to download the résumé right now.' }, { status: 503, headers });
  }
}
