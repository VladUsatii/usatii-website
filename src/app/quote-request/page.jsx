'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const BACKGROUND_IMAGES = [
  '/quote-bg/celestial-chart.jpg',
  '/quote-bg/optics-engraving.jpg',
  '/quote-bg/computation-diagram.jpg',
  '/quote-bg/halftone-media.jpg',
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  customerType: 'Yes, I am a potential new customer',
  message: '',
  urgency: 'urgent',
};

const inputClass =
  'w-full rounded-2xl border border-neutral-200 bg-white/80 px-3.5 py-3 text-sm text-neutral-950 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white';

function InputField({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function SignalBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      <img
        src="/world-network-zoom-purple-clients-fast.svg"
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-[0.42]"
      />

    </div>
  );
}

export default function QuoteRequestPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [sessionId, setSessionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const key = 'usatii_telemetry_session_id';
    const existing = window.sessionStorage.getItem(key);

    if (existing) {
      setSessionId(existing);
      return;
    }

    const nextId =
      typeof window.crypto?.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `session_${Date.now()}_${Math.round(Math.random() * 1e8)}`;

    window.sessionStorage.setItem(key, nextId);
    setSessionId(nextId);
  }, []);

  function setField(key, value) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sessionId,
          originPath: '/quote-request',
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('error');
        setMessage(payload.error || 'Unable to submit right now. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('Submitted. We will reach out shortly.');
      setForm(INITIAL_FORM);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-8 text-neutral-950 sm:px-6">
      <SignalBackground />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-5 text-center">
            <Link
              href="/"
              className="text-sm font-black tracking-tight text-neutral-950 transition hover:opacity-70"
            >
              USATII MEDIA
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/78 p-5 shadow-[0_24px_100px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:p-7"
          >

          <div className="mb-5">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Request a quote
            </h1>
            <p className='text-neutral-700 text-sm pt-3'><span className='text-purple-500'>We serve clients all over the world</span>. Usatii provides world-class marketing and software builds to new and established businesses looking to scale and move operations in-house. Request a quote here and we'll get back to you within 24 hours.</p>
          </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Name">
                <input
                  required
                  value={form.fullName}
                  onChange={(event) => setField('fullName', event.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </InputField>

              <InputField label="Email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setField('email', event.target.value)}
                  className={inputClass}
                  placeholder="Email"
                />
              </InputField>

              <InputField label="Phone">
                <input
                  value={form.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  className={inputClass}
                  placeholder="Phone"
                />
              </InputField>

              <InputField label="Address">
                <input
                  value={form.address}
                  onChange={(event) => setField('address', event.target.value)}
                  className={inputClass}
                  placeholder="Address"
                />
              </InputField>

              <InputField label="Customer">
                <select
                  value={form.customerType}
                  onChange={(event) => setField('customerType', event.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="Yes, I am a potential new customer">Potential customer</option>
                  <option value="No, I am an existing customer">Existing customer</option>
                  <option value="I'm neither">Neither</option>
                </select>
              </InputField>

              <InputField label="Urgency">
                <select
                  value={form.urgency}
                  onChange={(event) => setField('urgency', event.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </InputField>

              <InputField label="Message" className="sm:col-span-2">
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(event) => setField('message', event.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="What do you need?"
                />
              </InputField>
            </div>

            {status === 'error' ? (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                {message}
              </p>
            ) : null}

            {status === 'success' ? (
              <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
                {message}
              </p>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>

              <Link
                href="https://cal.com/usatii/onboarding"
                target="_blank"
                className="rounded-2xl border border-neutral-200 bg-white/70 px-5 py-3 text-center text-sm font-bold text-neutral-800 transition hover:border-neutral-950 hover:bg-white"
              >
                Book a call instead?
              </Link>
            </div>
          </form>
        </div>
      </div>

      <style>{`
  .signal-grid {
    background-image:
      linear-gradient(to right, rgba(15, 23, 42, 0.045) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15, 23, 42, 0.045) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(circle at 50% 50%, black 0%, black 52%, transparent 90%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, black 0%, black 52%, transparent 90%);
  }

  .art-image {
    opacity: 0;
    filter: grayscale(1) contrast(1.1) brightness(1.08);
    mix-blend-mode: multiply;
    transform: scale(1.04);
    animation: artImageCycle 28s ease-in-out infinite;
  }

  .signal-pulses {
    stroke-dasharray: 8 18;
    animation: signalFlow 16s linear infinite;
  }

  @keyframes artImageCycle {
    0% {
      opacity: 0;
      transform: scale(1.04) translate3d(-1%, -1%, 0);
    }
    8% {
      opacity: 0.36;
    }
    28% {
      opacity: 0.36;
    }
    38% {
      opacity: 0;
      transform: scale(1.1) translate3d(1%, 1%, 0);
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes signalFlow {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: -180;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .art-image,
    .signal-pulses {
      animation: none;
    }

    .art-image:first-child {
      opacity: 0.34;
    }
  }
`}</style>
    </section>
  );
}