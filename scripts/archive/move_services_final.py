
import os
import shutil

SRC_DIR = r"c:\ekaacc\apps\seowebsite\src\services"
DEST_DIR = r"c:\ekaacc\apps\seowebsite\src\lib\platform\services"

RENAMES = {
    "booking-service.ts": "booking-logic.ts",
    "stripe-service.ts": "stripe-logic.ts",
    "email-service.ts": "email-logic.ts"
}

def move_files():
    print(f"Moving files from {SRC_DIR} to {DEST_DIR}")
    if not os.path.exists(SRC_DIR):
        print(f"Source directory not found: {SRC_DIR}")
        return

    files = [f for f in os.listdir(SRC_DIR) if f.endswith('.ts')]
    
    for file in files:
        src_path = os.path.join(SRC_DIR, file)
        
        if file in RENAMES:
            new_name = RENAMES[file]
        else:
            new_name = file
            
        dest_path = os.path.join(DEST_DIR, new_name)
        
        # Collision check
        if os.path.exists(dest_path) and file not in RENAMES:
            new_name = file.replace('.ts', '-core.ts')
            dest_path = os.path.join(DEST_DIR, new_name)
            print(f"Collision! Renaming to {new_name}")
            
        try:
            shutil.move(src_path, dest_path)
            print(f"Moved {file}")
        except Exception as e:
            print(f"Error moving {file}: {e}")

    # Remove dir if empty
    if not os.listdir(SRC_DIR):
        os.rmdir(SRC_DIR)
        print("Removed src/services")

if __name__ == "__main__":
    move_files()
