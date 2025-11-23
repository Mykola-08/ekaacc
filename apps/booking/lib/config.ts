import { supabaseServer } from '@/lib/supabaseServerClient';

type ConfigCache = { [k: string]: string };
const cache: ConfigCache = {};
let lastLoad = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

export async function getConfig(key: string): Promise<string | undefined> {
  const now = Date.now();
  if (cache[key] && now - lastLoad < CACHE_TTL_MS) return cache[key];
  const { data, error } = await supabaseServer
    .from('app_config')
    .select('key,value')
    .eq('key', key)
    .single();
  if (error) return undefined;
  cache[key] = data.value;
  lastLoad = now;
  return data.value;
}

export async function getBookingTokenSecret() {
  return (await getConfig('BOOKING_TOKEN_SECRET')) || process.env.BOOKING_TOKEN_SECRET || 'fallback-insecure';
}

export async function getStripeSecretKey() {
  return (await getConfig('STRIPE_SECRET_KEY')) || process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
}

export async function getStripeWebhookSecret() {
  return (await getConfig('STRIPE_WEBHOOK_SECRET')) || process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';
}
