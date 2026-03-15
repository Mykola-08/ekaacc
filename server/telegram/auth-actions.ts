'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { validateTelegramWebAppData } from '@/lib/telegram-validation';

export async function validateAndLoginWithTelegram(initData: string) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error('Missing TELEGRAM_BOT_TOKEN');

    const { isValid, parsedData } = validateTelegramWebAppData(initData, botToken);

    if (!isValid || !parsedData?.user) {
      return { success: false, error: 'Invalid Telegram data' };
    }

    const tgUser = JSON.parse(parsedData.user);
    const tgId = tgUser.id;

    const adminSupabase = createAdminClient();

    // Check if the user is already linked
    const { data: linkData } = await adminSupabase
      .from('telegram_links')
      .select('user_id')
      .eq('telegram_chat_id', tgId)
      .single();

    let userId = linkData?.user_id;

    if (!userId) {
      // Create new user in auth.users
      const email = `tg_${tgId}@t.eka-platform.local`; // Dummy email

      const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          first_name: tgUser.first_name,
          last_name: tgUser.last_name || '',
          provider: 'telegram',
          telegram_id: tgId,
        },
      });

      if (createError || !newUser.user) {
        console.error('Failed to create user:', createError);
        return { success: false, error: 'Could not create user account' };
      }

      userId = newUser.user.id;

      // Link them in telegram_links
      await adminSupabase.from('telegram_links').insert({
        user_id: userId,
        telegram_chat_id: tgId,
        telegram_username: tgUser.username || null,
        is_verified: true,
      });
    }

    // Now, we need to log them in securely on the server
    // Workaround: We can exchange their email for an OTP if they have one,
    // or just generate a session token / custom token if we can.
    // However, since we use Supabase Auth and there's no native "sign in as user" without password in `server` client easily,
    // the typical solution for custom auth is to use `admin.generateLink({ type: 'magiclink', email })`
    // or use a custom token, but Supabase doesn't natively support issuing sessions directly from admin for normal client.
    // Wait, let's use the standard workaround: Create a custom password for the user, or use signInWithOtp.

    // Easier robust method without magic link:
    // Update user password to a known random string temporarily, then sign in with it?
    // Let's use `generateLink` to get a session seamlessly!

    // Actually, `supabase.auth.admin.generateLink({type: 'magiclink', email: userEmail})`
    // Wait! A better way is using Supabase's `generateLink` and parsing the hashed URL, but that's complex.
    /* What if we set a highly secure password and immediately log the user in? */
    const tempPassword = crypto.randomUUID() + crypto.randomUUID();

    await adminSupabase.auth.admin.updateUserById(userId, {
      password: tempPassword,
    });

    const standardSupabase = await createClient();
    const { data: sessionData, error: signInError } =
      await standardSupabase.auth.signInWithPassword({
        email: `tg_${tgId}@t.eka-platform.local`,
        password: tempPassword,
      });

    if (signInError) {
      return { success: false, error: 'Failed to establish session: ' + signInError.message };
    }

    return { success: true, redirectUrl: '/dashboard' };
  } catch (error: any) {
    console.error('Telegram login error:', error);
    return { success: false, error: error.message };
  }
}
