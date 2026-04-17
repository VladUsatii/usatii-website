'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PORTAL_BOOKING_URL = 'https://cal.com/usatii/onboarding';
const BACKGROUND_ROTATION_MS = 30_000;

const PORTAL_ARTWORKS = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/3840px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    title: 'The Starry Night',
    artist: 'Vincent van Gogh',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg/3840px-Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg',
    title: 'Wanderer above the Sea of Fog',
    artist: 'Caspar David Friedrich',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/3840px-Tsunami_by_hokusai_19th_century.jpg',
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/3840px-1665_Girl_with_a_Pearl_Earring.jpg',
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
  },
];

function getSafeNextPath(nextPath) {
  if (typeof nextPath !== 'string') return '/portal/dashboard';
  if (!nextPath.startsWith('/portal')) return '/portal/dashboard';
  return nextPath;
}

export default function PortalLoginForm({ nextPath }) {
  const router = useRouter();
  const safeNextPath = useMemo(() => getSafeNextPath(nextPath), [nextPath]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [artIndex, setArtIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setArtIndex((previous) => (previous + 1) % PORTAL_ARTWORKS.length);
    }, BACKGROUND_ROTATION_MS);

    return () => clearInterval(interval);
  }, []);

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
          mode: 'client',
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to login right now.');
      }

      router.push(payload.redirectTo || safeNextPath);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Unable to login right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0">
        {PORTAL_ARTWORKS.map((artwork, index) => (
          <img
            key={artwork.src}
            src={artwork.src}
            alt={`${artwork.title} by ${artwork.artist}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${
              index === artIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(0,0,0,0.7),rgba(15,23,42,0.65),rgba(0,0,0,0.76))]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" className="text-center text-white font-black tracking-tight">
          USATII MEDIA
        </Link>
        <section className="w-full rounded-3xl border border-white/20 bg-white/85 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.25)] backdrop-blur-md">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
            CLIENT
          </h3>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-neutral-950">Log In</h1>
          <p className="mt-3 text-sm text-neutral-700">
            Access your workspace, upload footage into your Drive, and request your next video project.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-neutral-300/90 bg-white/95 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-neutral-900/15"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-neutral-300/90 bg-white/95 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-neutral-900/15"
                placeholder="••••••••••••"
                required
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full rounded-xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-xs text-neutral-500">
            Request dashboard access:{' '}
            <Link href={PORTAL_BOOKING_URL} className="font-semibold text-neutral-800 underline underline-offset-4">
              Book a call
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
