import { redirect } from 'next/navigation';
import { getCurrentPortalSession } from '@/lib/portal/auth';
import { safeAdminReturnTo } from '@/lib/careers/admin-links';
import AdminLoginForm from '@/app/admin/login/admin-login-form';

export const metadata = {
  title: 'Admin Login | USATII',
};

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const returnTo = safeAdminReturnTo(params?.next);
  const session = await getCurrentPortalSession();

  if (session?.role === 'admin') {
    redirect(returnTo);
  }

  if (session?.role === 'client') {
    redirect('/portal/dashboard');
  }

  return <AdminLoginForm returnTo={returnTo} />;
}
