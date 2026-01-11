
import os
import shutil

root_dir = r"c:\ekaacc\apps\seowebsite\src"
lib_platform = os.path.join(root_dir, "lib", "platform")

# Define moves: "filename": "destination_subfolder"
moves = {
    # Services
    "logging.ts": "services",
    "email.ts": "services",
    "bot.ts": "services",
    "square.ts": "services",
    "stripe.ts": "services",
    "statsig.ts": "services",
    "insforge-client.ts": "services",
    "security-monitoring.ts": "services",
    "permission-service.ts": "services",
    "personalization-engine.ts": "services",
    "fx-assessments.ts": "services",
    "fx-billing.ts": "services",
    "fx-bookings.ts": "services",
    "fx-notifications.ts": "services",
    "fx-service.ts": "services",
    "fx-templates.ts": "services",
    "fx-users.ts": "services",
    
    # Utils
    "accessibility-utils.ts": "utils",
    "auth-utils.ts": "utils",
    "data-integrity.ts": "utils",
    "error-handling.ts": "utils",
    "google-api-helper.ts": "utils",
    "performance-utils.ts": "utils",
    "rate-limit.ts": "utils",
    "rate-limit-redis.ts": "utils",
    "result.ts": "utils",
    "translations.ts": "utils",
    "user-utils.ts": "utils",
    "utils.ts": "utils",

    # Types
    "community-types.ts": "types",
    "notification-types.ts": "types",
    "subscription-types.ts": "types",
    "template-types.ts": "types",
    "types.ts": "types",
    "wallet-types.ts": "types",

    # Config
    "navigation-config.ts": "config",
    "feature-flags.ts": "config",
    "routes.ts": "config",

    # Supabase (Move to existing folder)
    "supabase-admin.ts": "supabase",
    "supabase-auth.ts": "supabase",
    "supabase-middleware.ts": "supabase",
    "supabase-utils.ts": "supabase",
    # "supabase.ts": "supabase" # Handle this carefully, rename to legacy?
}

# 1. Create Directories and Move Files
for filename, subfolder in moves.items():
    src = os.path.join(lib_platform, filename)
    dst_dir = os.path.join(lib_platform, subfolder)
    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir)
    
    dst = os.path.join(dst_dir, filename)
    if os.path.exists(src):
        print(f"Moving {filename} to {subfolder}...")
        try:
            shutil.move(src, dst)
        except Exception as e:
            print(f"Error moving {filename}: {e}")

# 2. Update Imports
# Map old paths to new paths
replacements = []
for filename, subfolder in moves.items():
    name_no_ext = os.path.splitext(filename)[0]
    old_import = f"@/lib/platform/{name_no_ext}"
    new_import = f"@/lib/platform/{subfolder}/{name_no_ext}"
    replacements.append((f"from '{old_import}'", f"from '{new_import}'"))
    replacements.append((f'from "{old_import}"', f'from "{new_import}"'))
    # Also handle imports that might not use quotes correctly or spacing, but simple string replace covers most.

# Walk through src and update imports
for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            filepath = os.path.join(subdir, file)
            # Skip node_modules if found inside src (shouldn't be generally)
            if "node_modules" in filepath: 
                continue

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements:
                    # Using replace is simplistic but safe for absolute imports we use
                    if old in new_content:
                        new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated imports in: {filepath}")
            except Exception as e:
                print(f"Error updating {filepath}: {e}")

