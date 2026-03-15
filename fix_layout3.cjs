const fs = require('fs');
let content = fs.readFileSync('src/marketing/components/MainLayout.tsx', 'utf-8');
content = content.replace(/aria-label=\{\\ submenu\}/g, 'aria-label={\\ submenu\\}');
fs.writeFileSync('src/marketing/components/MainLayout.tsx', content);
console.log('Fixed aria-label interpolation');
