import { EmailService } from './email-service';
import { TransactionalEmailService } from './transactional-email-service';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Integration service for sending emails on various user events
 */
export class EmailIntegrationService {
  
  /**
   * Send welcome email on user registration
   */
  static async sendRegistrationEmail(userId: string, email: string, name: string) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const actionUrl = `${appUrl}/dashboard`;
      
      await EmailService.sendWelcomeEmail(email, name, actionUrl);
      
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send registration email:', error);
    }
  }

  /**
   * Send booking confirmation email
   */
  static async sendBookingConfirmation(
    userId: string,
    bookingDetails: {
      serviceName: string;
      date: string;
      time: string;
      location: string;
      therapistName?: string;
    }
  ) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('email, raw_user_meta_data')
        .eq('id', userId)
        .single();

      if (!user?.email) return;

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const userName = user.raw_user_meta_data?.name || 'User';

      await TransactionalEmailService.send({
        userId,
        type: 'reminder',
        subject: `Booking Confirmed: ${bookingDetails.serviceName}`,
        data: {
          details: `Your ${bookingDetails.serviceName} booking has been confirmed.`,
          date: bookingDetails.date,
          time: bookingDetails.time,
          location: bookingDetails.location,
          actionLabel: 'View Booking',
          actionUrl: `${appUrl}/bookings`
        }
      });

      console.log(`Booking confirmation sent to ${user.email}`);
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
    }
  }

  /**
   * Send appointment reminder (24 hours before)
   */
  static async sendAppointmentReminder(
    userId: string,
    appointmentDetails: {
      serviceName: string;
      date: string;
      time: string;
      location: string;
      therapistName?: string;
      meetingUrl?: string;
    }
  ) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      await TransactionalEmailService.send({
        userId,
        type: 'reminder',
        subject: 'Appointment Reminder',
        data: {
          details: `Reminder: You have an appointment for ${appointmentDetails.serviceName}`,
          date: appointmentDetails.date,
          time: appointmentDetails.time,
          location: appointmentDetails.location,
          actionLabel: appointmentDetails.meetingUrl ? 'Join Meeting' : 'View Details',
          actionUrl: appointmentDetails.meetingUrl || `${appUrl}/bookings`
        }
      });

      console.log(`Appointment reminder sent for user ${userId}`);
    } catch (error) {
      console.error('Failed to send appointment reminder:', error);
    }
  }

  /**
   * Send session notes to client after therapy session
   */
  static async sendSessionNotes(
    userId: string,
    sessionData: {
      therapistName: string;
      sessionDate: string;
      summary: string;
      keyTakeaways: string[];
      nextSessionDate?: string;
      homeworkAssignment?: {
        title: string;
        description: string;
        dueDate: string;
      };
    }
  ) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      // Send session notes email
      await TransactionalEmailService.send({
        userId,
        type: 'session_notes',
        subject: 'Your Session Notes',
        data: {
          therapistName: sessionData.therapistName,
          sessionDate: sessionData.sessionDate,
          summary: sessionData.summary,
          keyTakeaways: sessionData.keyTakeaways,
          nextSessionDate: sessionData.nextSessionDate
        }
      });

      // If there's homework, send a separate homework email
      if (sessionData.homeworkAssignment) {
        await TransactionalEmailService.send({
          userId,
          type: 'homework',
          subject: 'New Homework Assignment',
          data: {
            therapistName: sessionData.therapistName,
            assignmentTitle: sessionData.homeworkAssignment.title,
            description: sessionData.homeworkAssignment.description,
            dueDate: sessionData.homeworkAssignment.dueDate,
            actionLabel: 'View Assignment',
            actionUrl: `${appUrl}/homework`
          }
        });
      }

      console.log(`Session notes sent for user ${userId}`);
    } catch (error) {
      console.error('Failed to send session notes:', error);
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

      // Using notification email template for password reset
      const { data: user } = await supabase
        .from('users')
        .select('id, raw_user_meta_data')
        .eq('email', email)
        .single();

      if (!user) return;

      const userName = user.raw_user_meta_data?.name || 'User';

      await TransactionalEmailService.send({
        userId: user.id,
        type: 'notification',
        subject: 'Password Reset Request',
        data: {
          title: 'Password Reset',
          message: 'You requested to reset your password. Click the button below to create a new password. This link will expire in 1 hour.',
          actionLabel: 'Reset Password',
          actionUrl: resetUrl
        },
        force: true // Password resets should always be sent
      });

      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  /**
   * Send payment confirmation email
   */
  static async sendPaymentConfirmation(
    userId: string,
    paymentDetails: {
      amount: number;
      currency: string;
      serviceName: string;
      paymentMethod: string;
      receiptUrl?: string;
    }
  ) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      await TransactionalEmailService.send({
        userId,
        type: 'notification',
        subject: 'Payment Confirmation',
        data: {
          title: 'Payment Received',
          message: `Your payment of ${paymentDetails.currency} ${paymentDetails.amount} for ${paymentDetails.serviceName} has been processed successfully.`,
          actionLabel: 'View Receipt',
          actionUrl: paymentDetails.receiptUrl || `${appUrl}/billing`
        }
      });

      console.log(`Payment confirmation sent for user ${userId}`);
    } catch (error) {
      console.error('Failed to send payment confirmation:', error);
    }
  }

  /**
   * Send weekly check-in reminder
   */
  static async sendWeeklyCheckIn(userId: string, therapistName: string) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      await TransactionalEmailService.send({
        userId,
        type: 'check_in',
        subject: 'Weekly Check-in',
        data: {
          therapistName,
          message: 'It\'s time for your weekly check-in. Let us know how you\'re feeling.',
          actionLabel: 'Complete Check-in',
          actionUrl: `${appUrl}/check-in`
        }
      });

      console.log(`Weekly check-in sent for user ${userId}`);
    } catch (error) {
      console.error('Failed to send weekly check-in:', error);
    }
  }

  /**
   * Send assessment results
   */
  static async sendAssessmentResults(
    userId: string,
    results: {
      title: string;
      summary: string;
      scores: Array<{ label: string; value: string; status: 'success' | 'warning' | 'error' }>;
    }
  ) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      await TransactionalEmailService.send({
        userId,
        type: 'result',
        subject: results.title,
        data: {
          summary: results.summary,
          results: results.scores,
          actionLabel: 'View Full Results',
          actionUrl: `${appUrl}/assessments`
        }
      });

      console.log(`Assessment results sent for user ${userId}`);
    } catch (error) {
      console.error('Failed to send assessment results:', error);
    }
  }
}
