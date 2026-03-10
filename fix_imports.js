const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
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
    let newContent = content.replace(/@\/(components|contexts|hooks|lib|shared|types)/g, '@/marketing/');
    if (content !== newContent) {
      fs.writeFileSync(f, newContent);
      count++;
    }
  }
});
console.log('Fixed ' + count + ' files');
