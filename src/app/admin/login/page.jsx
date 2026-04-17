import { redirect } from 'next/navigation';
import { getCurrentPortalSession } from '@/lib/portal/auth';
import AdminLoginForm from '@/app/admin/login/admin-login-form';

export const metadata = {
  title: 'Admin Login | USATII MEDIA',
};

export default async function AdminLoginPage() {
  const session = await getCurrentPortalSession();

  if (session?.role === 'admin') {
    redirect('/admin');
  }

  if (session?.role === 'client') {
    redirect('/portal/dashboard');
  }

  return <AdminLoginForm />;
}
