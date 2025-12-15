import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthDispatchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user roles from Supabase
  const { data: roleAssignment } = await supabase
    .from('user_role_assignments')
    .select(`
      user_roles!inner(name)
    `)
    .eq('user_id', user.id)
    .single();

  // Type assertion for the nested role object
  const userRoles = roleAssignment?.user_roles as { name: string } | { name: string }[] | undefined;
  const roleName = Array.isArray(userRoles) ? userRoles[0]?.name : userRoles?.name;

  if (roleName === 'admin') {
    redirect('/console');
  } else if (roleName === 'therapist') {
    redirect('/therapist/dashboard');
  } else {
    // Default to patient dashboard
    redirect('/dashboard');
  }
}
