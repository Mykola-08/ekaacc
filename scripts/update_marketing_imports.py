import os

root_dirs = [
    'src/app/(marketing)',
    'src/components/marketing',
    'src/context/marketing',
    'src/hooks/marketing',
    'src/lib/marketing',
    'src/types/marketing',
    'src/shared/marketing'
]

replacements = {
    '@/components/': '@/components/marketing/',
    '@/contexts/': '@/context/marketing/',
    '@/hooks/': '@/hooks/marketing/',
    '@/lib/': '@/lib/marketing/',
    '@/types/': '@/types/marketing/',
    '@/shared/': '@/shared/marketing/',
    './globals.css': './marketing.css',
    '"globals.css"': '"marketing.css"'
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for d in root_dirs:
    if os.path.exists(d):
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.tsx', '.ts', '.css', '.js', '.jsx')):
                    replace_in_file(os.path.join(root, file))
