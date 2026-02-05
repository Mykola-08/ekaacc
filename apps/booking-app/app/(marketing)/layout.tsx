import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { MainLayout } from '@/components/layout/main-layout';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      header={<SiteHeader />}
      footer={<SiteFooter />}
    >
      {children}
    </MainLayout>
  );
}

