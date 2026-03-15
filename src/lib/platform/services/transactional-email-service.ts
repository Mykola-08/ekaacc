import { getResend } from '@/lib/platform/services/email-client';
import { supabaseAdmin } from '@/lib/platform/supabase';

export type TransactionalEmailType =
  | 'notification'
  | 'reminder'
  | 'result'
  | 'homework'
  | 'session_notes'
  | 'check_in';

export interface SendEmailOptions {
  userId: string;
  type: TransactionalEmailType;
  subject?: string;
  data: Record<string, unknown>;
  force?: boolean;
}

export interface RenderOptions {
  type: TransactionalEmailType;
  data: Record<string, unknown>;
  userName?: string;
}

export interface EmailResult {
  success: boolean;
  error?: unknown;
  data?: unknown;
}

export class TransactionalEmailService {
  private static async getUserEmail(
    userId: string
  ): Promise<{ email: string; name?: string } | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (error || !user || !user.email) {
        console.error('Failed to find user email', error);
        return null;
      }

      return {
        email: user.email,
        name: user.user_metadata?.name as string | undefined,
      };
    } catch {
      console.warn('Failed to get user email');
      return null;
    }
  }

  static async send({
    userId,
    type,
    subject,
    data,
    force,
  }: SendEmailOptions): Promise<EmailResult> {
    try {
      const user = await this.getUserEmail(userId);
      if (!user) {
        return { success: false, error: 'User not found or email missing' };
      }

      const resend = getResend();
      const html = await this.renderOnly({ type, data, userName: user.name });

      if (!html) {
        return { success: false, error: 'Failed to render email template' };
      }

      const { error } = await resend.emails.send({
        from: process.env.EMAIL_SENDER || 'Eka Balance <hello@ekabalance.com>', // Update with production domain in env
        to: [user.email],
        subject: subject || `New ${type} from your therapist`,
        html: html,
      });

      if (error) {
        console.error('Error sending transactional email:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception sending transactional email:', error);
      return { success: false, error };
    }
  }

  static async renderOnly({ type, data, userName }: RenderOptions): Promise<string | null> {
    // Basic template rendering
    // In a real app, this would use React Email or comprehensive HTML templates

    const title = type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>${title}</h1>
        ${userName ? `<p>Hi ${userName},</p>` : ''}
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          ${Object.entries(data)
            .map(
              ([key, value]) => `
            <div style="margin-bottom: 10px;">
              <strong>${key}:</strong> <pre>${JSON.stringify(value, null, 2)}</pre>
            </div>
          `
            )
            .join('')}
        </div>
        
        <p>This is an automated message from Eka.</p>
      </div>
    `;
  }
}

/**
 * Send a welcome email with a verification link.
 * @param to Recipient email
 * @param name Recipient name
 * @param verifyUrl Verification URL
 */
export async function sendWelcomeEmail(to: string, name: string, verifyUrl: string): Promise<any> {
  try {
    const resend = getResend();

    const { data, error } = await resend.emails.send({
      from: 'Eka Balance <hello@ekabalance.com>',
      to,
      subject: 'Welcome to Eka Platform',
      html: `<p>Hi ${name}!</p><p>Welcome to Eka.</p><a href="${verifyUrl}">Verify Email</a>`,
    });

    return { success: !error, error, data };
  } catch (error) {
    console.error('Send welcome email error:', error);
    return { success: false, error };
  }
}
