import re
import os

ts_file_path = r'c:\ekaacc\apps\seowebsite\src\lib\platform\config\role-permissions.ts'
output_sql_path = r'c:\ekaacc\apps\booking-app\SUPABASE_MIGRATION_RBAC_SEED.sql'

print(f"Reading from {ts_file_path}")

try:
    with open(ts_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
except Exception as e:
    print(f"Error reading file: {e}")
    exit(1)

# Extract SYSTEM_ROLES block
roles_block_match = re.search(r'export const SYSTEM_ROLES: Record<SystemRole, RoleDefinition> = \{(.*?)\};', content, re.DOTALL)
if not roles_block_match:
    print("Could not find SYSTEM_ROLES block via regex.")
    # Fallback: Look for "Admin: {"
    start_idx = content.find("export const SYSTEM_ROLES")
    if start_idx == -1:
         print("Really cant find definitions.")
         exit(1)
    roles_data = content[start_idx:]
else:
    roles_data = roles_block_match.group(1)

print("Found roles definitions block. Parsing...")

sql_statements = [
    "-- Auto-generated RBAC Seed Migration",
    "-- Generated from role-permissions.ts",
    "",
    "DO $$",
    "DECLARE",
    "  -- vars",
    "BEGIN",
    "  -- 1. Insert Permissions"
]

unique_permissions = set()
role_permissions = []

# Naive parser: split by "permissions: ["
parts = roles_data.split('permissions: [')
# The first part is garbage or the Role Name of the first item
# The subsequent parts start with permission objects ] and then the Next Role Name

# Let's find role names
# We search for "RoleName: {"
role_names_matches = list(re.finditer(r"([A-Za-z0-9 ]+): \s*\{", roles_data))

current_role = None
if role_names_matches:
    current_role = role_names_matches[0].group(1)

# This regex finds "group: 'x', action: 'y'"
perm_pattern = re.compile(r"group: '([^']+)',\s*action: '([^']+)'")

# We iterate over the file looking for Role definitions and their permissions
# Hard to do with single regex. Let's iterate line by line?
# Or strict block matching.

# Let's try finding all roles first
roles_list = ['Admin', 'Therapist', 'Educator', 'Reception', 'Patient', 'VIP Patient', 'Corporate Client', 'Content Manager', 'Marketing', 'Accountant', 'Custom']

for role in roles_list:
    # Find the block for this role
    # RoleName: { ... permissions: [ ... ] ... }
    # CAUTION: 'Custom' might be last.
    
    # Regex for specific role block
    # Start with "RoleName: {" lookahead for "permissions: ["
    
    # We look for "RoleName: {" ... "permissions: [" ... "]"
    
    role_regex = re.compile(rf"{role}: \s*\{{.*?permissions: \[(.*?)\]", re.DOTALL)
    match = role_regex.search(roles_data)
    
    if match:
        perms_str = match.group(1)
        # Parse permissions
        for pm in perm_pattern.finditer(perms_str):
            group = pm.group(1)
            action = pm.group(2)
            
            key = f"{group}.{action}"
            name = f"{action.replace('_', ' ').title()} {group.replace('_', ' ').title()}"
            description = f"Allows {action} on {group}"
            
            unique_permissions.add((key, name, description))
            role_permissions.append((role, key))
            
    else:
        print(f"Warning: Could not parse block for role {role}")

# Generate SQL
sql_statements.append("")
for key, name, desc in sorted(list(unique_permissions)):
    sql_statements.append(f"  INSERT INTO permissions (key, name, description) VALUES ('{key}', '{name}', '{desc}') ON CONFLICT (key) DO NOTHING;")

sql_statements.append("")
sql_statements.append("  -- 2. Insert Role Permissions")

for role, key in role_permissions:
    sql_statements.append(f"  INSERT INTO role_permissions (role, permission_key) VALUES ('{role}', '{key}') ON CONFLICT (role, permission_key) DO NOTHING;")

sql_statements.append("END $$;")

with open(output_sql_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_statements))

print(f"Success. Wrote {len(unique_permissions)} permissions and {len(role_permissions)} role assignments to {output_sql_path}")
