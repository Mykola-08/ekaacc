import os
import re

# Common Mojibake mappings
# Based on UTF-8 bytes being interpreted as Windows-1252 or similar
REPLACEMENTS = [
    # Spanish/Catalan specific
    (r'NutriciÃ³', 'Nutrició'),
    (r'SesiÃ³n', 'Sesión'),
    (r'PsicologÃ­a', 'Psicología'),
    (r'TerÃ pies', 'Teràpies'),
    (r'TerÃ\u00A0pies', 'Teràpies'),
    (r'SomÃ\u00A0tica', 'Somàtica'),
    (r'somÃ\u00A0tica', 'somàtica'),
    
    # Generic patterns
    (r'Ã³', 'ó'),
    (r'Ã­', 'í'),
    (r'Ã ', 'à'),
    (r'Ã©', 'é'),
    (r'Ã¨', 'è'),
    (r'Ãº', 'ú'),
    (r'Ã±', 'ñ'),
    (r'Ã§', 'ç'),
    (r'Â·', '·'),
    (r'â€™', "'"),
    (r'dâ€™', "d'"),
    (r'â‚¬', '€'),
    (r'Ã¯', 'ï'),
    (r'Ã¼', 'ü'),
    (r'Ã¡', 'á'),
    (r'Ã¬', 'ì'),
    (r'Ã²', 'ò'),
    (r'Ã¹', 'ù'),
]

EXTENSIONS = ['.sql', '.tsx', '.ts', '.js', '.json', '.md']
SKIP_DIRS = ['node_modules', '.git', '.next', 'dist', 'build']

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        print(f"Skipping binary or non-utf8 file: {filepath}")
        return

    original_content = content
    for pattern, replacement in REPLACEMENTS:
        content = re.sub(pattern, replacement, content)

    if content != original_content:
        print(f"Fixing encoding in: {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

def walk_and_fix(root_dir):
    for root, dirs, files in os.walk(root_dir):
        # Skip ignored directories
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        
        for file in files:
            if any(file.endswith(ext) for ext in EXTENSIONS):
                filepath = os.path.join(root, file)
                fix_file(filepath)

if __name__ == "__main__":
    current_dir = os.getcwd()
    print(f"Scanning for encoding issues in {current_dir}...")
    walk_and_fix(current_dir)
    print("Done.")
