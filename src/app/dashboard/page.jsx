import { redirect } from 'next/navigation';
import { getCurrentPortalSession } from '@/lib/portal/auth';
import UsatiiDashboard from '@/app/dashboard/usatii-dashboard';

export const metadata = {
  title: 'USATII Dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardPage({ searchParams }) {
  const params = new URLSearchParams(await searchParams);
  const session = await getCurrentPortalSession();
  if (!session) redirect(`/admin/login?next=${encodeURIComponent(`/dashboard${params.size ? `?${params}` : ''}`)}`);
  if (session.role !== 'admin') redirect('/portal/dashboard');
  return <UsatiiDashboard adminEmail={session.email} />;
}
