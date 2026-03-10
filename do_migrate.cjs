const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

copyDir('temp_seowebsite/src/components', 'src/marketing/components');
copyDir('temp_seowebsite/src/contexts', 'src/marketing/contexts');
copyDir('temp_seowebsite/src/hooks', 'src/marketing/hooks');
copyDir('temp_seowebsite/src/lib', 'src/marketing/lib');
if (fs.existsSync('temp_seowebsite/src/shared')) copyDir('temp_seowebsite/src/shared', 'src/marketing/shared');
if (fs.existsSync('temp_seowebsite/src/types')) copyDir('temp_seowebsite/src/types', 'src/marketing/types');
copyDir('temp_seowebsite/src/app', 'src/app/(marketing)');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/marketing').concat(walk('src/app/(marketing)'));
let count = 0;
files.forEach(f => {
  if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css')) {
    let content = fs.readFileSync(f, 'utf8');
    let newContent = content.replace(/@\/(components|contexts|hooks|lib|shared|types)/g, '@/marketing/$1');
    if (content !== newContent) {
      fs.writeFileSync(f, newContent);
      count++;
    }
  }
});
console.log('Fixed ' + count + ' files');
