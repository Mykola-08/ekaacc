import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  
  const user = session?.user;
  const roles = user?.['https://ekabalance.com/roles'] || user?.roles || [];
  
  if (!roles.includes('Therapist') && !roles.includes('Admin')) {
    // Redirect non-therapists to the main app
    return NextResponse.redirect(new URL('http://localhost:9002/dashboard', req.url));
  }
  
  return res;
}
