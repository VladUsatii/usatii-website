import PublicLayout from '../_components/public-layout';
import RolesPortal from './roles-portal';
import { roles } from '@/lib/careers/roles';

export const metadata = {
  title: 'Available Roles',
  description: 'Explore USATII career opportunities across teams and locations.',
  alternates: { canonical: '/careers/roles' },
};

export default function RolesPage() {
  return <PublicLayout className="bg-white text-neutral-950"><RolesPortal roles={roles.map(({ description, ...role }) => role)} /></PublicLayout>;
}
