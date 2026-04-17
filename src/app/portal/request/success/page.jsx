import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentPortalSession } from '@/lib/portal/auth';

export const metadata = {
  title: 'Request Received | USATII MEDIA',
};

export default async function PortalRequestSuccessPage() {
  const session = await getCurrentPortalSession();

  if (!session || session.role !== 'client') {
    redirect('/portal/login');
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-5 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">USATII MEDIA</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-neutral-950">Payment Received</h1>
        <p className="mt-4 text-sm text-neutral-600">
          Your video request has been submitted and payment was completed in Stripe. Vlad will review your brief and follow up in your normal project channel.
        </p>

        <Link
          href="/portal/dashboard"
          className="mt-8 inline-flex rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
