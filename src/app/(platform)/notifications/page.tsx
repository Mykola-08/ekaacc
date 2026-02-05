
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Bell, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function NotificationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', user.id)
        .single();

    // Mock notifications for now
    const notifications = [
        {
            id: 1,
            title: "Welcome to EKA Balance",
            message: "We're glad to have you here. Start by exploring our wellness services.",
            type: "info",
            date: new Date().toISOString()
        },
        {
            id: 2,
            title: "Profile Updated",
            message: "Your profile information was successfully updated.",
            type: "success",
            date: new Date(Date.now() - 86400000).toISOString()
        }
    ];

    return (
        <DashboardLayout profile={profile}>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <DashboardHeader
                    title="Notifications"
                    subtitle="Stay updated with your account activity."
                />

                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="group relative overflow-hidden bg-white border border-[#F0F0F0] rounded-2xl p-6 transition-all hover:shadow-lg shadow-sm hover:-translate-y-0.5">
                            <div className="flex gap-5">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border",
                                    notification.type === 'info' && "bg-blue-50 text-blue-600 border-blue-100",
                                    notification.type === 'success' && "bg-green-50 text-green-600 border-green-100",
                                    notification.type === 'warning' && "bg-amber-50 text-amber-600 border-amber-100",
                                )}>
                                    {notification.type === 'info' && <Info className="w-6 h-6" strokeWidth={2.5} />}
                                    {notification.type === 'success' && <CheckCircle className="w-6 h-6" strokeWidth={2.5} />}
                                    {notification.type === 'warning' && <AlertTriangle className="w-6 h-6" strokeWidth={2.5} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-foreground">{notification.title}</h3>
                                        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                            {new Date(notification.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground font-medium leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#F9F9F8] rounded-3xl border-2 border-dashed border-[#EAEAEA]">
                            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p className="text-muted-foreground font-medium">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
