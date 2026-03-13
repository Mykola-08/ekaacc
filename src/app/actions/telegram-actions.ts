'use server';

import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function generateTelegramConnectCode() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const code = crypto.randomBytes(16).toString('hex');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('metadata')
    .eq('user_id', user.id)
    .single();

  const metadata = profile?.metadata || {};
  metadata.telegram_connect_code = code;
  metadata.telegram_connect_expires = Date.now() + 1000 * 60 * 15;

  await supabase.from('user_profiles').update({ metadata }).eq('user_id', user.id);

  return code;
}
