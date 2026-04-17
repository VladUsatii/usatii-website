import { redirect } from 'next/navigation';
import { getCurrentPortalSession } from '@/lib/portal/auth';
import PortalLoginForm from '@/app/portal/login/portal-login-form';

export const metadata = {
  title: 'Client Portal Login | USATII MEDIA',
};

export default async function PortalLoginPage({ searchParams }) {
  const session = await getCurrentPortalSession();

  if (session?.role === 'client') {
    redirect('/portal/dashboard');
  }

  if (session?.role === 'admin') {
    redirect('/admin');
  }

  const resolvedSearchParams = await searchParams;
  const nextPath =
    typeof resolvedSearchParams?.next === 'string'
      ? resolvedSearchParams.next
      : '/portal/dashboard';

  return <PortalLoginForm nextPath={nextPath} />;
}
