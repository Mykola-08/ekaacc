import os
import re

# Configuration
SOURCE_ROOT = "apps/seowebsite/src"
TARGET_TOKENS = ["components", "lib", "hooks", "store", "types", "server", "context", "actions"]
PLATFORM_SUFFIX = "platform"

def fix_imports(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {file_path}: {e}")
        return

    original_content = content
    modified = False

    for token in TARGET_TOKENS:
        # Regex to find imports that are NOT already pointing to platform
        # Matches: from '@/token/' or import '@/token/' avoiding '@/token/platform/'
        # We look for '@/token/something' where 'something' is NOT 'platform/'
        
        # Simple string replacement strategy is risky if not careful, but regex is better.
        # We want to replace '@/token/' with '@/token/platform/'
        # UNLESS it is followed by 'platform/'
        
        # Pattern: ('@/token/)(?!platform/)
        pattern = fr"('@/{token}/)(?!{PLATFORM_SUFFIX}/)"
        replacement = fr"'\1{PLATFORM_SUFFIX}/"
        
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            modified = True
            
        # Also handle double quotes
        pattern_double = fr'("@/{token}/)(?!{PLATFORM_SUFFIX}/)'
        replacement_double = fr'"\1{PLATFORM_SUFFIX}/'
        
        new_content = re.sub(pattern_double, replacement_double, content)
        if new_content != content:
            content = new_content
            modified = True

    if modified:
        print(f"Updating imports in: {file_path}")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

def main():
    abs_source_root = os.path.abspath(SOURCE_ROOT)
    print(f"Scanning {abs_source_root} for broken imports...")
    
    for root, dirs, files in os.walk(abs_source_root):
        for file in files:
            if file.endswith(".ts") or file.endswith(".tsx") or file.endswith(".js") or file.endswith(".jsx"):
                file_path = os.path.join(root, file)
                fix_imports(file_path)

if __name__ == "__main__":
    main()
