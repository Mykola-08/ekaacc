import os
import re

def update_radius_in_file(filepath, component_type):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        
        if component_type == "card":
            # Replace rounded-xl (or lg/md) with rounded-3xl (36px)
            # Card usually: "rounded-xl border bg-card ..."
            new_content = new_content.replace("rounded-xl border bg-card", "rounded-3xl border bg-card")
            new_content = new_content.replace("rounded-lg border bg-card", "rounded-3xl border bg-card")

        elif component_type == "dialog":
            # DialogContent: "sm:rounded-lg" -> "sm:rounded-3xl"
            if "sm:rounded-lg" in new_content:
                new_content = new_content.replace("sm:rounded-lg", "sm:rounded-3xl")
            # If it uses just rounded-lg
            new_content = new_content.replace("rounded-lg border", "rounded-3xl border")

        elif component_type == "sheet":
            # SheetContent usually doesn't have radius on the edge attached to screen, 
            # but user might want "floating" sheet (detached)?
            # The prompt says "Sidebar: Floating, pill-shaped... detached".
            # Traditional Sheet is attached.
            # I won't force Sheet to be detached via regex as it breaks layout.
            pass

        elif component_type == "drawer":
            # Drawer content usually has rounded-t-[10px]
            new_content = new_content.replace("rounded-t-[10px]", "rounded-t-3xl")
            new_content = new_content.replace("rounded-t-xl", "rounded-t-3xl")

        if content != new_content:
            print(f"Updating radius in: {filepath}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

    except Exception as e:
        print(f"Error updating {filepath}: {e}")

def main():
    files_map = {
        "card": [
            r"c:\ekaacc\packages\shared-ui\src\components\ui\card.tsx",
            r"c:\ekaacc\apps\booking-app\components\ui\card.tsx",
            r"c:\ekaacc\apps\seowebsite\src\components\platform\ui\card.tsx"
        ],
        "dialog": [
            r"c:\ekaacc\apps\booking-app\components\ui\dialog.tsx",
            r"c:\ekaacc\apps\seowebsite\src\components\platform\ui\dialog.tsx"
        ],
        "drawer": [
             r"c:\ekaacc\apps\seowebsite\src\components\platform\ui\drawer.tsx"
        ]
    }
    
    for c_type, paths in files_map.items():
        for p in paths:
            if os.path.exists(p):
                update_radius_in_file(p, c_type)

if __name__ == '__main__':
    main()
