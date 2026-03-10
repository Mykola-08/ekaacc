#!/usr/bin/env node
/**
 * Supabase Local Emulator Setup Script
 *
 * Prerequisites: Docker Desktop must be running.
 *
 * Usage:
 *   npx tsx scripts/supabase-local-setup.ts          # Start emulator
 *   npx tsx scripts/supabase-local-setup.ts --reset   # Reset DB & rerun migrations + seeds
 *   npx tsx scripts/supabase-local-setup.ts --stop    # Stop emulator
 */

import { execSync } from 'child_process';

const args = process.argv.slice(2);
const isReset = args.includes('--reset');
const isStop = args.includes('--stop');

function run(cmd: string, label: string) {
  console.log(`\n▶ ${label}`);
  console.log(`  $ ${cmd}\n`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
  } catch {
    console.error(`\n✖ Failed: ${label}`);
    process.exit(1);
  }
}

function checkDocker() {
  try {
    execSync('docker info', { stdio: 'ignore' });
  } catch {
    console.error(
      '\n✖ Docker is not running.\n' +
        '  Please install and start Docker Desktop first:\n' +
        '  https://www.docker.com/products/docker-desktop\n'
    );
    process.exit(1);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

console.log('╔════════════════════════════════════════════════╗');
console.log('║   EKA Account — Supabase Local Emulator       ║');
console.log('╚════════════════════════════════════════════════╝');

if (isStop) {
  run('npx supabase stop', 'Stopping Supabase emulator...');
  console.log('\n✔ Supabase emulator stopped.');
  process.exit(0);
}

checkDocker();

if (isReset) {
  run('npx supabase db reset', 'Resetting database (migrations + seed)...');
  console.log('\n✔ Database reset complete.');
} else {
  run('npx supabase start', 'Starting Supabase emulator...');

  console.log('\n✔ Supabase emulator is running!\n');
  console.log('  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │ Service              │ URL                               │');
  console.log('  ├──────────────────────┼───────────────────────────────────┤');
  console.log('  │ API (PostgREST)      │ http://127.0.0.1:54321           │');
  console.log('  │ Database (Postgres)  │ postgresql://postgres:postgres@   │');
  console.log('  │                      │   127.0.0.1:54322/postgres       │');
  console.log('  │ Studio               │ http://127.0.0.1:54323           │');
  console.log('  │ Inbucket (Email)     │ http://127.0.0.1:54324           │');
  console.log('  └──────────────────────┴───────────────────────────────────┘');
  console.log('');
  console.log('  Your .env.local is pre-configured for these local endpoints.');
  console.log('  Run `npm run dev` to start the app.\n');
}
