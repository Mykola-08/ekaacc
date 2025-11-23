import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/email/verify?token=xxx
 * Verify email address using token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new NextResponse(
        `<html><body><h1>Invalid verification link</h1><p>The verification token is missing.</p></body></html>`,
        {
          status: 400,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Look up token
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return new NextResponse(
        `<html><body><h1>Invalid verification link</h1><p>This verification link is invalid or has already been used.</p></body></html>`,
        {
          status: 400,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return new NextResponse(
        `<html><body><h1>Verification link expired</h1><p>This verification link has expired. Please request a new one.</p></body></html>`,
        {
          status: 400,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Mark email as verified
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      tokenData.user_id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Failed to verify email:', updateError);
      return new NextResponse(
        `<html><body><h1>Verification failed</h1><p>An error occurred while verifying your email.</p></body></html>`,
        {
          status: 500,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Delete used token
    await supabase
      .from('email_verification_tokens')
      .delete()
      .eq('token', token);

    // Redirect to success page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${appUrl}/email-verified?success=true`);
  } catch (error) {
    console.error('Email verification error:', error);
    return new NextResponse(
      `<html><body><h1>Verification failed</h1><p>An unexpected error occurred.</p></body></html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}
