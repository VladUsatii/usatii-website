export const PORTAL_SESSION_COOKIE = 'usatii_portal_session';
export const PORTAL_SESSION_TTL_DAYS = Number(process.env.PORTAL_SESSION_TTL_DAYS || 14);
export const PORTAL_BOOKING_URL = 'https://cal.com/usatii/onboarding';

export const VIDEO_REQUEST_TYPES = {
  LONG_FORM: 'long_form',
  SHORT_FORM: 'short_form',
};

export const VIDEO_REQUEST_STATUSES = {
  PENDING_CHECKOUT: 'pending_checkout',
  PAID: 'paid',
  CHECKOUT_EXPIRED: 'checkout_expired',
};

export const MAX_DRIVE_TREE_DEPTH = 6;
export const MAX_DRIVE_TREE_NODES = 1500;

export function getPortalAuthSecret() {
  const secret = process.env.PORTAL_AUTH_SECRET;

  if (secret && secret.length >= 16) return secret;

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-only-insecure-portal-auth-secret-change-me';
  }

  throw new Error('Missing PORTAL_AUTH_SECRET. Set a secure secret in your environment.');
}

export function getBaseUrlFromRequest(request) {
  const envBase = process.env.BASE_URL?.trim();
  if (envBase) return envBase.replace(/\/+$/, '');

  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/+$/, '');

  return new URL(request.url).origin.replace(/\/+$/, '');
}
