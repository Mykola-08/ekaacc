import os

def update_form_elements(filepath, element_type):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # 1. Inputs: h-12 (48px), rounded-xl, border-border (unless we want borderless filled style)
        if element_type == 'input':
             # Replace h-10 or h-11 with h-12
             new_content = new_content.replace('h-10', 'h-12')
             new_content = new_content.replace('h-11', 'h-12')
             
             # Replace rounded-md with rounded-xl
             new_content = new_content.replace('rounded-md', 'rounded-xl')
             
             # Adjust padding to match taller input
             new_content = new_content.replace('px-3 py-2', 'px-4 py-3')
             
             # If shared-ui uses border input, allow it but ensure color is right. 
             # Booking app uses "bg-secondary/50 border-none", which is very "iOS filled input" style.
             # Design spec says: "No Thin Borders: separate with background color"
             # So the Booking App style (filled secondary, no border) is technically closer to the spec ("Softer Containers").
             # Let's try to align shared-ui to that if possible, or at least ensure radius/height.

        # 2. Selects: Trigger should match Input
        elif element_type == 'select':
             # Trigger usually has height and radius
             new_content = new_content.replace('h-10', 'h-12')
             new_content = new_content.replace('rounded-md', 'rounded-xl')
             new_content = new_content.replace('px-3 py-2', 'px-4 py-3')
             # Dropdown content (SelectContent) should be rounded-2xl or 3xl
             new_content = new_content.replace('rounded-md', 'rounded-2xl')

        # 3. Checkbox: rounded-md -> rounded-md (standard) or rounded-full (circle)?
        # iOS checkbox is actually a circle, but standard web checkbox is square-ish.
        # Spec: "Inner Elements ... rounded-2xl or rounded-xl". 
        # A checkbox is small. Let's make it rounded-[6px] or rounded-md is fine.
        # But key is Color: ring should be Primary.
        elif element_type == 'checkbox':
             # Ensure data-[state=checked]:bg-primary
             pass

        if content != new_content:
            print(f"Updating {element_type} in {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

    except Exception as e:
        print(f"Error updating {filepath}: {e}")

def main():
    files_map = {
        'input': [
            r"c:\ekaacc\packages\shared-ui\src\components\ui\input.tsx",
            r"c:\ekaacc\apps\seowebsite\src\components\platform\ui\input.tsx",
            r"c:\ekaacc\apps\booking-app\components\ui\input.tsx"
        ],
        'select': [
            r"c:\ekaacc\apps\seowebsite\src\components\platform\ui\select.tsx",
            r"c:\ekaacc\apps\booking-app\components\ui\select.tsx"
        ]
    }
    
    for type, paths in files_map.items():
        for p in paths:
            if os.path.exists(p):
                update_form_elements(p, type)

if __name__ == '__main__':
    main()
