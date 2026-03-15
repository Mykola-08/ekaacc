/**
 * Fix broken multi-line imports caused by the replacement script
 * inserting hugeicons imports in the middle of multi-line import blocks.
 */
const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const orig = content;
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  
  // Pattern: a line starting with "import {" (multi-line import) followed by 
  // hugeicons imports before the closing "} from"
  // We need to extract the hugeicons imports and move them outside
  
  // Match pattern: "import {\nimport { HugeiconsIcon } from '@hugeicons/react';\nimport { ... } from '@hugeicons/core-free-icons';\n  ...stuff...\n} from '...';"
  const bugPattern = /import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]*['"];?\n?/g;
  let match;
  const fixes = [];
  
  while ((match = bugPattern.exec(content)) !== null) {
    const block = match[0];
    // Check if this block contains an embedded hugeicons import
    if (block.includes("from '@hugeicons/react'") || block.includes("from '@hugeicons/core-free-icons'")) {
      // Check if this is a corrupted block (hugeicons import inside another import)
      if (!block.startsWith("import { HugeiconsIcon }") && !block.startsWith("import {  HugeiconsIcon") && !block.match(/^import\s*\{[^}]*\}\s*from\s*'@hugeicons/)) {
        fixes.push({ index: match.index, length: block.length, block });
      }
    }
  }
  
  if (fixes.length === 0) return false;
  
  // Process fixes in reverse order to maintain indices
  for (let i = fixes.length - 1; i >= 0; i--) {
    const fix = fixes[i];
    const block = fix.block;
    
    // Extract hugeicons import lines
    const hugeLines = [];
    const otherLines = [];
    const lines = block.split('\n');
    
    for (const line of lines) {
      if (line.includes("from '@hugeicons/react'") || line.includes("from '@hugeicons/core-free-icons'")) {
        hugeLines.push(line.trim());
      } else {
        otherLines.push(line);
      }
    }
    
    // Rebuild the original import (without hugeicons lines)
    const rebuiltImport = otherLines.join('\n');
    
    // Place hugeicons imports after the rebuilt import
    const replacement = rebuiltImport + '\n' + hugeLines.join('\n');
    
    content = content.substring(0, fix.index) + replacement + content.substring(fix.index + fix.length);
  }
  
  if (content !== orig) {
    fs.writeFileSync(filePath, content);
    console.log(`FIXED: ${rel}`);
    return true;
  }
  return false;
}

// Also need to handle case where there might be duplicate hugeicons imports
function deduplicateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const orig = content;
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  
  // Find all HugeiconsIcon imports
  const hugeReactImports = content.match(/import\s*\{\s*HugeiconsIcon\s*\}\s*from\s*'@hugeicons\/react';\n?/g);
  if (hugeReactImports && hugeReactImports.length > 1) {
    // Keep only the first one
    let first = true;
    content = content.replace(/import\s*\{\s*HugeiconsIcon\s*\}\s*from\s*'@hugeicons\/react';\n?/g, (m) => {
      if (first) { first = false; return m; }
      return '';
    });
  }
  
  // Merge all core-free-icons imports
  const coreImports = [];
  const coreRegex = /import\s*\{([^}]+)\}\s*from\s*'@hugeicons\/core-free-icons';\n?/g;
  let coreMatch;
  while ((coreMatch = coreRegex.exec(content)) !== null) {
    const icons = coreMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    coreImports.push(...icons);
  }
  
  if (coreImports.length > 0) {
    const uniqueIcons = [...new Set(coreImports)];
    let first = true;
    content = content.replace(/import\s*\{([^}]+)\}\s*from\s*'@hugeicons\/core-free-icons';\n?/g, (m) => {
      if (first) {
        first = false;
        return `import { ${uniqueIcons.join(', ')} } from '@hugeicons/core-free-icons';\n`;
      }
      return '';
    });
  }
  
  if (content !== orig) {
    fs.writeFileSync(filePath, content);
    console.log(`DEDUPED: ${rel}`);
    return true;
  }
  return false;
}

// Collect all .tsx/.ts files
function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      results.push(...collectFiles(fullPath));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const srcDir = path.resolve('src');
const allFiles = collectFiles(srcDir);
let fixCount = 0;
let dedupCount = 0;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('@hugeicons')) {
    if (fixFile(filePath)) fixCount++;
    if (deduplicateImports(filePath)) dedupCount++;
  }
}

console.log(`\nDone. Fixed ${fixCount} files, deduplicated ${dedupCount} files.`);
