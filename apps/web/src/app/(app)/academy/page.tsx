'use client';

import { PageContainer } from '@/components/eka/page-container';
import { PageHeader } from '@/components/eka/page-header';
import { SurfacePanel } from '@/components/eka/surface-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AcademyPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Academy LMS"
        description="Your learning journey starts here."
        badge="Education"
      />
      <SurfacePanel>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">View your enrolled courses and progress.</p>
              <Button asChild>
                <Link href="/academy/my-courses">Go to My Courses</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Browse Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Explore new courses and learning paths.</p>
              <Button asChild variant="outline">
                <Link href="/academy/catalog">Browse</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </SurfacePanel>
    </PageContainer>
  );
}
