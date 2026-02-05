/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const tsFilePath = 'c:\\ekaacc\\apps\\seowebsite\\src\\lib\\platform\\config\\role-permissions.ts';
const outFilePath = 'c:\\ekaacc\\apps\\booking-app\\SUPABASE_MIGRATION_RBAC_SEED.sql';

console.log(`Reading ${tsFilePath}`);

try {
  const content = fs.readFileSync(tsFilePath, 'utf8');
  
  // Find the SYSTEM_ROLES block
  const startMarker = 'export const SYSTEM_ROLES: Record<SystemRole, RoleDefinition> = {';
  const startIndex = content.indexOf(startMarker);
  
  if (startIndex === -1) {
    console.error('Could not find SYSTEM_ROLES start');
    process.exit(1);
  }
  
  const relevantContent = content.substring(startIndex);
  
  // We will regex match role blocks.
  // RoleName: { ... permissions: [ ... ] ... }
  
  const roleNames = [
    'Admin', 'Therapist', 'Educator', 'Reception', 'Patient', 
    'VIP Patient', 'Corporate Client', 'Content Manager', 
    'Marketing', 'Accountant', 'Custom'
  ];
  
  let sql = [
    "-- Auto-generated RBAC Seed", 
    "-- Generated from role-permissions.ts",
    "DO $$",
    "DECLARE",
    "  -- vars", 
    "BEGIN",
    ""
  ];
  
  const permissionSet = new Set();
  const rolePermissionList = [];
  
  roleNames.forEach(role => {
    // Regex to find: RoleName: { ... permissions: [ (content) ]
    // Use [\s\S] for multiline match
    const regex = new RegExp(`${role}: \\{[\\s\\S]*?permissions: \\[([\\s\\S]*?)\\]`, 'm');
    const match = relevantContent.match(regex);
    
    if (match) {
      const permBlock = match[1];
      // Regex find { group: 'g', action: 'a' }
      const pRegex = /\{ group: '([^']+)', action: '([^']+)'/g;
      
      let pMatch;
      while ((pMatch = pRegex.exec(permBlock)) !== null) {
        const group = pMatch[1];
        const action = pMatch[2];
        const key = `${group}.${action}`;
        const name = `${action.replace(/_/g, ' ')} ${group.replace(/_/g, ' ')}`;
        const desc = `Allows ${action} on ${group}`;
        
        // Add to set
        if (![...permissionSet].some(p => p.key === key)) {
             permissionSet.add({ key, name, desc });
        }
        
        rolePermissionList.push({ role, key });
      }
    } else {
      console.warn(`No match for role: ${role}`);
    }
  });
  
  // Generate SQL
  sql.push("  -- 1. Insert Permissions");
  permissionSet.forEach(p => {
    sql.push(`  INSERT INTO permissions (key, name, description) VALUES ('${p.key}', '${p.name}', '${p.desc}') ON CONFLICT (key) DO NOTHING;`);
  });
  
  sql.push("");
  sql.push("  -- 2. Role Permissions");
  rolePermissionList.forEach(rp => {
     sql.push(`  INSERT INTO role_permissions (role, permission_key) VALUES ('${rp.role}', '${rp.key}') ON CONFLICT (role, permission_key) DO NOTHING;`);
  });
  
  sql.push("END $$;");
  
  fs.writeFileSync(outFilePath, sql.join('\n'));
  console.log(`Success! Wrote ${permissionSet.size} permissions and ${rolePermissionList.length} assignments to ${outFilePath}`);
  
} catch(e) {
  console.error(e);
}
