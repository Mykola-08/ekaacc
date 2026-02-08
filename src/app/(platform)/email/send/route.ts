import { NextRequest, NextResponse } from 'next/server';
import { TransactionalEmailService } from '@/lib/platform/services/transactional-email-service';
import { supabase } from '@/lib/platform/supabase';

// Helper function to verify user authentication
async function verifyUserAccess(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No valid authorization header', user: null };
  }

  const token = authHeader.split(' ')[1];
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: 'Invalid token', user: null };
  }

  return { error: null, user };
}

/**
 * POST /api/email/send
 * Send a transactional email to a specific user
 *
 * Body:
 * {
 *   userId: string;
 *   type: 'notification' | 'reminder' | 'result' | 'homework' | 'session_notes' | 'check_in';
 *   subject: string;
 *   data: object; // Template-specific data
 *   force?: boolean; // Override user preferences (use sparingly)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { error: authError, user } = await verifyUserAccess(request);

    if (authError || !user) {
      return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, type, subject, data, force = false } = body;

    // Validate required fields
    if (!userId || !type || !subject || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, type, subject, data' },
        { status: 400 }
      );
    }

    // Check if user has permission to send emails
    // Only admins or therapists can send to other users
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = userData?.role;
    const canSendToOthers = userRole === 'admin' || userRole === 'therapist';

    if (userId !== user.id && !canSendToOthers) {
      return NextResponse.json(
        { error: 'Insufficient permissions to send emails to other users' },
        { status: 403 }
      );
    }

    // Send the email
    const result = await TransactionalEmailService.send({
      userId,
      type,
      subject,
      data,
      force,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
