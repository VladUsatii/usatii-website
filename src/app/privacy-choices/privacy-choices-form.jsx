'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_PRIVACY_PREFERENCES,
  hasGlobalPrivacyControl,
  readPrivacyPreferences,
  savePrivacyPreferences,
} from '@/lib/privacy-preferences';

function PreferenceRow({ title, description, checked, disabled, onChange, label }) {
  return (
    <div className="flex gap-6 border-t border-surface py-7 first:border-t-0">
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">{description}</p>
      </div>
      <label className="relative mt-1 inline-flex h-7 w-12 shrink-0 items-center">
        <input className="peer sr-only" type="checkbox" checked={checked} disabled={disabled} onChange={onChange} aria-label={label} />
        <span className="absolute inset-0 rounded-full bg-surface-strong transition peer-checked:bg-violet-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-60" />
        <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </label>
    </div>
  );
}

export default function PrivacyChoicesForm() {
  const [preferences, setPreferences] = useState(DEFAULT_PRIVACY_PREFERENCES);
  const [gpc, setGpc] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const controlEnabled = hasGlobalPrivacyControl();
    setGpc(controlEnabled);
    const stored = readPrivacyPreferences();
    if (stored) setPreferences(stored);
    setInitialized(true);
  }, []);

  function update(key, value) {
    const stored = savePrivacyPreferences({ ...preferences, [key]: value });
    setPreferences(stored);
    setSaved(true);
  }

  function rejectOptional() {
    const value = savePrivacyPreferences(DEFAULT_PRIVACY_PREFERENCES);
    setPreferences(value);
    setSaved(true);
  }

  return (
    <div>
      {gpc ? (
        <div className="mb-8 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950" role="status">
          Global Privacy Control is enabled in this browser. This site does not use marketing or targeted-advertising trackers.
        </div>
      ) : null}

      <div className="mb-6 flex items-center justify-between gap-6 border-y border-surface-strong py-4 text-sm">
        <span className="text-ink-soft">Current analytics state</span>
        <span className={`font-semibold ${preferences.analytics ? 'text-emerald-700' : 'text-ink'}`}>
          {initialized ? (preferences.analytics ? 'Allowed' : 'Blocked') : 'Loading'}
        </span>
      </div>

      <div className="rounded-2xl border border-surface-strong bg-white px-6 md:px-8">
        <PreferenceRow
          title="Essential"
          description="Required for core site functions, security, forms, session continuity, and remembering your privacy choice."
          checked
          disabled
          label="Essential technologies are always active"
        />
        <PreferenceRow
          title="First-party usage analytics"
          description="Allows page-view and contact-intent events to be sent to USATII. We use them to understand which pages are used. Disabling this also clears this browser tab's analytics session state."
          checked={preferences.analytics}
          onChange={(event) => update('analytics', event.target.checked)}
          label="Allow analytics"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={rejectOptional}
          className="rounded-full border border-control-border px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Reject optional
        </button>
        <p className="text-sm font-medium text-ink-soft" role="status">
          {saved ? `Saved. Analytics are ${preferences.analytics ? 'allowed' : 'blocked'} in this browser.` : 'Changes to analytics apply immediately.'}
        </p>
      </div>
    </div>
  );
}
