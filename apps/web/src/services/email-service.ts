import { safeResend } from '@/lib/email';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { render } from '@react-email/render';

export class EmailService {
  private static fromEmail = process.env.RESEND_FROM_EMAIL || 'Ekaacc <noreply@ekaacc.com>';

  static async sendWelcomeEmail(to: string, name: string, actionUrl: string) {
    try {
      const emailHtml = await render(WelcomeEmail({ name, actionUrl }));

      const client = safeResend();
      if (!client) {
        console.warn('Resend not configured; skipping welcome email.');
        return { success: false, skipped: true, reason: 'Resend not configured' };
      }
      const data = await client.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Welcome to Ekaacc!',
        html: emailHtml,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }
  }

  static async sendNotificationEmail(to: string, subject: string, message: string, actionUrl?: string) {
    // You can create a generic NotificationEmail template similar to WelcomeEmail
    // For now, we'll use a simple HTML structure or reuse the layout if we make it more generic
    try {
        // Placeholder for generic notification
        const client = safeResend();
        if (!client) {
          console.warn('Resend not configured; skipping notification email.');
          return { success: false, skipped: true, reason: 'Resend not configured' };
        }
        const data = await client.emails.send({
            from: this.fromEmail,
            to,
            subject,
            html: `<p>${message}</p>${actionUrl ? `<a href="${actionUrl}">View Details</a>` : ''}`,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Error sending notification email:', error);
        return { success: false, error };
    }
  }
}
