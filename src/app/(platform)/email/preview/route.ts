import { NextRequest, NextResponse } from 'next/server';
import { TransactionalEmailService } from '@/lib/platform/services/transactional-email-service';

/**
 * POST /api/email/preview
 * Preview an email template without sending
 * 
 * Body:
 * {
 *   type: 'notification' | 'reminder' | 'result' | 'homework' | 'session_notes' | 'check_in';
 *   data: object; // Template-specific data
 *   userName?: string; // Optional user name for preview
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, userName = 'User' } = body;

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, data' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['notification', 'reminder', 'result', 'homework', 'session_notes', 'check_in'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Render the template
    const html = await TransactionalEmailService.renderOnly({
      type,
      data,
      userName
    });

    if (!html) {
      return NextResponse.json(
        { error: 'Failed to render template' },
        { status: 500 }
      );
    }

    // Return HTML for preview
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Email preview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint with example data for easy testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'notification';

  // Example data for each type
  const exampleData: Record<string, any> = {
    notification: {
      title: 'New Message',
      message: 'You have received a new message from your therapist.',
      actionLabel: 'View Message',
      actionUrl: '#'
    },
    reminder: {
      subject: 'Appointment Reminder',
      details: 'Your therapy session is coming up.',
      date: '2025-11-25',
      time: '2:00 PM',
      location: 'Virtual Session',
      actionLabel: 'Join Session',
      actionUrl: '#'
    },
    result: {
      subject: 'Assessment Results',
      summary: 'Your weekly assessment results are ready.',
      results: [
        { label: 'Mood Score', value: '8/10', status: 'success' },
        { label: 'Sleep Quality', value: '7/10', status: 'success' },
        { label: 'Stress Level', value: '4/10', status: 'warning' }
      ],
      actionLabel: 'View Details',
      actionUrl: '#'
    },
    homework: {
      therapistName: 'Dr. Smith',
      assignmentTitle: 'Mindfulness Exercise',
      description: 'Practice the breathing technique we discussed for 10 minutes daily.',
      dueDate: '2025-11-30',
      actionLabel: 'View Assignment',
      actionUrl: '#'
    },
    session_notes: {
      therapistName: 'Dr. Smith',
      sessionDate: '2025-11-21',
      summary: 'We discussed stress management techniques.',
      keyTakeaways: ['Practice deep breathing', 'Journal daily', 'Set boundaries at work'],
      nextSessionDate: '2025-11-28',
    },
    check_in: {
      therapistName: 'Dr. Smith',
      message: 'How are you feeling this week? Please complete your check-in.',
      actionLabel: 'Complete Check-in',
      actionUrl: '#'
    }
  };

  const data = exampleData[type] || exampleData.notification;

  const html = await TransactionalEmailService.renderOnly({
    type: type as any,
    data,
    userName: 'Preview User'
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

