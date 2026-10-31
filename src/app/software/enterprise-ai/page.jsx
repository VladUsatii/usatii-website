import Header from './enterprise-header';
import Footer from '@/app/_components/footer';
import Experience from './experience';
export const metadata = {
  title: 'Enterprise AI',
  description: 'Put AI to work inside your operations. USATII connects business context, AI reasoning, and governed actions in software your enterprise can control.',
  alternates: { canonical: '/software/enterprise-ai' },
  openGraph: { title: 'USATII Enterprise AI', description: 'Intelligence engineered into your operations. Under your control.', url: '/software/enterprise-ai', type: 'website' },
};
export default function EnterpriseAI() { return <><Header /><Experience /><Footer /></>; }
