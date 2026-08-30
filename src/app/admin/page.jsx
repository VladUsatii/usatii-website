import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Portal | USATII MEDIA',
};

export default function AdminPortalPage() {
  redirect('/dashboard');
}
