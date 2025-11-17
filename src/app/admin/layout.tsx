'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Settings, BarChart3, Shield, ArrowLeft, DollarSign, Database, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
	{ href: '/admin', label: 'Dashboard', icon: BarChart3 },
	{ href: '/admin/users', label: 'Users', icon: Users },
	{ href: '/admin/subscriptions', label: 'Subscriptions', icon: DollarSign },
	{ href: '/admin/payments', label: 'Payments', icon: CreditCard },
	{ href: '/admin/community-setup', label: 'Community', icon: Database },
	{ href: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminSidebar() {
	const pathname = usePathname();

	return (
		<aside className="w-64 flex-shrink-0 border-r bg-background hidden lg:flex flex-col">
			<div className="flex h-full flex-col justify-between">
				<div>
					<div className="p-4 border-b h-[69px] flex items-center">
						<Link href="/admin" className="flex items-center gap-3">
							<Shield className="h-7 w-7 text-primary" />
							<h1 className="text-lg font-bold">Admin Portal</h1>
						</Link>
					</div>
					<nav className="flex-1 space-y-1 p-2">
						{navItems.map((item) => {
							const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
							return (
								<Link key={item.href} href={item.href}>
									<Button
										variant={isActive ? "secondary" : "outline"}
										className="w-full justify-start"
									>
										<item.icon className="mr-2 h-4 w-4" />
										{item.label}
									</Button>
								</Link>
							);
						})}
					</nav>
				</div>
				<div className="p-4 border-t">
					<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" className="w-full justify-start">
									<Link href="/home">
										<ArrowLeft className="mr-2 h-4 w-4" />
										Back to App
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Return to the main application view.</p>
							</TooltipContent>
						</Tooltip>
				</div>
			</div>
		</aside>
	);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen bg-background">
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto">
				<div className="p-4 sm:p-6 lg:p-8">{children}</div>
			</main>
		</div>
	);
}
