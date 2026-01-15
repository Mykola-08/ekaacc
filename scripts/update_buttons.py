import os
import re

def update_button_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # 1. Add active:scale-95 to base classes if missing (for Tactility)
        # Look for cva( "..."
        cva_pattern = r'cva\(\s*"([^"]+)"'
        match = re.search(cva_pattern, new_content)
        if match:
            base_classes = match.group(1)
            if 'active:scale-95' not in base_classes:
                # Add it
                new_base = base_classes + " active:scale-95 transition-transform duration-200"
                # Also ensure rounded-xl is the base (16px)
                if 'rounded-md' in new_base:
                    new_base = new_base.replace('rounded-md', 'rounded-xl')
                elif 'rounded-lg' in new_base:
                    new_base = new_base.replace('rounded-lg', 'rounded-xl')
                elif 'rounded-xl' not in new_base:
                    new_base = new_base + " rounded-xl"
                
                new_content = new_content.replace(base_classes, new_base)

        # 2. Update default size to h-12 (48px)
        # Look for default: "h-10 ..." or "h-11 ..." inside size object
        # Regex for size: { ... default: "..." } is hard.
        # Just replace specific known strings.
        
        # seowebsite uses "h-11 px-5 py-2.5"
        new_content = new_content.replace('"h-11 px-5 py-2.5"', '"h-12 px-6 py-3"')
        new_content = new_content.replace('"h-10 px-4 py-2"', '"h-12 px-6 py-3"')
        new_content = new_content.replace('"h-11 px-5 py-2.5 has-[>svg]:px-3"', '"h-12 px-6 py-3 has-[>svg]:px-4"')

        # 3. Update Primary Variant to be Pill (rounded-full) if desired for "Action" buttons
        # The prompt says Action Button (Brand Blue) is Radius: Full.
        # So variant: default (bg-primary) should include `rounded-full`.
        
        # Locate variant: { default: "..." }
        # This is also regex heavy.
        # Let's try string replacement for the common "bg-primary" string in default variant.
        # usually: default: "bg-primary text-primary-foreground hover:bg-primary/90"
        
        default_variant_old = 'default: "bg-primary text-primary-foreground hover:bg-primary/90"'
        default_variant_new = 'default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20"'
        
        # seowebsite has it without quotes usually in keys? No, keys are unquoted, values quoted.
        # `default: "bg-primary ..."`
        
        if default_variant_old in new_content:
             new_content = new_content.replace(default_variant_old, default_variant_new)
        
        if content != new_content:
            print(f"Updating button styles in: {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

    except Exception as e:
        print(f"Error updating {filepath}: {e}")

def main():
    files = [
        r"c:\ekaacc\apps\seowebsite\src\components\platform\ui\button.tsx",
        r"c:\ekaacc\packages\shared-ui\src\components\ui\button.tsx",
        r"c:\ekaacc\apps\booking-app\components\ui\button.tsx"
    ]
    
    for f in files:
        if os.path.exists(f):
            update_button_file(f)

if __name__ == '__main__':
    main()
