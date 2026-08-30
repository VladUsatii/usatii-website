import { NextResponse } from 'next/server';
import { PORTAL_SESSION_COOKIE, getPortalAuthSecret } from '@/lib/portal/constants';
import { verifySignedSessionValue } from '@/lib/portal/session-cookie';

function isSessionFresh(payload) {
  if (!payload?.exp) return false;
  return Number(payload.exp) > Math.floor(Date.now() / 1000);
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/case-studies') {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  if (pathname.startsWith('/case-studies/') && pathname !== '/case-studies/rebuildit-inc') {
    const slug = pathname.slice('/case-studies/'.length);
    return NextResponse.redirect(new URL(`/marketing-case-studies/${slug}${search}`, request.url), 308);
  }

  if (pathname === '/apply' || pathname === '/vlad') {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

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

  if (pathname === '/admin' || pathname === '/dashboard') {
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
  matcher: ['/apply', '/vlad', '/case-studies', '/case-studies/:path*', '/portal/:path*', '/admin', '/admin/login', '/dashboard'],
};
