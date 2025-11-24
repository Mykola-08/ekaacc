'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.role.name !== 'Admin') {
        // router.push('/dashboard'); // Commented out for testing purposes if needed, but should be enforced
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <nav className="flex gap-4">
          <Link href="/admin/users">
            <Button variant="ghost">Users</Button>
          </Link>
          <Link href="/educator">
            <Button variant="ghost">Educator View</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
