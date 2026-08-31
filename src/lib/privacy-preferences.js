export const PRIVACY_STORAGE_KEY = 'usatii_privacy_preferences';
export const PRIVACY_COOKIE_NAME = 'usatii_privacy_choices';
export const PRIVACY_EVENT_NAME = 'usatii:privacy-preferences-changed';
const TELEMETRY_SESSION_KEY = 'usatii_telemetry_session_id';
const TELEMETRY_SEEN_KEY = 'usatii_telemetry_seen_events';

export const DEFAULT_PRIVACY_PREFERENCES = Object.freeze({
  analytics: false,
  marketing: false,
});

export function hasGlobalPrivacyControl() {
  return typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true;
}

export function readPrivacyPreferences() {
  if (typeof window === 'undefined') return null;

  try {
    const value = JSON.parse(window.localStorage.getItem(PRIVACY_STORAGE_KEY));
    if (!value || typeof value !== 'object') return null;

    return {
      analytics: value.analytics === true,
      marketing: hasGlobalPrivacyControl() ? false : value.marketing === true,
      updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
      globalPrivacyControl: hasGlobalPrivacyControl(),
    };
  } catch {
    return null;
  }
}

export function savePrivacyPreferences(preferences) {
  if (typeof window === 'undefined') return null;

  const value = {
    analytics: preferences.analytics === true,
    marketing: false,
    globalPrivacyControl: hasGlobalPrivacyControl(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  window.localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(value));
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${PRIVACY_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;

  if (!value.analytics) {
    window.sessionStorage.removeItem(TELEMETRY_SESSION_KEY);
    window.sessionStorage.removeItem(TELEMETRY_SEEN_KEY);
  }

  window.dispatchEvent(new CustomEvent(PRIVACY_EVENT_NAME, { detail: value }));
  return value;
}
