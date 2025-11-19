import { resend } from '@/lib/email';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { render } from '@react-email/render';

export class EmailService {
  private static fromEmail = 'Ekaacc <onboarding@resend.dev>'; // Update this with your verified domain

  static async sendWelcomeEmail(to: string, name: string, actionUrl: string) {
    try {
      const emailHtml = await render(WelcomeEmail({ name, actionUrl }));

      const data = await resend.emails.send({
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
        const data = await resend.emails.send({
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
