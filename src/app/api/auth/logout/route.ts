import { createClient } from '@/lib/platform/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const supabase = await createClient();

  // Sign out from Supabase
  await supabase.auth.signOut();

  // Redirect to home page after logout
  return NextResponse.redirect(new URL('/', req.url));
};
