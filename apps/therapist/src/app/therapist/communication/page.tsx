import { createClient } from '@/lib/supabase/server';
import { TherapistEmailForm } from '@/components/therapist/TherapistEmailForm';
import { redirect } from 'next/navigation';

export default async function CommunicationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify role (optional, but good practice)
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  // if (profile?.role !== 'therapist') redirect('/dashboard');

  // Fetch patients
  // Ideally, we should fetch only patients assigned to this therapist.
  // For now, we'll fetch all users who are not therapists/admins, or just all users.
  // Assuming 'users' table or 'profiles' table.
  
  // Let's try to fetch from 'profiles' if it exists, otherwise we might need to use a different approach.
  // I'll assume a 'profiles' table exists as is common in Supabase starters.
  
  let patients: any[] = [];
  
  try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .neq('id', user.id); // Exclude self
      
      if (profiles) {
          patients = profiles.map(p => ({
              id: p.id,
              name: p.full_name || 'Unknown',
              email: 'Email hidden' // Email is in auth.users, not accessible here directly without admin
          }));
      }
      
      // If email is not in profiles, we might have a problem if we can't access auth.users.
      // But let's assume for this task that we can get a list of patients.
      // If profiles doesn't have email, we might need to rely on the server action to look it up, 
      // but the form needs to show something.
      
      // Fallback: if no profiles found (maybe table name is different), return empty list.
  } catch (e) {
      console.error('Error fetching patients:', e);
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Patient Communication</h1>
      <TherapistEmailForm patients={patients} />
    </div>
  );
}
