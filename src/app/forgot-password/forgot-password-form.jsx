'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordForm({ mode }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const loginPath = mode === 'admin' ? '/admin/login' : '/portal/login';

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/portal/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Unable to send a reset email right now.');
      setMessage(payload.message);
    } catch (caught) {
      setError(caught.message || 'Unable to send a reset email right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-neutral-950 px-6 py-16 text-neutral-100">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.35)] sm:p-8">
        <Link href="/" className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">USATII MEDIA</Link>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">Enter the email attached to your account. If it matches an active account, we will send a one-time reset link.</p>

        {message ? (
          <div className="mt-7 rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm font-medium text-neutral-200">Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-2 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white" required />
            </label>
            {error ? <p className="rounded-lg border border-rose-300/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200">{error}</p> : null}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Sending…' : 'Send reset link'}</button>
          </form>
        )}

        <Link href={loginPath} className="mt-6 inline-block text-sm font-medium text-neutral-400 transition hover:text-white">Back to login</Link>
      </section>
    </main>
  );
}
