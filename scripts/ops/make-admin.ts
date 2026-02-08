import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function promoteUser(email: string) {
  console.log(`Promoting user ${email} to admin...`);

  // 1. Get User ID
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('Error fetching users:', userError.message);
    return;
  }

  const user = users.users.find((u) => u.email === email);

  if (!user) {
    console.error(`User with email ${email} not found.`);
    return;
  }

  console.log(`Found user: ${user.id}`);

  // 2. Get Admin Role ID
  const { data: roles, error: roleError } = await supabase
    .from('user_roles')
    .select('id')
    .eq('name', 'admin')
    .single();

  if (roleError || !roles) {
    console.error('Error fetching admin role:', roleError?.message);
    return;
  }

  const adminRoleId = roles.id;
  console.log(`Admin Role ID: ${adminRoleId}`);

  // 3. Assign Role
  const { error: assignError } = await supabase.from('user_role_assignments').upsert(
    {
      user_id: user.id,
      role_id: adminRoleId,
    },
    { onConflict: 'user_id, role_id' }
  );

  if (assignError) {
    console.error('Error assigning role:', assignError.message);
  } else {
    console.log(`Successfully promoted ${email} to admin!`);
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: npx ts-node scripts/make-admin.ts <email>');
  process.exit(1);
}

promoteUser(email);
