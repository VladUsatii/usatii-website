import { redirect } from 'next/navigation';
import { getCurrentPortalSession } from '@/lib/portal/auth';

export default async function PortalIndexPage() {
  const session = await getCurrentPortalSession();

  if (!session) {
    redirect('/portal/login');
  }

  if (session.role === 'admin') {
    redirect('/admin');
  }

  redirect('/portal/dashboard');
}
