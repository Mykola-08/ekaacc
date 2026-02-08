import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/platform/services/transactional-email-service';
import { supabaseAdmin } from '@/lib/platform/supabase';
import crypto from 'crypto';

/**
 * POST /api/email/verify/send
 * Send or resend email verification
 *
 * Body:
 * {
 *   email: string;
 *   userId?: string; // Optional, will look up if not provided
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userId } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get or verify user
    let user;
    if (userId) {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id, email, email_verified, raw_user_meta_data')
        .eq('id', userId)
        .eq('email', email)
        .single();
      user = data;
    } else {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id, email, email_verified, raw_user_meta_data')
        .eq('email', email)
        .single();
      user = data;
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.email_verified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    // Store token in database
    const { error: insertError } = await supabaseAdmin.from('email_verification_tokens').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      email: user.email,
    });

    if (insertError) {
      // If token already exists, update it
      await supabaseAdmin
        .from('email_verification_tokens')
        .update({
          token,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('email', user.email);
    }

    // Create verification URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/api/email/verify?token=${token}`;

    // Send verification email
    const userName = user.raw_user_meta_data?.name || 'User';

    const result = await sendWelcomeEmail(user.email, userName, verifyUrl);

    if (!result.success) {
      console.error('Failed to send verification email:', result.error);
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
