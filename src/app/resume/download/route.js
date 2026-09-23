import document from '@/lib/private-resume/document.json';
import { decryptResume } from '@/lib/private-resume/decrypt.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
};

export function GET() {
  return new Response('A password is required. Visit /resume.', { status: 401, headers });
}

export async function POST(request) {
  if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) {
    return new Response('Unsupported request.', { status: 415, headers });
  }
  const reader = request.body?.getReader();
  if (!reader) return new Response('Password required.', { status: 401, headers });
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 1024) {
      await reader.cancel();
      return new Response('Request too large.', { status: 413, headers });
    }
    chunks.push(Buffer.from(value));
  }
  const password = new URLSearchParams(Buffer.concat(chunks).toString()).get('password');
  try {
    const pdf = await decryptResume(password, document);
    return new Response(pdf, {
      headers: {
        ...headers,
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdf.length),
        'Content-Disposition': 'attachment; filename="Vladislav_Usatii_Resume.pdf"',
      },
    });
  } catch {
    return new Response(null, { status: 303, headers: { ...headers, Location: '/resume?error=1' } });
  }
}
