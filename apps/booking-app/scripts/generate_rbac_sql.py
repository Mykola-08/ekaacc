import re

ts_file_path = r'c:\ekaacc\apps\seowebsite\src\lib\platform\config\role-permissions.ts'
output_sql_path = r'c:\ekaacc\apps\booking-app\SUPABASE_MIGRATION_RBAC_SEED.sql'

with open(ts_file_path, 'r') as f:
    content = f.read()

# Extract Roles and Permissions
# This is a bit hacky but efficient for this context.
# We look for SYSTEM_ROLES definition.

roles_block = re.search(r'export const SYSTEM_ROLES: Record<SystemRole, RoleDefinition> = \{(.*?)\};', content, re.DOTALL)
if not roles_block:
    print("Could not find SYSTEM_ROLES")
    exit(1)

roles_data = roles_block.group(1)

# Helper to parse object literal
# Python's ast wont work on TS. Regex-ing key parts.

sql_statements = [
    "-- Auto-generated RBAC Seed Migration",
    "-- Generated from role-permissions.ts",
    "",
    "-- 1. Clean existing permissions to avoid stale data (optional, maybe unsafe if custom ones exist)",
    "-- TRUNCATE role_permissions, permissions;", 
    "",
    "DO $$",
    "BEGIN",
    "  -- 2. Insert Permissions and Role Assignments",
]

# Regex to find each Role Definition
# Key: { ... permissions: [ ... ] ... }
role_matches = re.finditer(r"([A-Za-z0-9 ]+): \s*\{\s*name:\s*'([^']+)',.*?permissions:\s*\[(.*?)\]", roles_data, re.DOTALL)

unique_permissions = set()
role_permissions = []

for match in role_matches:
    role_key = match.group(1)
    role_name = match.group(2)
    permissions_block = match.group(3)
    
    # Parse permissions: { group: 'g', action: 'a' }
    perm_matches = re.finditer(r"\{ group: '([^']+)', action: '([^']+)'(.*?)\}", permissions_block)
    
    for pm in perm_matches:
        group = pm.group(1)
        action = pm.group(2)
        key = f"{group}.{action}"
        name = f"{action.replace('_', ' ').title()} {group.replace('_', ' ').title()}"
        description = f"Allows {action} on {group}"
        
        unique_permissions.add((key, name, description))
        role_permissions.append((role_name, key))

# Generate SQL for Permissions
for key, name, desc in sorted(list(unique_permissions)):
    sql_statements.append(f"  INSERT INTO permissions (key, name, description) VALUES ('{key}', '{name}', '{desc}') ON CONFLICT (key) DO NOTHING;")

sql_statements.append("")

# Generate SQL for Role Permissions
for role, key in role_permissions:
    sql_statements.append(f"  INSERT INTO role_permissions (role, permission_key) VALUES ('{role}', '{key}') ON CONFLICT (role, permission_key) DO NOTHING;")

sql_statements.append("END $$;")

with open(output_sql_path, 'w') as f:
    f.write('\n'.join(sql_statements))

print(f"Generated {len(unique_permissions)} permissions and {len(role_permissions)} assignments.")
