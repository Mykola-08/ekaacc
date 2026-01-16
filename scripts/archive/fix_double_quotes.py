import os
import re

# Configuration
SOURCE_ROOT = "apps/seowebsite/src"

def fix_quotes(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {file_path}: {e}")
        return

    original_content = content
    modified = False

    # Fix double single quotes
    # Replace ''@/ with '@/
    new_content = content.replace("''@/", "'@/")
    if new_content != content:
        content = new_content
        modified = True

    # Fix double double quotes
    # Replace ""@/ with "@/
    new_content = content.replace('""@/', '"@/')
    if new_content != content:
        content = new_content
        modified = True

    if modified:
        print(f"Fixing quotes in: {file_path}")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

def main():
    abs_source_root = os.path.abspath(SOURCE_ROOT)
    print(f"Scanning {abs_source_root} for double quote syntax errors...")
    
    for root, dirs, files in os.walk(abs_source_root):
        for file in files:
            if file.endswith(".ts") or file.endswith(".tsx") or file.endswith(".js") or file.endswith(".jsx"):
                file_path = os.path.join(root, file)
                fix_quotes(file_path)

if __name__ == "__main__":
    main()
