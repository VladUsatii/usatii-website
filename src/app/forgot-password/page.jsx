import ForgotPasswordForm from './forgot-password-form';

export const metadata = {
  title: 'Forgot Password | USATII MEDIA',
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage({ searchParams }) {
  const params = await searchParams;
  const mode = params?.mode === 'admin' ? 'admin' : 'client';
  return <ForgotPasswordForm mode={mode} />;
}
