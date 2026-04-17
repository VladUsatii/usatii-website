'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          mode: 'admin',
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to login right now.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Unable to login right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-100">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.35)] backdrop-blur">
        <Link href="/" className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          ADMINISTRATOR
        </Link>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">Login</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-200">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-200">Password</label>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              required
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-300/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in as owner'}
          </button>
        </form>
      </div>
    </main>
  );
}
