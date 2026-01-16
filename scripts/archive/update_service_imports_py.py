
import os

# Base path
SEARCH_DIR = r"c:\ekaacc\apps\seowebsite\src"

# Map old names (in src/services) to new names (in lib/platform/services)
RENAMES = {
    "booking-service": "booking-logic",
    "stripe-service": "stripe-logic",
    "email-service": "email-logic"
}

def update_imports():
    print(f"Updating service imports in {SEARCH_DIR}...")
    count = 0
    
    for root, dirs, files in os.walk(SEARCH_DIR):
        for file in files:
            if not file.endswith(('.ts', '.tsx')): continue
            
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # 1. Update strict alias imports: @/services/XYZ -> @/lib/platform/services/XYZ
            #    And handle renames during this process
            
            def replace_import(match):
                # match.group(1) is the module name after @/services/
                module = match.group(1)
                
                # Check for renames
                if module in RENAMES:
                    new_module = RENAMES[module]
                    return f"@/lib/platform/services/{new_module}"
                
                return f"@/lib/platform/services/{module}"

            # RegEx for: import ... from '@/services/MODULE'
            # or require('@/services/MODULE')
            # Capture the MODULE part
            pattern = r"@/services/([a-zA-Z0-9_\-]+)" 
            
            content = re.sub(pattern, replace_import, content)

            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file}")
                count += 1
                
    print(f"Finished. Updated {count} files.")
    
import re
if __name__ == "__main__":
    update_imports()
