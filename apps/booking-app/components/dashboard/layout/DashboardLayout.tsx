'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Shield, LayoutDashboard, Settings, LogOut, Wallet, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

export function DashboardLayout({ children, profile }: { children: React.ReactNode, profile?: any }) {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useLanguage();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const navItems = [
        { label: t('nav.dashboard') || 'Dashboard', href: '/', icon: LayoutDashboard },
        { label: t('nav.wallet') || 'Wallet', href: '/wallet', icon: Wallet },
        { label: t('nav.book') || 'Bookings', href: '/bookings', icon: Calendar },
        { label: t('nav.account') || 'Profile', href: '/profile', icon: User },
        { label: t('nav.settings') || 'Settings', href: '/settings', icon: Settings },
    ];

    // Specialized 'Row' Button style from spec
    const NavButton = ({ item, isActive }: { item: any, isActive: boolean }) => (
        <Link href={item.href} className="w-full">
            <button
                className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition-all duration-200",
                    "active:scale-95", // Squishy interaction
                    isActive
                        ? "bg-secondary text-secondary-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.03)]"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
            >
                <item.icon className={cn("w-5 h-5", isActive ? "text-foreground" : "text-muted-foreground")} strokeWidth={2.75} />
                <span>{item.label}</span>
            </button>
        </Link>
    );

    return (
        <div className="min-h-screen bg-background p-4 flex gap-4 font-sans antialiased text-foreground">
            {/* Sidebar - Floating, glassy porcelain */}
            <nav className="w-64 bg-card/60 backdrop-blur-xl rounded-[36px] p-6 flex flex-col justify-between hidden md:flex shadow-sm border border-border/60">
                <div className="space-y-8">
                    {/* Brand Header */}
                    <div className="pl-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="font-bold text-xl tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
                                EKA BALANCE
                            </div>
                        </Link>
                    </div>

                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link href={item.href} key={item.href} className="w-full block">
                                <button
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-[18px] px-4 py-3.5 text-[15px] font-semibold transition-all duration-200",
                                        "active:scale-95", // Squishy interaction
                                        pathname === item.href
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary-foreground" : "text-muted-foreground")} strokeWidth={2.25} />
                                    <span>{item.label}</span>
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Profile Card at Bottom */}
                <div className="space-y-4">
                    <div className="bg-secondary/50 p-3 rounded-[24px] flex items-center gap-3 border border-border/50">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground font-bold border border-border/60 shadow-sm">
                            {profile?.first_name?.[0] || 'U'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-semibold text-sm truncate text-foreground">
                                {profile?.first_name || 'User'} {profile?.last_name || ''}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">Member</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Tiny Sign Out */}
                    <button 
                        onClick={handleSignOut}
                        className="w-full text-xs font-medium text-muted-foreground hover:text-destructive transition-colors text-center pb-1"
                    >
                        {t('nav.signout') || 'Sign Out'}
                    </button>
                </div>
            </nav>

            {/* Main Content Area - Porcelain surface with subtle glass feel */}
            <main className="flex-1 overflow-hidden relative flex flex-col gap-4 mb-20 md:mb-0">
                {/* Optional: We could put a top bar here if we wanted it global, but the screenshot has it per page. 
                     However, the layout wrapper itself renders specific children. 
                     We keep the main container standard. */}
                <div className="flex-1 bg-card/80 backdrop-blur-md rounded-[36px] border border-border/60 shadow-sm overflow-y-auto scrollbar-thin p-8 md:p-10">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/60 p-4 md:hidden pb-safe">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <Link href={item.href} key={item.href} className="flex-1">
                            <button
                                className={cn(
                                    "flex flex-col items-center justify-center w-full gap-1 p-2 rounded-xl transition-all duration-200",
                                    "active:scale-95",
                                    pathname === item.href
                                        ? "text-primary font-bold"
                                        : "text-muted-foreground/60 hover:text-foreground"
                                )}
                            >
                                <item.icon
                                    className={cn("w-6 h-6", pathname === item.href && "fill-primary/10")}
                                    strokeWidth={pathname === item.href ? 2.5 : 2}
                                />
                                <span className={cn("text-[10px] tracking-wide", pathname === item.href && "font-bold")}>{item.label}</span>
                            </button>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
