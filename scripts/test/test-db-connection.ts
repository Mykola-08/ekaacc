import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const projectRef = process.env.POSTGRES_USER?.split('.')[1] || 'dopkncrqutxnchwqxloa';
const password = process.env.POSTGRES_PASSWORD;

if (!password) {
  console.error('No POSTGRES_PASSWORD found in .env');
  process.exit(1);
}

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'sa-east-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'eu-north-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
];

async function checkRegion(region: string) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const connectionString = `postgres://postgres.${projectRef}:${password}@${host}:6543/postgres?sslmode=require&pgbouncer=true`; // Removed &pgbouncer=true for raw test sometimes, but pooler needs it usually.

  // Note: Supabase poolers on port 6543 usually require sslmode=require.

  console.log(`Testing region: ${region} (${host})...`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Bypass self-signed cert issue for testing
  });

  try {
    await client.connect();
    console.log(`✅ SUCCESS! Correct region is: ${region}`);
    const res = await client.query('SELECT NOW()');
    console.log('Time from DB:', res.rows[0]);
    await client.end();
    return region;
  } catch (err: any) {
    await client.end();
    if (
      err.code === 'XX000' &&
      (err.message?.includes('Tenant or user not found') || err.message?.includes('auth failed'))
    ) {
      // Auth failed or tenant not found = Wrong Region usually for poolers
      console.log(`❌ Failed ${region}: ${err.message}`);
    } else if (err.code === 'ENOTFOUND') {
      console.log(`❌ Failed ${region}: Host not found`);
    } else {
      console.log(`❌ Failed ${region}:`, err.message);
    }
    return null;
  }
}

async function main() {
  console.log(`Testing project ref: ${projectRef}`);

  for (const region of regions) {
    const result = await checkRegion(region);
    if (result) {
      console.log(`\n🎉 FOUND IT! The correct region is: ${result}`);
      console.log(
        `Update your .env files with: POSTGRES_HOST="aws-0-${result}.pooler.supabase.com"`
      );
      process.exit(0);
    }
  }
  console.error('\n❌ Could not find the correct region in the common list.');
  process.exit(1);
}

main();
