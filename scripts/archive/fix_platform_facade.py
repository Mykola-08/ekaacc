
import os
import re

# Base path
SEARCH_DIR = r"c:\ekaacc\apps\seowebsite\src\lib\platform\services"
PLATFORM_SERVICE_PATH = os.path.join(SEARCH_DIR, "platform-service.ts")

# Replacement Map
REPLACEMENTS = {
    "fxUsers": "userService",
    "fxBookings": "bookingService",
    "fxBilling": "billingService",
    "fxAssessments": "assessmentService",
    "fxNotifications": "notificationService",
    "fxTemplates": "templateService",
}

def fix_facade():
    print(f"Fixing {PLATFORM_SERVICE_PATH}...")
    if not os.path.exists(PLATFORM_SERVICE_PATH):
        print("Error: File not found.")
        return

    with open(PLATFORM_SERVICE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    for old, new in REPLACEMENTS.items():
        # Replace simple usages
        content = content.replace(f"{old}.", f"{new}.")
        # Replace inside objects if any (unlikely here)
        
    if content != original_content:
        with open(PLATFORM_SERVICE_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success: Updated platform-service.ts")
    else:
        print("No changes needed or replacement failed.")

def fix_exports():
    # Also fix the exports in the other files if they were missed
    files = {
        "notification-service.ts": "fxNotifications",
        "template-service.ts": "fxTemplates",
        "assessment-service.ts": "fxAssessments",
        "billing-service.ts": "fxBilling"
    }
    
    for filename, old_var in files.items():
        path = os.path.join(SEARCH_DIR, filename)
        if not os.path.exists(path):
            continue
            
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()
            
        orig = c
        new_var = REPLACEMENTS[old_var]
        
        # Replace export
        c = c.replace(f"export const {old_var}", f"export const {new_var}")
        
        # Fix imports of supabase-utils
        c = c.replace("supabase/supabase-utils", "supabase/utils")
        
        if c != orig:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(c)
            print(f"Updated {filename}")

if __name__ == "__main__":
    fix_facade()
    fix_exports()
