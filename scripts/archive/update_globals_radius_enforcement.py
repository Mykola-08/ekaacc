import os

# Read current globals.css
path = r"c:\ekaacc\packages\shared-ui\src\styles\globals.css"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Insert radius overrides into @theme inline block
# We look for "--radius-3xl: 2.25rem;" and append the smaller ones before it or after
insertion = """
  --radius-sm: 0.75rem;    /* 12px */
  --radius-md: 1rem;       /* 16px - Inputs/Standard */
  --radius-lg: 1.25rem;    /* 20px */
"""

if "--radius-3xl: 2.25rem;" in content and "--radius-md:" not in content:
    new_content = content.replace("--radius-3xl: 2.25rem;", "--radius-3xl: 2.25rem;" + insertion)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Enforced global rounded radii.")
else:
    print("Radius already enforced or marker not found.")
