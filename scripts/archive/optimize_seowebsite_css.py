import os

# Read file
path = r"c:\ekaacc\apps\seowebsite\src\react-app\index.css"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content

# 1. Update Apple Blue
new_content = new_content.replace("--apple-blue: #0F766E;", "--apple-blue: #4DAFFF;")
new_content = new_content.replace("Mapped to Primary Teal", "Mapped to Primary Blue")

# 2. Update Radius to match Porcelain
new_content = new_content.replace("--apple-border-radius-large: 28px;", "--apple-border-radius-large: 36px;")
new_content = new_content.replace("--apple-squircle-radius: 24px;", "--apple-squircle-radius: 36px;")

# 3. Comment out Google Fonts import to prefer Next/Font
if "@import url('https://fonts.googleapis.com" in new_content:
    new_content = new_content.replace("@import url('https://fonts.googleapis.com", "/* @import url('https://fonts.googleapis.com")
    new_content = new_content.replace("&display=swap');", "&display=swap'); */")

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
