import { getResend } from '@/lib/platform/email';

export interface EmailResult {
  success: boolean;
  error?: any;
}

export class EmailService {
  /**
   * Send a welcome email with a verification link.
   * @param to Recipient email
   * @param name Recipient name
   * @param verifyUrl Verification URL
   */
  static async sendWelcomeEmail(to: string, name: string, verifyUrl: string): Promise<EmailResult> {
    try {
      const resend = getResend();
      
      const { data, error } = await resend.emails.send({
        from: 'Eka <onboarding@resend.dev>', // TODO: Update with production sender
        to: [to],
        subject: 'Welcome to Eka - Verify your email',
        html: `
          <div>
            <h1>Welcome, ${name}!</h1>
            <p>Thank you for joining Eka. Please verify your email by clicking the link below:</p>
            <p><a href="${verifyUrl}">Verify Email</a></p>
            <p>If you didn't create this account, you can safely ignore this email.</p>
          </div>
        `,
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception sending welcome email:', error);
      return { success: false, error };
    }
  }
}
