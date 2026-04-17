import { NextResponse } from 'next/server';
import { PORTAL_SESSION_COOKIE, getPortalAuthSecret } from '@/lib/portal/constants';
import { verifySignedSessionValue } from '@/lib/portal/session-cookie';

function isSessionFresh(payload) {
  if (!payload?.exp) return false;
  return Number(payload.exp) > Math.floor(Date.now() / 1000);
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const cookieValue = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  const payload = cookieValue
    ? await verifySignedSessionValue(cookieValue, getPortalAuthSecret())
    : null;

  const hasSession = isSessionFresh(payload);

  if (pathname.startsWith('/portal')) {
    if (pathname === '/portal/login') {
      return NextResponse.next();
    }

    if (!hasSession || payload.role !== 'client') {
      const loginUrl = new URL('/portal/login', request.url);
      loginUrl.searchParams.set('next', `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/admin') {
    if (!hasSession || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/admin', '/admin/login'],
};
