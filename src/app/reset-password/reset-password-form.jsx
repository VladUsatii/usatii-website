'use client';

import { useState } from 'react';
import Link from 'next/link';
import PasswordInput from '@/app/_components/password-input';

export default function ResetPasswordForm({ token }) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectTo, setRedirectTo] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/portal/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Unable to reset the password right now.');
      setRedirectTo(payload.redirectTo || '/portal/login');
    } catch (caught) {
      setError(caught.message || 'Unable to reset the password right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-neutral-950 px-6 py-16 text-neutral-100">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.35)] sm:p-8">
        <Link href="/" className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">USATII MEDIA</Link>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">Choose a new password</h1>

        {redirectTo ? (
          <div className="mt-7">
            <p className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">Your password has been updated. Existing login sessions were signed out.</p>
            <Link href={redirectTo} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">Return to login</Link>
          </div>
        ) : token ? (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <p className="text-sm leading-6 text-neutral-400">Use at least 12 characters with uppercase and lowercase letters, a number, and a symbol.</p>
            <label className="block text-sm font-medium text-neutral-200">New password
              <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" containerClassName="mt-2" className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white" buttonClassName="text-neutral-400 hover:text-white" required />
            </label>
            <label className="block text-sm font-medium text-neutral-200">Confirm new password
              <PasswordInput value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" containerClassName="mt-2" className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white" buttonClassName="text-neutral-400 hover:text-white" required />
            </label>
            {error ? <p className="rounded-lg border border-rose-300/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200">{error}</p> : null}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Updating…' : 'Update password'}</button>
          </form>
        ) : (
          <div className="mt-7">
            <p className="rounded-xl border border-rose-300/40 bg-rose-500/15 p-4 text-sm text-rose-100">This reset link is missing its security token.</p>
            <Link href="/forgot-password" className="mt-5 inline-block text-sm font-medium text-neutral-300 underline underline-offset-4">Request another link</Link>
          </div>
        )}
      </section>
    </main>
  );
}
