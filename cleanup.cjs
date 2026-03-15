
const fs = require('fs');
const path = require('path');
function walk(dir) {
  let files = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file === 'node_modules' || file === '.next') continue;
      const filepath = path.join(dir, file);
      if (fs.statSync(filepath).isDirectory()) files.push(...walk(filepath));
      else if (filepath.endsWith('.tsx') || filepath.endsWith('.ts') || filepath.endsWith('.css')) files.push(filepath);
    }
  } catch(e) {}
  return files;
}

const files = walk('src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/text-\[#1d1d1f\]/g, 'text-foreground');
  content = content.replace(/text-\[#86868b\]/g, 'text-muted-foreground');
  content = content.replace(/bg-\[#fbfbfd\]/g, 'bg-background');
  content = content.replace(/bg-\[#000035\]/g, 'bg-primary');
  content = content.replace(/text-\[#000035\]/g, 'text-primary');
  content = content.replace(/bg-\[#1d1d1f\]/g, 'bg-foreground');
  content = content.replace(/bg-apple-gray-dark/g, 'bg-foreground');
  content = content.replace(/text-apple-gray-dark/g, 'text-foreground');
  content = content.replace(/bg-apple-blue/g, 'bg-primary');
  content = content.replace(/text-apple-blue/g, 'text-primary');
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Replaced hex/apple colors in ' + file);
  }
}

