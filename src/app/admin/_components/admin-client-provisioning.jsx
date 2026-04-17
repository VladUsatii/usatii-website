'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const initialState = {
  email: '',
  password: '',
  displayName: '',
  company: '',
  driveFolderId: '',
  driveFolderUrl: '',
};

export default function AdminClientProvisioning({ adminEmail }) {
  const router = useRouter();

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function setField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to create client account.');
      }

      setSuccess(
        `Client ${payload.client.email} was created. Share the temporary password manually after your call.`
      );
      setForm(initialState);
    } catch (err) {
      setError(err.message || 'Unable to create client account.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/portal/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">USATII MEDIA</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">Admin</h1>
              <p className="mt-2 text-sm text-neutral-600">Logged in as {adminEmail}</p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400"
              >
                Main site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Create Client Account</p>
          <h2 className="mt-2 text-2xl font-black text-neutral-950">Manual Provisioning After Vlad Call</h2>
          <p className="mt-3 text-sm text-neutral-600">
            Use this form to open a client portal account after the onboarding call is complete. The client folder should already exist in Google Drive and be shared with the service account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Client email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setField('email', event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Temporary password</label>
              <input
                type="text"
                value={form.password}
                onChange={(event) => setField('password', event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Display name</label>
              <input
                value={form.displayName}
                onChange={(event) => setField('displayName', event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Company (optional)</label>
              <input
                value={form.company}
                onChange={(event) => setField('company', event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Drive folder ID</label>
              <input
                value={form.driveFolderId}
                onChange={(event) => setField('driveFolderId', event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Drive folder URL (optional)</label>
              <input
                value={form.driveFolderUrl}
                onChange={(event) => setField('driveFolderUrl', event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            {error ? (
              <p className="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="md:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create client account'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
