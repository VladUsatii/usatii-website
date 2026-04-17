import { redirect } from 'next/navigation';
import { getCurrentPortalSession } from '@/lib/portal/auth';
import OwnerDashboard from '@/app/admin/_components/owner-dashboard';

export const metadata = {
  title: 'Admin Portal | USATII MEDIA',
};

export default async function AdminPortalPage() {
  const session = await getCurrentPortalSession();

  if (!session) {
    redirect('/admin/login');
  }

  if (session.role !== 'admin') {
    redirect('/portal/dashboard');
  }

  return <OwnerDashboard adminEmail={session.email} />;
}
