import dns from 'dns';
import { promisify } from 'util';
import { Client } from 'pg';

const resolve4 = promisify(dns.resolve4);

const projects = [
  'dopkncrqutxnchwqxloa', // From MCP
  'rbnfyxhewsivofvwdpuk'  // From original .env
];

const password = 'xDvwnz5wI5gv3vtZ';

async function checkProject(ref: string) {
  const host = `db.${ref}.supabase.co`;
  console.log(`\nChecking ${ref} (${host})...`);
  
  try {
    const ips = await resolve4(host);
    console.log(`✅ DNS FOUND! IPs: ${ips.join(', ')}`);
    
    // If DNS works, try connecting
    const connectionString = `postgres://postgres:${password}@${host}:5432/postgres`;
    const client = new Client({ 
        connectionString,
        ssl: { rejectUnauthorized: false }, // Direct usually needs simple SSL
        connectionTimeoutMillis: 5000
    });
    
    try {
        await client.connect();
        console.log("🎉 CONNECTED with password!");
        await client.end();
        return { success: true, ref, host };
    } catch (err: any) {
        console.log(`❌ Auth/Connection Failed: ${err.message}`);
        await client.end();
        // If auth fails, password might be wrong, but project is definitely alive
        return { success: false, ref, host, error: err.message };
    }

  } catch (err: any) {
    if (err.code === 'ENOTFOUND') {
        console.log("❌ DNS Lookup Failed (Project does not exist or suspended)");
    } else {
        console.log("❌ DNS Error:", err.message);
    }
  }
  return null;
}

async function main() {
    for (const p of projects) {
        const result = await checkProject(p);
        if (result && result.success) {
            console.log(`\n🏆 WINNER: Project ${result.ref} is active and password works.`);
            // Identify region by checking AWS pooler resolution maybe? 
            // Or just use direct connection in .env for now.
            process.exit(0);
        }
    }
}

main();