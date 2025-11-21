import { TransactionalEmailService } from '@/services/transactional-email-service';
import { EmailIntegrationService } from '@/services/email-integration-service';
import { BroadcastService } from '@/services/broadcast-service';

/**
 * Test script for Resend email integration
 * Run with: npx tsx scripts/test-resend-emails.ts
 */

// Test user ID - replace with a real user ID from your database
const TEST_USER_ID = 'test-user-id';
const TEST_EMAIL = 'test@example.com';
const TEST_NAME = 'Test User';

async function testTransactionalEmails() {
  console.log('🧪 Testing Transactional Emails...\n');

  // 1. Test Notification Email
  console.log('1. Testing notification email...');
  await TransactionalEmailService.send({
    userId: TEST_USER_ID,
    type: 'notification',
    subject: 'Test Notification',
    data: {
      title: 'New Message',
      message: 'This is a test notification from your therapist.',
      actionLabel: 'View Message',
      actionUrl: 'https://example.com/messages'
    }
  });
  console.log('✓ Notification email queued\n');

  // 2. Test Reminder Email
  console.log('2. Testing reminder email...');
  await TransactionalEmailService.send({
    userId: TEST_USER_ID,
    type: 'reminder',
    subject: 'Test Appointment Reminder',
    data: {
      details: 'Your therapy session is coming up.',
      date: '2025-11-25',
      time: '2:00 PM',
      location: 'Virtual Meeting',
      actionLabel: 'Join Session',
      actionUrl: 'https://zoom.us/j/example'
    }
  });
  console.log('✓ Reminder email queued\n');

  // 3. Test Result Email
  console.log('3. Testing result email...');
  await TransactionalEmailService.send({
    userId: TEST_USER_ID,
    type: 'result',
    subject: 'Test Assessment Results',
    data: {
      summary: 'Your weekly assessment is complete.',
      results: [
        { label: 'Mood Score', value: '8/10', status: 'success' },
        { label: 'Sleep Quality', value: '7/10', status: 'success' },
        { label: 'Stress Level', value: '4/10', status: 'warning' }
      ],
      actionLabel: 'View Details',
      actionUrl: 'https://example.com/results'
    }
  });
  console.log('✓ Result email queued\n');

  // 4. Test Homework Email
  console.log('4. Testing homework email...');
  await TransactionalEmailService.send({
    userId: TEST_USER_ID,
    type: 'homework',
    subject: 'New Homework Assignment',
    data: {
      therapistName: 'Dr. Smith',
      assignmentTitle: 'Mindfulness Practice',
      description: 'Practice deep breathing for 10 minutes daily.',
      dueDate: '2025-11-30',
      actionLabel: 'View Assignment',
      actionUrl: 'https://example.com/homework'
    }
  });
  console.log('✓ Homework email queued\n');

  // 5. Test Session Notes Email
  console.log('5. Testing session notes email...');
  await TransactionalEmailService.send({
    userId: TEST_USER_ID,
    type: 'session_notes',
    subject: 'Your Session Notes',
    data: {
      therapistName: 'Dr. Smith',
      sessionDate: '2025-11-21',
      summary: 'We discussed stress management and coping strategies.',
      keyTakeaways: [
        'Practice deep breathing exercises',
        'Journal daily thoughts',
        'Set work boundaries'
      ],
      nextSessionDate: '2025-11-28'
    }
  });
  console.log('✓ Session notes email queued\n');

  // 6. Test Check-in Email
  console.log('6. Testing check-in email...');
  await TransactionalEmailService.send({
    userId: TEST_USER_ID,
    type: 'check_in',
    subject: 'Weekly Check-in',
    data: {
      therapistName: 'Dr. Smith',
      message: 'How are you feeling this week? Please complete your check-in.',
      actionLabel: 'Complete Check-in',
      actionUrl: 'https://example.com/check-in'
    }
  });
  console.log('✓ Check-in email queued\n');
}

