'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { PageContainer } from '@/components/eka/page-container';
import { SurfacePanel } from '@/components/eka/surface-panel';

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <PageContainer>
            <SurfacePanel className="p-4 sm:p-6 lg:p-8">
              {children}
            </SurfacePanel>
          </PageContainer>
        </main>
      </div>
    </AuthGuard>
  );
}
