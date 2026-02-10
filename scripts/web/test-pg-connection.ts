
import { db } from '../../src/lib/db';

async function testConnection() {
  console.log('Testing PG connection...');
  try {
    const res = await db.query('SELECT NOW() as now');
    console.log('Connection successful:', res.rows[0]);
    process.exit(0);
  } catch (err: any) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

testConnection();
