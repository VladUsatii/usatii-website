import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Portal | USATII',
};

export default function AdminPortalPage() {
  redirect('/dashboard');
}
