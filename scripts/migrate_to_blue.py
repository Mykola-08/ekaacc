import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace teal with blue
        new_content = content.replace('teal-', 'blue-')
        
        # Replace specific gray buttons if they look like the ones we saw
        # "bg-gray-900 hover:bg-gray-800 text-white" -> "bg-primary hover:bg-primary/90 text-primary-foreground"
        new_content = new_content.replace('bg-gray-900 hover:bg-gray-800 text-white', 'bg-primary hover:bg-primary/90 text-primary-foreground')
        new_content = new_content.replace('bg-zinc-900 text-amber-100', 'bg-primary text-primary-foreground') # Check this logic, amber might be specific
        
        # Fix shadows
        new_content = new_content.replace('shadow-teal-', 'shadow-blue-')
        
        if content != new_content:
            print(f"Updating {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
    except Exception as e:
        print(f"Error reading/writing {filepath}: {e}")

def main():
    target_dirs = [r'c:\ekaacc\apps']
    
    for root_dir in target_dirs:
        for root, dirs, files in os.walk(root_dir):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.jsx') or file.endswith('.ts'):
                    filepath = os.path.join(root, file)
                    replace_in_file(filepath)

if __name__ == '__main__':
    main()
