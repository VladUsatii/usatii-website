'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const SESSION_KEY = 'usatii_telemetry_session_id';
const SEEN_KEY = 'usatii_telemetry_seen_events';

function ensureSessionId() {
  if (typeof window === 'undefined') return null;

  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const nextId =
    typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `session_${Date.now()}_${Math.round(Math.random() * 1e8)}`;

  window.sessionStorage.setItem(SESSION_KEY, nextId);
  return nextId;
}

function getSeenSet() {
  if (typeof window === 'undefined') return new Set();
  const raw = window.sessionStorage.getItem(SEEN_KEY);
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map((value) => String(value)));
  } catch {
    return new Set();
  }
}

function persistSeenSet(set) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(set)));
}

function pathFromCurrentLocation(pathname, searchParams) {
  const query = searchParams?.toString() ? `?${searchParams.toString()}` : '';
  return `${pathname || '/'}${query}`;
}

function deriveSource(searchParams) {
  const utmSource = String(searchParams?.get('utm_source') || '').trim().toLowerCase();
  if (utmSource) return utmSource;

  if (typeof document === 'undefined') return 'direct';
  const referrer = document.referrer || '';
  if (!referrer) return 'direct';

  try {
    const currentHost = window.location.hostname;
    const refUrl = new URL(referrer);
    if (refUrl.hostname === currentHost || refUrl.hostname.endsWith(`.${currentHost}`)) {
      return 'direct';
    }
    return refUrl.hostname.toLowerCase();
  } catch {
    return 'direct';
  }
}

function shouldTrack(pathname) {
  const path = String(pathname || '/');
  if (path.startsWith('/api/')) return false;
  if (path.startsWith('/admin')) return false;
  if (path.startsWith('/portal')) return false;
  if (path.startsWith('/_next')) return false;
  return true;
}

async function sendEvent(payload) {
  try {
    await fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Telemetry is best-effort.
  }
}

export default function TelemetryTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedSearch = useMemo(() => searchParams?.toString() || '', [searchParams]);

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const sessionId = ensureSessionId();
    if (!sessionId) return;

    const path = pathFromCurrentLocation(pathname, searchParams);
    const source = deriveSource(searchParams);
    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    const seenSet = getSeenSet();
    const pageViewKey = `page_view:${path}`;
    const contactIntentKey = `contact_intent:${path}`;

    if (!seenSet.has(pageViewKey)) {
      seenSet.add(pageViewKey);
      void sendEvent({
        eventType: 'page_view',
        sessionId,
        path,
        source,
        referrer,
      });
    }

    const isContactIntentPath = pathname === '/quote-request' || pathname === '/website-request';
    if (isContactIntentPath && !seenSet.has(contactIntentKey)) {
      seenSet.add(contactIntentKey);
      void sendEvent({
        eventType: 'contact_intent',
        sessionId,
        path,
        source,
        referrer,
      });
    }

    persistSeenSet(seenSet);
  }, [pathname, searchParams, serializedSearch]);

  return null;
}

