'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, CreditCard, Crown } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'motion/react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import dynamic from 'next/dynamic';

const WalletTab = dynamic(
  () => import('./tabs/WalletTab').then((m) => ({ default: m.WalletTab })),
  { loading: () => <TabSkeleton /> }
);
const BillingTab = dynamic(
  () => import('./tabs/BillingTab').then((m) => ({ default: m.BillingTab })),
  { loading: () => <TabSkeleton /> }
);
const PlansTab = dynamic(
  () => import('./tabs/PlansTab').then((m) => ({ default: m.PlansTab })),
  { loading: () => <TabSkeleton /> }
);

function TabSkeleton() {
  return (
    <div className="space-y-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function FinancesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'wallet';

  const handleTabChange = (value: string) => {
    router.replace(`/finances?tab=${value}`, { scroll: false });
  };

  return (
    <motion.div
      className="space-y-8 px-4 py-8 md:px-8"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      <DashboardHeader
        title="Finances"
        subtitle="Manage your wallet, subscription plans, and billing in one place."
      />

      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 rounded-lg">
          <TabsTrigger value="wallet" className="gap-2 rounded-lg">
            <Wallet className="h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2 rounded-lg">
            <Crown className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 rounded-lg">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="mt-6">
          <WalletTab />
        </TabsContent>
        <TabsContent value="plans" className="mt-6">
          <PlansTab />
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default function FinancesPage() {
  return (
    <Suspense fallback={<TabSkeleton />}>
      <FinancesContent />
    </Suspense>
  );
}
