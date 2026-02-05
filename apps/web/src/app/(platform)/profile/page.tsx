
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Edit, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
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

    if (!profile) {
        redirect("/onboarding");
    }

    return (
        <DashboardLayout profile={profile}>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20">
                <DashboardHeader
                    title="My Profile"
                    subtitle="Manage your personal information and preferences."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Identity Card */}
                    <DashboardCard className="md:col-span-1 border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col items-center text-center space-y-6 py-4">
                            <div className="relative group">
                                <Avatar className="w-40 h-40 border-8 border-[#F9F9F8] shadow-2xl rounded-2xl">
                                    <AvatarImage src={profile.avatar_url} />
                                    <AvatarFallback className="text-4xl bg-[#F0F0F0] text-[#222222] font-black rounded-2xl">
                                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <Badge className="absolute -bottom-2 right-4 rounded-full px-4 py-1.5 text-xs font-bold bg-[#4DAFFF] text-white border-4 border-white shadow-lg uppercase tracking-wider">
                                    Client
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-[#222222] tracking-tight">{profile.first_name} {profile.last_name}</h2>
                                <p className="text-[#999999] font-medium text-lg">@{profile.username || 'username'}</p>
                            </div>
                            <Button asChild variant="outline" className="rounded-full w-full h-12 border-[#EAEAEA] bg-white hover:bg-[#F9F9F8] text-[#222222] font-bold shadow-sm">
                                <Link href="/settings">
                                    <Edit className="w-4 h-4 mr-2" strokeWidth={2.5} />
                                    Edit Profile
                                </Link>
                            </Button>
                        </div>
                    </DashboardCard>

                    {/* Details Card */}
                    <DashboardCard className="md:col-span-2 border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)]" title="Personal Details" icon={User}>
                        <div className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#999999] uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="flex items-center gap-4 text-[#222222] font-bold text-lg p-5 bg-[#F9F9F8] rounded-xl">
                                        <Mail className="w-5 h-5 text-[#4DAFFF]" strokeWidth={2.5} />
                                        {profile.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#999999] uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="flex items-center gap-4 text-[#222222] font-bold text-lg p-5 bg-[#F9F9F8] rounded-xl">
                                        <Phone className="w-5 h-5 text-[#4DAFFF]" strokeWidth={2.5} />
                                        {profile.phone || 'Not provided'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#999999] uppercase tracking-widest ml-1">Member Since</label>
                                    <div className="flex items-center gap-4 text-[#222222] font-bold text-lg p-5 bg-[#F9F9F8] rounded-xl">
                                        <Calendar className="w-5 h-5 text-[#4DAFFF]" strokeWidth={2.5} />
                                        {new Date(profile.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#999999] uppercase tracking-widest ml-1">Account ID</label>
                                    <div className="flex items-center gap-4 text-[#222222] font-bold text-lg p-5 bg-[#F9F9F8] rounded-xl font-mono text-base">
                                        <Shield className="w-5 h-5 text-[#4DAFFF]" strokeWidth={2.5} />
                                        {profile.id.substring(0, 8)}...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </DashboardLayout>
    );
}
