import { safeResend } from '@/lib/email';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { render } from '@react-email/render';
import { createLogger } from '@/lib/logger';
import { Result } from '@/lib/result';
import type { CreateEmailResponse } from 'resend';

const logger = createLogger({ service: 'EmailService' });

/**
 * Email service response type
 */
export interface EmailServiceResponse {
  success: boolean;
  data?: CreateEmailResponse;
  error?: Error | unknown;
  skipped?: boolean;
  reason?: string;
}

/**
 * Core email service for sending branded emails via Resend
 * 
 * Provides centralized email delivery with:
 * - Automatic error handling and logging
 * - Safe client initialization
 * - Consistent response format
 * - Template rendering
 * 
 * @example
 * ```typescript
 * const result = await EmailService.sendWelcomeEmail(
 *   'user@example.com',
 *   'John Doe',
 *   'https://app.ekaacc.com/dashboard'
 * );
 * 
 * if (result.success) {
 *   console.log('Email sent:', result.data?.id);
 * } else {
 *   console.error('Email failed:', result.error);
 * }
 * ```
 */
export class EmailService {
  private static readonly FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Ekaacc <noreply@ekaacc.com>';
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY_MS = 1000;

  /**
   * Send a welcome email to new users
   * 
   * @param to - Recipient email address
   * @param name - User's display name
   * @param actionUrl - URL for the call-to-action button
   * @returns Promise<EmailServiceResponse> - Result of the send operation
   */
  static async sendWelcomeEmail(
    to: string,
    name: string,
    actionUrl: string
  ): Promise<EmailServiceResponse> {
    try {
      // Validate inputs
      if (!to || !this.isValidEmail(to)) {
        throw new Error(`Invalid email address: ${to}`);
      }

      // Render template
      const emailHtml = await render(WelcomeEmail({ name, actionUrl }));

      // Send email
      return await this.sendEmailWithRetry({
        from: this.FROM_EMAIL,
        to,
        subject: 'Welcome to Ekaacc!',
        html: emailHtml,
      });
    } catch (error) {
      logger.error('Error sending welcome email', { error, to });
      return { success: false, error };
    }
  }

  /**
   * Send a generic notification email
   * 
   * @param to - Recipient email address
   * @param subject - Email subject line
   * @param message - Email message body
   * @param actionUrl - Optional URL for action button
   * @returns Promise<EmailServiceResponse> - Result of the send operation
   */
  static async sendNotificationEmail(
    to: string,
    subject: string,
    message: string,
    actionUrl?: string
  ): Promise<EmailServiceResponse> {
    try {
      // Validate inputs
      if (!to || !this.isValidEmail(to)) {
        throw new Error(`Invalid email address: ${to}`);
      }

      // Build simple HTML email
      const html = this.buildNotificationHtml(message, actionUrl);

      // Send email
      return await this.sendEmailWithRetry({
        from: this.FROM_EMAIL,
        to,
        subject,
        html,
      });
    } catch (error) {
      logger.error('Error sending notification email', { error, to, subject });
      return { success: false, error };
    }
  }

  /**
   * Send email with retry logic
   * 
   * @private
   * @param params - Email parameters
   * @returns Promise<EmailServiceResponse>
   */
  private static async sendEmailWithRetry(
    params: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }
  ): Promise<EmailServiceResponse> {
    const client = safeResend();
    if (!client) {
      logger.warn('Resend not configured; skipping email');
      return { 
        success: false, 
        skipped: true, 
        reason: 'Resend not configured' 
      };
    }

    let lastError: unknown;
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const data = await client.emails.send(params);
        logger.info('Email sent successfully', { 
          to: params.to, 
          subject: params.subject,
          attempt 
        });
        return { success: true, data };
      } catch (error) {
        lastError = error;
        logger.warn(`Email send attempt ${attempt} failed`, { 
          error, 
          to: params.to,
          willRetry: attempt < this.MAX_RETRIES 
        });
        
        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY_MS * attempt);
        }
      }
    }

    return { success: false, error: lastError };
  }

  /**
   * Build HTML for notification email
   * 
   * @private
   * @param message - Email message
   * @param actionUrl - Optional action URL
   * @returns HTML string
   */
  private static buildNotificationHtml(message: string, actionUrl?: string): string {
    const escapedMessage = this.escapeHtml(message);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <p style="margin: 0 0 20px 0; font-size: 16px;">${escapedMessage}</p>
            ${actionUrl ? `
              <a href="${this.escapeHtml(actionUrl)}" 
                 style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500;">
                View Details
              </a>
            ` : ''}
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Validate email address format
   * 
   * @private
   * @param email - Email to validate
   * @returns boolean
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Escape HTML special characters
   * 
   * @private
   * @param text - Text to escape
   * @returns Escaped text
   */
  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (char) => map[char] || char);
  }

  /**
   * Delay helper for retry logic
   * 
   * @private
   * @param ms - Milliseconds to delay
   * @returns Promise<void>
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