async function testIntegrationEmails() {
  console.log('🧪 Testing Integration Emails...\n');

  // 1. Test Booking Confirmation
  console.log('1. Testing booking confirmation...');
  await EmailIntegrationService.sendBookingConfirmation(TEST_USER_ID, {
    serviceName: 'Initial Consultation',
    date: '2025-11-25',
    time: '2:00 PM',
    location: 'Online',
    therapistName: 'Dr. Smith'
  });
  console.log('✓ Booking confirmation queued\n');

  // 2. Test Appointment Reminder
  console.log('2. Testing appointment reminder...');
  await EmailIntegrationService.sendAppointmentReminder(TEST_USER_ID, {
    serviceName: 'Therapy Session',
    date: '2025-11-25',
    time: '2:00 PM',
    location: 'Zoom',
    therapistName: 'Dr. Smith',
    meetingUrl: 'https://zoom.us/j/example'
  });
  console.log('✓ Appointment reminder queued\n');

  // 3. Test Session Notes
  console.log('3. Testing session notes with homework...');
  await EmailIntegrationService.sendSessionNotes(TEST_USER_ID, {
    therapistName: 'Dr. Smith',
    sessionDate: '2025-11-21',
    summary: 'We discussed coping strategies for stress.',
    keyTakeaways: ['Practice mindfulness', 'Journal daily', 'Set boundaries'],
    nextSessionDate: '2025-11-28',
    homeworkAssignment: {
      title: 'Daily Mindfulness',
      description: 'Practice 10 minutes of mindfulness meditation daily.',
      dueDate: '2025-11-28'
    }
  });
  console.log('✓ Session notes and homework queued\n');

  // 4. Test Payment Confirmation
  console.log('4. Testing payment confirmation...');
  await EmailIntegrationService.sendPaymentConfirmation(TEST_USER_ID, {
    amount: 150.00,
    currency: 'USD',
    serviceName: 'Therapy Session',
    paymentMethod: 'Credit Card',
    receiptUrl: 'https://example.com/receipt/123'
  });
  console.log('✓ Payment confirmation queued\n');

  // 5. Test Assessment Results
  console.log('5. Testing assessment results...');
  await EmailIntegrationService.sendAssessmentResults(TEST_USER_ID, {
    title: 'Weekly Wellness Assessment',
    summary: 'Your scores show improvement this week!',
    scores: [
      { label: 'Overall Mood', value: '8/10', status: 'success' },
      { label: 'Energy Level', value: '7/10', status: 'success' },
      { label: 'Stress Level', value: '5/10', status: 'warning' }
    ]
  });
  console.log('✓ Assessment results queued\n');
}

async function testPreview() {
  console.log('🎨 Testing Email Preview...\n');
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  console.log('Preview URLs (open in browser):');
  console.log(`- Notification: ${appUrl}/api/email/preview?type=notification`);
  console.log(`- Reminder: ${appUrl}/api/email/preview?type=reminder`);
  console.log(`- Result: ${appUrl}/api/email/preview?type=result`);
  console.log(`- Homework: ${appUrl}/api/email/preview?type=homework`);
  console.log(`- Session Notes: ${appUrl}/api/email/preview?type=session_notes`);
  console.log(`- Check-in: ${appUrl}/api/email/preview?type=check_in\n`);
}

async function main() {
  console.log('🚀 Starting Resend Email Tests\n');
  console.log('================================================\n');

  // Check environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    process.exit(1);
  }

  console.log('✓ RESEND_API_KEY found\n');
  console.log('================================================\n');

  try {
    // Show preview URLs
    await testPreview();
    
    console.log('================================================\n');
    
    // Run transactional email tests
    await testTransactionalEmails();
    
    console.log('================================================\n');
    
    // Run integration email tests
    await testIntegrationEmails();
    
    console.log('================================================\n');
    console.log('✅ All tests completed!\n');
    console.log('Check your email inbox (or Resend dashboard) to verify delivery.\n');
    console.log('Note: Some emails may not send if user preferences block them.');
    console.log('Use force: true option to override preferences for critical emails.\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  main();
}

export { testTransactionalEmails, testIntegrationEmails, testPreview };
