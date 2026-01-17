import { Client } from 'pg';

const projects = [
    { ref: 'dopkncrqutxnchwqxloa', region: 'eu-west-3' }, // New project (Paris?)
    { ref: 'dopkncrqutxnchwqxloa', region: 'eu-west-3' }, // Old project (Paris)
];
const password = 'xDvwnz5wI5gv3vtZ';

async function check(project: {ref: string, region: string}) {
    // Try Pooler
    const host = `aws-0-${project.region}.pooler.supabase.com`;
    const cs = `postgres://postgres.${project.ref}:${password}@${host}:6543/postgres?sslmode=require`;
    console.log(`Checking ${project.ref} in ${project.region}...`);
    
    const client = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log(`✅ SUCCESS on ${project.ref}!`);
        await client.end();
        return true;
    } catch (err: any) {
        console.log(`❌ Failed ${project.ref}: ${err.message}`);
        await client.end();
        return false;
    }
}

async function main() {
    for (const p of projects) {
        await check(p);
    }
}

main();