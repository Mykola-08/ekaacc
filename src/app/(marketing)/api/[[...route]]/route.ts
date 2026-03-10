import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { ContactFormSchema } from '@/marketing/shared/types';

const app = new Hono().basePath('/api');

const ALLOWED_ORIGINS = [
  'https://ekabalance.com',
  'https://www.ekabalance.com',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://192.168.31.121:3000'] : []),
];

// CORS middleware
app.use('*', cors({
  origin: (origin) => ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  credentials: true,
}));

// Simple in-memory rate limiter for contact form
const contactRateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 submissions per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    contactRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

/**
 * ROUTES
 */

app.post('/contact', zValidator('json', ContactFormSchema), async (c) => {
  try {
    // Rate limiting
    const clientIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return c.json({ error: 'Too many submissions. Please try again later.' }, 429);
    }

    const data = c.req.valid('json');

    // TODO: integrate with an email service or external storage
    console.log('[contact] New submission:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
      preferred_contact: data.preferred_contact || 'email',
      preferred_time: data.preferred_time,
      ts: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return c.json({ error: 'Failed to process contact form' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
