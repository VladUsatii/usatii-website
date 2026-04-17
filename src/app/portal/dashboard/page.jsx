import { redirect } from 'next/navigation';
import { getCurrentPortalSession } from '@/lib/portal/auth';
import DashboardShell from '@/app/portal/dashboard/_components/dashboard-shell';

export const metadata = {
  title: 'Client Dashboard | USATII MEDIA',
};

export default async function PortalDashboardPage({ searchParams }) {
  const session = await getCurrentPortalSession();

  if (!session) {
    redirect('/portal/login');
  }

  if (session.role !== 'client') {
    if (session.role === 'admin') redirect('/admin');
    redirect('/portal/login');
  }

  const resolvedSearchParams = await searchParams;

  return (
    <DashboardShell
      user={{
        email: session.email,
        displayName: session.profile.displayName || null,
        company: session.profile.company || null,
      }}
      checkoutState={
        typeof resolvedSearchParams?.checkout === 'string'
          ? resolvedSearchParams.checkout
          : null
      }
    />
  );
}
