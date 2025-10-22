import { SquareClient, SquareEnvironment } from 'square';

/**
 * Lightweight server-side Square client wrapper.
 * - Reads configuration from environment variables:
 *   - SQUARE_ACCESS_TOKEN (required)
 *   - SQUARE_ENV (optional, 'Production' or 'Sandbox')
 *
 * Exported helpers are intentionally small and testable. For any
 * production usage consider adding retries, rate limit handling,
 * and stricter typing.
 */

const token = process.env.SQUARE_ACCESS_TOKEN;
const envName = process.env.SQUARE_ENV || 'Sandbox';

if (!token) {
  // We keep this module import-safe in environments without a token,
  // but consumers should expect methods to throw when the token is missing.
  // Do not crash at import time to keep serverless deployments flexible.
  console.warn('SQUARE_ACCESS_TOKEN not set; Square client will not be able to make requests.');
}

function getClient(): SquareClient {
  const env = envName === 'Production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox;
  return new SquareClient({
    environment: env,
    token: token ? () => ({ type: 'bearer', token }) : undefined,
  } as any);
}

export async function listBookings(limit = 20) {
  if (!token) throw new Error('SQUARE_ACCESS_TOKEN not configured');
  const client = getClient();
  // SDK v43 uses resource clients on the client instance
  const res = await client.bookings.list({});
  // Page wrapper -> items
  // The SDK returns a Page<T> which has items in .items
  // Keep it defensive in case of shape differences.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page: any = res as any;
  return page?.items ?? [];
}

export async function findCustomerByEmail(email: string) {
  if (!token) throw new Error('SQUARE_ACCESS_TOKEN not configured');
  const client = getClient();
  const resp = await client.customers.search({
    query: { filter: { emailAddress: { exact: email } } },
  } as any);
  // SDK returns results in .customers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = resp as any;
  return (body?.customers && body.customers[0]) || null;
}

export async function createPayment(body: any) {
  if (!token) throw new Error('SQUARE_ACCESS_TOKEN not configured');
  const client = getClient();
  const res = await client.payments.create(body as any);
  return res;
}

export default {
  listBookings,
  findCustomerByEmail,
  createPayment,
};
