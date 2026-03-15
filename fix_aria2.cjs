const fs = require('fs');
let content = fs.readFileSync('src/marketing/components/MainLayout.tsx', 'utf8');
content = content.replace(/aria-label=\{\`\$\{item\.label\} submenu\`\}/g, 'aria-label={`${item.name} submenu`}');
fs.writeFileSync('src/marketing/components/MainLayout.tsx', content, 'utf8');
