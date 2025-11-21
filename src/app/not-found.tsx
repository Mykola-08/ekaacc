'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { PageContainer } from '@/components/eka/page-container';
import { SurfacePanel } from '@/components/eka/surface-panel';

/**
 * 404 Not Found Page
 * 
 * Shown when a user tries to access a page that doesn't exist
 * Provides helpful navigation options
 */
export default function NotFound() {
  return (
    <PageContainer>
      <SurfacePanel className="flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl">404 - Page Not Found</CardTitle>
          <CardDescription className="text-base mt-2">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            <p>This could have happened for a few reasons:</p>
            <ul className="mt-2 space-y-1 text-left max-w-sm mx-auto">
              <li>• The URL was typed incorrectly</li>
              <li>• The page has been moved or deleted</li>
              <li>• You don't have permission to access this page</li>
              <li>• The link you followed is outdated</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 flex-col sm:flex-row">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
        </Card>
      </SurfacePanel>
    </PageContainer>
  );
}
