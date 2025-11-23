import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function AuthDispatchPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/api/auth/login');
  }

  const user = session.user;
  // Check for roles in various possible locations
  // Note: Ensure your Auth0 Action adds these claims to the ID Token
  const roles = user['https://ekabalance.com/roles'] || user.roles || [];

  if (roles.includes('Admin')) {
    redirect('http://localhost:9003');
  } else if (roles.includes('Therapist')) {
    redirect('http://localhost:9004');
  } else {
    // Default to patient dashboard
    redirect('/dashboard');
  }
}
