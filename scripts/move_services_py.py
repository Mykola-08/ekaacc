
import os
import shutil

SRC_DIR = r"c:\ekaacc\apps\seowebsite\src\services"
DEST_DIR = r"c:\ekaacc\apps\seowebsite\src\lib\platform\services"

RENAMES = {
    "booking-service.ts": "booking-logic.ts",
    "stripe-service.ts": "stripe-logic.ts", # Avoid collision with stripe-client (which was stripe.ts)
    "email-service.ts": "email-logic.ts"  # Avoid collision with email-client (which was email.ts)
}

def move_files():
    if not os.path.exists(SRC_DIR):
        print(f"Source directory not found: {SRC_DIR}")
        return

    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    files = [f for f in os.listdir(SRC_DIR) if f.endswith('.ts')]
    
    for file in files:
        src_path = os.path.join(SRC_DIR, file)
        
        # Determine new name
        if file in RENAMES:
            new_name = RENAMES[file]
        else:
            new_name = file
            
        dest_path = os.path.join(DEST_DIR, new_name)
        
        # Check collision
        if os.path.exists(dest_path) and file not in RENAMES:
            print(f"Collision for {file}. Renaming to {new_name.replace('.ts', '-dupe.ts')}")
            dest_path = os.path.join(DEST_DIR, new_name.replace('.ts', '-dupe.ts'))
            
        shutil.move(src_path, dest_path)
        print(f"Moved {file} -> {dest_path}")
        
    # Check if empty
    if not os.listdir(SRC_DIR):
        os.rmdir(SRC_DIR)
        print(f"Removed empty directory {SRC_DIR}")

if __name__ == "__main__":
    move_files()
