import os

def apply_pill_buttons(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace rounded-xl with rounded-full for primary action buttons
        # Looking for patterns like: className="... bg-primary ... rounded-xl ..."
        new_content = content
        
        # We target specific known buttons in these service pages
        target_str = 'className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 border-none"'
        replacement_str = 'className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 border-none shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"'
        
        new_content = new_content.replace(target_str, replacement_str)
        
        if content != new_content:
             print(f"Updating buttons in {filepath}")
             with open(filepath, 'w', encoding='utf-8') as f:
                 f.write(new_content)
    except Exception as e:
        print(f"Error updating {filepath}: {e}")

def main():
    files = [
        r"c:\ekaacc\apps\seowebsite\src\react-app\pages\KinesiologiaPage.tsx",
        r"c:\ekaacc\apps\seowebsite\src\react-app\pages\NutricioPage.tsx"
    ]
    for f in files:
        if os.path.exists(f):
            apply_pill_buttons(f)

if __name__ == '__main__':
    main()
