import os

def replace_aesthetic_values(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # 1. Backgrounds
        # Replace hardcoded gray-50/100 backgrounds with semantic variables if they are main containers
        # But be careful not to break small components. 
        # Safe bets: full screen sections.
        new_content = new_content.replace('bg-gray-50', 'bg-background')
        new_content = new_content.replace('bg-zinc-50', 'bg-background')
        
        # 2. Borders
        # Replace gray-200 borders with semantic border
        new_content = new_content.replace('border-gray-200', 'border-border')
        new_content = new_content.replace('border-zinc-200', 'border-border')
        new_content = new_content.replace('divide-gray-200', 'divide-border')
        
        # 3. Radius
        # Updates standard XL radius to 2XL (24px) or 3XL (36px) if it looks like a card ?
        # This is risky doing blindly. Let's stick to colors first.
        
        # 4. Text
        # Replace gray-900 with foreground (soft black)
        new_content = new_content.replace('text-gray-900', 'text-foreground')
        new_content = new_content.replace('text-zinc-900', 'text-foreground')
        
        # Replace gray-500/600 with muted-foreground
        # new_content = new_content.replace('text-gray-500', 'text-muted-foreground') 
        # ^ Too aggressive, might break specific designs.
        
        if content != new_content:
            print(f"Updating aesthetic in {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    target_dirs = [r'c:\ekaacc\apps\seowebsite\src', r'c:\ekaacc\apps\booking-app\app', r'c:\ekaacc\apps\booking-app\components']
    
    for root_dir in target_dirs:
        for root, dirs, files in os.walk(root_dir):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.jsx'):
                    filepath = os.path.join(root, file)
                    replace_aesthetic_values(filepath)

if __name__ == '__main__':
    main()
