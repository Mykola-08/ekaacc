#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function findFiles(dir, exts) {
  const results = [];
  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory() && !['node_modules', '.next', '.git'].includes(e.name)) {
        walk(full);
      } else if (e.isFile() && exts.some(x => e.name.endsWith(x))) {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

const files = findFiles('/home/user/ekaacc/src', ['.tsx', '.ts']);
let filesFixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes("from 'hugeicons-react'")) continue;

  // Find all import statements from hugeicons-react and deduplicate
  // Match multi-line imports too
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*'hugeicons-react'/g;
  let newContent = content;
  let changed = false;

  newContent = newContent.replace(/import\s*\{([^}]+)\}\s*from\s*'hugeicons-react'/g, (match, imports) => {
    // Parse the imports
    const items = imports.split(',').map(s => s.trim()).filter(Boolean);
    // Deduplicate - keep unique names (handle aliased imports too)
    const seen = new Set();
    const unique = items.filter(item => {
      const name = item.split(/\s+as\s+/)[0].trim();
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    if (unique.length !== items.length) {
      changed = true;
      return `import { ${unique.join(', ')} } from 'hugeicons-react'`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, newContent);
    filesFixed++;
    console.log('Fixed duplicates: ' + path.relative('/home/user/ekaacc', file));
  }
}

console.log(`\nFixed ${filesFixed} files with duplicate imports`);
