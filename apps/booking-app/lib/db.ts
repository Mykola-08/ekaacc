import { Pool } from 'pg';

// Ensure env vars are loaded in scripts/dev
if (!process.env.POSTGRES_URL) {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    // ignore
  }
}

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not defined');
}

// Use a global variable to prevent multiple pools in development
let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } // Supabase requires this for some reason or self-signed certs
  });
} else {
  if (!(global as any).postgresPool) {
    (global as any).postgresPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }
  pool = (global as any).postgresPool;
}

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
