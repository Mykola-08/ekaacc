import os

path = r"c:\Users\Mykola\ekaacc\src\components\marketing"
print(f"Checking {path}")
if os.path.exists(path):
    print("Exists")
    print(os.listdir(path)[:5])
else:
    print("Does not exist")
