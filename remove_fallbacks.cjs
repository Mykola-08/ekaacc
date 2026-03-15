const fs = require('fs');
const files = [
    'src/marketing/components/MainLayout.tsx',
    'src/marketing/components/DiscountsContent.tsx',
    'src/marketing/components/AgenyzContent.tsx',
    'src/marketing/components/CookieBanner.tsx'
];
for(const f of files) {
   let content = fs.readFileSync(f, 'utf8');
   // Replace t('xxx') || 'xxx' with t('xxx')
   content = content.replace(/(t\('[a-zA-Z0-9.\-_]+'\))\s*\|\|\s*'[^']+'/g, '$1');
   // Also check for t("xxx") || "xxx"
   content = content.replace(/(t\("[a-zA-Z0-9.\-_]+"\))\s*\|\|\s*"[^"]+"/g, '$1');
   fs.writeFileSync(f, content, 'utf8');
}
console.log("Fallbacks removed properly");
