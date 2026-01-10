import { createClient } from '@supabase/supabase-js';
import packageJson from '../package.json';

console.log('Supabase JS Version in package.json:', packageJson.dependencies['@supabase/supabase-js']);

const supabaseUrl = 'https://example.supabase.co';
const serviceKey = 'some-key';
const client = createClient(supabaseUrl, serviceKey);

console.log('Has functions namespace?', !!client.functions);
console.log('Client keys:', Object.keys(client));
