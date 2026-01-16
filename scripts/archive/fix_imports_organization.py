
import os

root_dir = r"c:\ekaacc\apps\seowebsite\src"

replacements = [
    ("from '@/hooks/platform/use-simple-auth'", "from '@/hooks/platform/auth/use-simple-auth'"),
    ('from "@/hooks/platform/use-simple-auth"', 'from "@/hooks/platform/auth/use-simple-auth"'),
    ("from '@/hooks/platform/use-toast'", "from '@/hooks/platform/ui/use-toast'"),
    ('from "@/hooks/platform/use-toast"', 'from "@/hooks/platform/ui/use-toast"'),
    ("from '@/hooks/platform/use-media-query'", "from '@/hooks/platform/ui/use-media-query'"),
    ("from '@/hooks/platform/use-mobile'", "from '@/hooks/platform/ui/use-mobile'"),
    ("from '@/hooks/platform/use-in-view'", "from '@/hooks/platform/ui/use-in-view'")
]

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            filepath = os.path.join(subdir, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements:
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")
            except Exception as e:
                print(f"Error processing {filepath}: {e}")
