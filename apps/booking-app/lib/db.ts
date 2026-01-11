import { Pool, QueryResult, QueryResultRow } from 'pg';

// Ensure env vars are loaded in scripts/dev
if (!process.env.POSTGRES_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('dotenv').config({ path: '.env.local' });
  } catch {
    // ignore - dotenv may not be available in production
  }
}

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not defined');
}

// Pool configuration optimized for serverless environments
const poolConfig = {
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 5000, // Return error after 5s if can't connect
  maxUses: 7500, // Close & replace connection after N uses (prevents leaks)
};

// Use a global variable to prevent multiple pools in development
let pool: Pool;

declare const global: typeof globalThis & { postgresPool?: Pool };

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig);
} else {
  if (!global.postgresPool) {
    global.postgresPool = new Pool(poolConfig);
  }
  pool = global.postgresPool;
}

// Graceful shutdown handler
if (typeof process !== 'undefined') {
  process.on('SIGTERM', () => pool.end());
  process.on('SIGINT', () => pool.end());
}

export const db = {
  query: <T extends QueryResultRow = QueryResultRow>(
    text: string, 
    params?: unknown[]
  ): Promise<QueryResult<T>> => pool.query<T>(text, params),
  
  // Convenience method for single-row queries
  queryOne: async <T extends QueryResultRow = QueryResultRow>(
    text: string, 
    params?: unknown[]
  ): Promise<T | null> => {
    const result = await pool.query<T>(text, params);
    return result.rows[0] ?? null;
  },
};
