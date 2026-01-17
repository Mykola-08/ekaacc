import os

def replace_booking_url():
    root_dir = "c:\\ekaacc\\apps\\seowebsite\\src"
    target_string = "process.env.NEXT_PUBLIC_BOOKING_APP_URL"
    replacement_string = "BOOKING_APP_URL"
    import_statement = "import { BOOKING_APP_URL } from '@/lib/config';"

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".tsx") or filename.endswith(".ts"):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if target_string in content and "import { BOOKING_APP_URL }" not in content:
                        print(f"Modifying {filepath}")
                        # Add import if not present
                        if "from '@/lib/config';" not in content:
                             # Try to insert after the last import
                            lines = content.split('\n')
                            last_import_idx = -1
                            for i, line in enumerate(lines):
                                if line.strip().startswith('import '):
                                    last_import_idx = i
                            
                            if last_import_idx != -1:
                                lines.insert(last_import_idx + 1, import_statement)
                            else:
                                lines.insert(0, import_statement)
                            
                            content = '\n'.join(lines)
                        
                        # Replace usages
                        # We need to handle `href={process.env.NEXT_PUBLIC_BOOKING_APP_URL}`
                        # and other usages. 
                        # Using string replace is safe enough for this specific variable name
                        content = content.replace(target_string, replacement_string)

                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    replace_booking_url()
