'use client';

import { UnifiedDataProvider } from '@/context/unified-data-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Users, Calendar, Settings, BarChart3, FileText, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/sessions', label: 'Sessions', icon: Calendar },
    { href: '/admin/reports', label: 'Reports', icon: FileText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <UnifiedDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Top Admin Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/home">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to App
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Admin Portal
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    System Administration & Management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-300 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  Admin Mode
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-4">
            <nav className="flex gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'rounded-none border-b-2 border-transparent px-4 py-6 hover:border-slate-300 dark:hover:border-slate-600',
                        isActive &&
                          'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area - Full Width, No Sidebar */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </UnifiedDataProvider>
  );
}
