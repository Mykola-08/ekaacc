'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ─── MFA Enrollment ──────────────────────────────────────────────────────────

export async function enrollMFA() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Authenticator App',
    });

    if (error) throw error;

    return {
      success: true,
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    };
  } catch (err: any) {
    console.error('enrollMFA error:', err);
    return { success: false, error: err.message || 'Failed to set up MFA' };
  }
}

export async function verifyMFAEnrollment(factorId: string, code: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) throw challenge.error;

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code,
    });

    if (verify.error) throw verify.error;

    revalidatePath('/settings');
    return { success: true };
  } catch (err: any) {
    console.error('verifyMFAEnrollment error:', err);
    return { success: false, error: err.message || 'Invalid verification code' };
  }
}

export async function unenrollMFA(factorId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw error;

    revalidatePath('/settings');
    return { success: true };
  } catch (err: any) {
    console.error('unenrollMFA error:', err);
    return { success: false, error: err.message || 'Failed to disable MFA' };
  }
}

export async function getMFAFactors() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { factors: [], enabled: false };
  }

  try {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) throw error;

    const verifiedFactors = data.totp.filter((f) => f.status === 'verified');
    return {
      factors: verifiedFactors,
      enabled: verifiedFactors.length > 0,
    };
  } catch {
    return { factors: [], enabled: false };
  }
}

// ─── MFA Challenge (for login flow) ──────────────────────────────────────────

export async function challengeMFA(factorId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) throw error;

    return { success: true, challengeId: data.id };
  } catch (err: any) {
    console.error('challengeMFA error:', err);
    return { success: false, error: err.message || 'Failed to create MFA challenge' };
  }
}

export async function verifyMFAChallenge(
  factorId: string,
  challengeId: string,
  code: string
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });

    if (error) throw error;

    revalidatePath('/dashboard', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('verifyMFAChallenge error:', err);
    return { success: false, error: err.message || 'Invalid verification code' };
  }
}

export async function getAssuranceLevel() {
  const supabase = await createClient();

  try {
    const { data, error } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) throw error;

    return {
      currentLevel: data.currentLevel,
      nextLevel: data.nextLevel,
      currentAuthenticationMethods: data.currentAuthenticationMethods,
    };
  } catch {
    return { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] };
  }
}
