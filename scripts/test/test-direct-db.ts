import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const projectRef = 'dopkncrqutxnchwqxloa';
const password = process.env.POSTGRES_PASSWORD;

if (!password) {
  console.error('No POSTGRES_PASSWORD found in .env');
  process.exit(1);
}

// DIRECT CONNECTION
// User: postgres
// Host: db.[ref].supabase.co
const connectionString = `postgres://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

console.log(`Testing Direct Connection: ${connectionString.replace(password, '****')}`);

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    await client.connect();
    console.log('✅ SUCCESS! Connected via Direct Connection.');

    // Try to get region info if possible, or just confirm it works.
    const res = await client.query('SELECT version();');
    console.log('DB Version:', res.rows[0].version);

    await client.end();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Failed Direct Connection:', err.message);
    await client.end();
    process.exit(1);
  }
}

main();
