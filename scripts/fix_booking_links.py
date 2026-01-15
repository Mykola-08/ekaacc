import os

root_dir = "apps/seowebsite/src"
target_string = 'href="/booking"'
# We will replace with an expression. 
# Note: Next.js Replace env vars at build time, so using process.env.NEXT_PUBLIC_BOOKING_APP_URL is correct for client side.
# However, for <a> tags or <Link> tags, we need to switch from string literal to JSX expression.
# Example: href="/booking" -> href={process.env.NEXT_PUBLIC_BOOKING_APP_URL}

replacement_string = 'href={process.env.NEXT_PUBLIC_BOOKING_APP_URL}'

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            filepath = os.path.join(subdir, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            if target_string in content:
                print(f"Modifying {filepath}")
                new_content = content.replace(target_string, replacement_string)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
