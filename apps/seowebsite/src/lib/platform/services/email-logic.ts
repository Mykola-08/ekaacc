export class EmailService { 
  static async send(args: any) { return { success: true }; } 
  static async sendWelcomeEmail(email: string, name: string, verifyUrl: string) {
    console.log(`Sending welcome email to ${email} with link ${verifyUrl}`);
    return { success: true, error: undefined };
  }
}