import { createCareerChallenge } from '@/lib/careers/human-verification';
import { roles } from '@/lib/careers/roles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const headers = { 'Cache-Control': 'no-store, max-age=0' };
  if (request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ error: 'Use the application form on USATII.' }, { status: 403, headers });
  const roleId = new URL(request.url).searchParams.get('roleId');
  if (!roles.some(role => role.slug === roleId)) return Response.json({ error: 'Role not found.' }, { status: 404, headers });
  try {
    return Response.json(await createCareerChallenge(roleId), { headers });
  } catch {
    return Response.json({ error: 'Verification is temporarily unavailable. Please try again.' }, { status: 503, headers });
  }
}
