export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Edit, Shield } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <DashboardLayout profile={profile}>
      <div className="animate-in fade-in slide-in-from-bottom-2 space-y-10 pb-20 duration-700">
        <DashboardHeader
          title="My Profile"
          subtitle="Manage your personal information and preferences."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Identity Card */}
          <DashboardCard className="border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)] md:col-span-1">
            <div className="flex flex-col items-center space-y-6 py-4 text-center">
              <div className="group relative">
                <Avatar className="h-40 w-40 rounded-2xl border-8 border-[#F9F9F8] shadow-2xl">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="rounded-2xl bg-[#F0F0F0] text-4xl font-black text-[#222222]">
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute right-4 -bottom-2 rounded-full border-4 border-white bg-[#4DAFFF] px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg">
                  Client
                </Badge>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight text-[#222222]">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-lg font-medium text-[#999999]">
                  @{profile.username || 'username'}
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-full border-[#EAEAEA] bg-white font-bold text-[#222222] shadow-sm hover:bg-[#F9F9F8]"
              >
                <Link href="/settings">
                  <Edit className="mr-2 h-4 w-4" strokeWidth={2.5} />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </DashboardCard>

          {/* Details Card */}
          <DashboardCard
            className="border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)] md:col-span-2"
            title="Personal Details"
            icon={User}
          >
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold tracking-widest text-[#999999] uppercase">
                    Email Address
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-[#F9F9F8] p-5 text-lg font-bold text-[#222222]">
                    <Mail className="h-5 w-5 text-[#4DAFFF]" strokeWidth={2.5} />
                    {profile.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold tracking-widest text-[#999999] uppercase">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-[#F9F9F8] p-5 text-lg font-bold text-[#222222]">
                    <Phone className="h-5 w-5 text-[#4DAFFF]" strokeWidth={2.5} />
                    {profile.phone || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold tracking-widest text-[#999999] uppercase">
                    Member Since
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-[#F9F9F8] p-5 text-lg font-bold text-[#222222]">
                    <Calendar className="h-5 w-5 text-[#4DAFFF]" strokeWidth={2.5} />
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold tracking-widest text-[#999999] uppercase">
                    Account ID
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-[#F9F9F8] p-5 font-mono text-base text-lg font-bold text-[#222222]">
                    <Shield className="h-5 w-5 text-[#4DAFFF]" strokeWidth={2.5} />
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
