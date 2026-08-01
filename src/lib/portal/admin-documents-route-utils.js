import { NextResponse } from 'next/server';

export const PRIVATE_NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store',
  Pragma: 'no-cache',
  Expires: '0',
  Vary: 'Cookie',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

export function privateJson(payload, init = {}) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      ...PRIVATE_NO_STORE_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function privateBinaryResponse(body, init = {}) {
  const responseBody =
    body instanceof Uint8Array
      ? body
      : body instanceof ArrayBuffer
        ? new Uint8Array(body)
        : typeof Buffer !== 'undefined' && Buffer.isBuffer(body)
          ? new Uint8Array(body.buffer, body.byteOffset, body.byteLength)
          : body;

  return new NextResponse(responseBody, {
    status: init.status || 200,
    headers: {
      ...PRIVATE_NO_STORE_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function parseRouteNumericId(value) {
  const trimmed = String(value || '').trim();
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

function originFromUrl(value) {
  try {
    return new URL(value).origin;
  } catch {
    return '';
  }
}

export function isTrustedSameOriginRequest(request) {
  const expectedOrigin = originFromUrl(request.url);
  if (!expectedOrigin) return false;

  const originHeader = originFromUrl(request.headers.get('origin'));
  if (originHeader) return originHeader === expectedOrigin;

  const refererHeader = originFromUrl(request.headers.get('referer'));
  if (refererHeader) return refererHeader === expectedOrigin;

  const fetchSite = String(request.headers.get('sec-fetch-site') || '').trim().toLowerCase();
  if (fetchSite) return fetchSite === 'same-origin';

  return false;
}
