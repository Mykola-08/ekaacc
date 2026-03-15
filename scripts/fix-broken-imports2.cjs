/**
 * Fix broken multi-line imports where hugeicons imports were inserted
 * inside another import block. Pattern:
 * 
 * import {
 * import { HugeiconsIcon } from '@hugeicons/react';
 * import { Foo } from '@hugeicons/core-free-icons';
 *   Card,
 *   ...
 * } from '@/components/ui/card';
 * 
 * Should become:
 * import { HugeiconsIcon } from '@hugeicons/react';
 * import { Foo } from '@hugeicons/core-free-icons';
 * import {
 *   Card,
 *   ...
 * } from '@/components/ui/card';
 */
const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const orig = content;
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  
  const lines = content.split('\n');
  const output = [];
  let i = 0;
  let changed = false;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Detect: a line that is "import {" (multiline start) followed by a hugeicons import
    if (/^import\s*\{\s*$/.test(line.trim()) && i + 1 < lines.length) {
      // Check if next line is a hugeicons import
      const nextLine = lines[i + 1];
      if (nextLine && (nextLine.includes("from '@hugeicons/react'") || nextLine.includes("from '@hugeicons/core-free-icons'"))) {
        // Extract all hugeicons import lines
        const hugeLines = [];
        let j = i + 1;
        while (j < lines.length && (lines[j].includes("from '@hugeicons/react'") || lines[j].includes("from '@hugeicons/core-free-icons'"))) {
          hugeLines.push(lines[j]);
          j++;
        }
        
        // Output hugeicons imports first
        output.push(...hugeLines);
        // Then output the original "import {" line
        output.push(line);
        // Skip past the hugeicons lines
        i = j;
        changed = true;
        continue;
      }
    }
    
    output.push(line);
    i++;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, output.join('\n'));
    console.log(`FIXED: ${rel}`);
    return true;
  }
  return false;
}

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

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('@hugeicons')) {
    if (fixFile(filePath)) fixCount++;
  }
}

console.log(`\nDone. Fixed ${fixCount} files.`);
