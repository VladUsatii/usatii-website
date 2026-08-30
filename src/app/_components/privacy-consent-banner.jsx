'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DEFAULT_PRIVACY_PREFERENCES,
  readPrivacyPreferences,
  savePrivacyPreferences,
} from '@/lib/privacy-preferences';

export default function PrivacyConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readPrivacyPreferences() === null);
  }, []);

  if (!visible) return null;

  function choose(preferences) {
    savePrivacyPreferences(preferences);
    setVisible(false);
  }

  return (
    <aside
      aria-label="Privacy choices"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-4xl rounded-2xl border border-surface-strong bg-white p-5 shadow-2xl md:bottom-6 md:flex md:items-center md:gap-8 md:p-6"
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold text-ink">Your privacy choices</h2>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          We use essential technologies to run this site. With your permission, we also use analytics to understand how the site is used. You can change your choice at any time.
        </p>
        <Link href="/privacy-choices" className="mt-2 inline-flex text-sm font-semibold text-ink underline underline-offset-4">
          Manage preferences
        </Link>
      </div>
      <div className="mt-5 grid shrink-0 grid-cols-2 gap-2 md:mt-0">
        <button
          type="button"
          onClick={() => choose(DEFAULT_PRIVACY_PREFERENCES)}
          className="rounded-full border border-control-border px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Reject optional
        </button>
        <button
          type="button"
          onClick={() => choose({ analytics: true, marketing: true })}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
        >
          Accept all
        </button>
      </div>
    </aside>
  );
}
