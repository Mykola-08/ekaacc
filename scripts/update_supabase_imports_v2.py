
import os

# Base path to search for imports
SEARCH_DIR = r"c:\ekaacc\apps\seowebsite\src"

IMPORTS_MAP = {
    "supabase/supabase-utils": "supabase/utils",
    "supabase/supabase-admin": "supabase/admin",
    "supabase/supabase-auth": "supabase/auth",
    "supabase/supabase-middleware": "supabase/middleware",
}

def update_imports():
    print(f"Updating Supabase imports in {SEARCH_DIR}...")
    count = 0
    
    for root, dirs, files in os.walk(SEARCH_DIR):
        for file in files:
            if not file.endswith(('.ts', '.tsx')): continue
            
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            for old_key, new_path in IMPORTS_MAP.items():
                old_str = f"@/lib/platform/{old_key}"
                new_str = f"@/lib/platform/{new_path}"
                content = content.replace(old_str, new_str)
                
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file}")
                count += 1
                
    print(f"Finished. Updated {count} files.")

if __name__ == "__main__":
    update_imports()
