import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || 're_test_placeholder';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set; using placeholder key for build-time operations.');
}

const resend = new Resend(resendApiKey);

export { resend };
