import os
import re

# Configuration
SOURCE_ROOT = "apps/seowebsite/src"
TARGET_DIRS = ["components", "lib", "hooks", "store", "types", "server", "context", "actions"]
PLATFORM_SUFFIX = "platform"

def fix_relative_imports(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {file_path}: {e}")
        return

    original_content = content
    modified = False

    for target in TARGET_DIRS:
        # Regex to find relative imports pointing to target dir
        # Matches: ../target/ or ../../target/ etc.
        # But NOT already platform: ../target/platform/
        
        # Pattern explanation:
        # (['"]) : Capture opening quote 
        # ((?:\.\./)+) : Capture one or more ../
        # (target) : Capture the target directory name
        # / : The slash after target
        # (?!platform/) : Negative lookahead ensuring it's not followed by platform/
        
        pattern = fr"(['\"])((\.\./)+)({target})/(?!{PLATFORM_SUFFIX}/)"
        replacement = fr"\1\2\3/{PLATFORM_SUFFIX}/"
        
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            modified = True

    if modified:
        print(f"Updating relative imports in: {file_path}")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

def main():
    abs_source_root = os.path.abspath(SOURCE_ROOT)
    print(f"Scanning {abs_source_root} for relative imports to fix...")
    
    for root, dirs, files in os.walk(abs_source_root):
        for file in files:
            if file.endswith(".ts") or file.endswith(".tsx") or file.endswith(".js") or file.endswith(".jsx"):
                file_path = os.path.join(root, file)
                fix_relative_imports(file_path)

if __name__ == "__main__":
    main()
