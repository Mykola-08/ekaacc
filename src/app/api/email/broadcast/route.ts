import { NextRequest, NextResponse } from 'next/server';
import { BroadcastService } from '@/services/broadcast-service';
import { supabase } from '@/lib/supabase';

// Helper function to verify user authentication
async function verifyUserAccess(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No valid authorization header', user: null };
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', user: null };
  }

  return { error: null, user };
}

/**
 * POST /api/email/broadcast
 * Send a broadcast email to a group of users
 * 
 * Body:
 * {
 *   subject: string;
 *   content: string;
 *   topic: 'general' | 'marketing' | 'product_launch' | 'promotional';
 *   groupId: string;
 *   templateData?: object; // Additional template-specific data
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { error: authError, user } = await verifyUserAccess(request);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: authError || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only administrators can send broadcast emails' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subject, content, topic, groupId, templateData } = body;

    // Validate required fields
    if (!subject || !content || !topic || !groupId) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, content, topic, groupId' },
        { status: 400 }
      );
    }

    // Verify group exists
    const { data: group, error: groupError } = await supabase
      .from('user_groups')
      .select('id, name')
      .eq('id', groupId)
      .single();

    if (groupError || !group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Send the broadcast
    const result = await BroadcastService.sendBroadcast(
      subject,
      content,
      topic,
      groupId,
      user.id,
      templateData
    );

    return NextResponse.json({
      success: true,
      sentCount: result.count,
      groupName: group.name
    });
  } catch (error) {
    console.error('Broadcast email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
