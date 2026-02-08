import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Explicitly load the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Use connection string from env or construct one.
// Try postgres (no suffix) on the pooler host from env
const host = process.env.POSTGRES_HOST; // aws-1-eu-west-3.pooler.supabase.com
const password = process.env.POSTGRES_PASSWORD;
let connectionString = `postgres://postgres:${password}@${host}:5432/postgres`;

console.log('Using Connection String:', connectionString.replace(/:[^:@]+@/, ':****@'));

// Remove sslmode from query params to avoid conflicts with manual ssl config
connectionString = connectionString.replace(/[?&]sslmode=[^&]+/, '');

async function applyMigration() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }, // Needed for some supabase connections
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const migrationPath = path.resolve(
      process.cwd(),
      'supabase/migrations/20260117000004_add_missing_fk_indexes.sql'
    );
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log(`Applying migration: ${migrationPath}`);
    await client.query(sql);
    console.log('Migration applied successfully.');
  } catch (err) {
    console.error('Error executing migration:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
