import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const VIPContent = dynamic(() => import('@/marketing/components/VIPContent'), {
  ssr: true,
  loading: () => <div className="bg-background min-h-screen animate-pulse" />,
});

export const metadata: Metadata = {
  title: 'VIP Club & Luxury Wellness Plans | EKA Balance',
  description:
    'Exclusive memberships offering priority booking, home visits, and comprehensive family wellness plans.',
};

export default function VIPPage() {
  return <VIPContent />;
}
