import ResetPasswordForm from './reset-password-form';

export const metadata = {
  title: 'Reset Password | USATII MEDIA',
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === 'string' ? params.token : '';
  return <ResetPasswordForm token={token} />;
}
