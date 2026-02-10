import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = {
    id: user.id,
    full_name: user.user_metadata?.full_name,
    email: user.email,
    phone: user.user_metadata?.phone,
    avatar_url: user.user_metadata?.avatar_url,
    role: user.app_metadata?.role || user.user_metadata?.role,
    ...user.user_metadata
  };

  return <DashboardLayout profile={profile}>{children}</DashboardLayout>;
}
