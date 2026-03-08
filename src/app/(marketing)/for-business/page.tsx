import { Metadata } from 'next';
import ForBusinessContent from '@/components/marketing/ForBusinessContent';

export const metadata: Metadata = {
  title:
    'Corporate Wellness Programs & Workplace Health | EKA Balance for Business',
  description:
    'Boost employee productivity and well-being with EKA Balance corporate wellness programs. We offer group classes, ergonomic consulting, and stress reduction workshops tailored for businesses and workplace teams.',
  keywords:
    'corporate wellness programs, workplace health, employee wellbeing, corporate yoga, ergonomic consulting, stress reduction for employees, business wellness solutions',
  openGraph: {
    title: 'Corporate Wellness Programs & Workplace Health | EKA Balance',
    description:
      'Transform your workplace with holistic wellness solutions. Tailored group classes, ergonomic consulting, and stress reduction for businesses.',
    type: 'website',
    url: 'https://ekabalance.com/for-business',
  },
  alternates: {
    canonical: 'https://ekabalance.com/for-business',
  },
};

export default function BusinessPage() {
  return <ForBusinessContent />;
}
