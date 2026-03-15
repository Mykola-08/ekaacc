/**
 * Fix ai-elements icon imports:
 * 1. Remove @hugeicons/react and @hugeicons/core-free-icons imports
 * 2. Scan for XxxIcon usage patterns
 * 3. Add back lucide-react imports
 */
const fs = require('fs');
const path = require('path');

const AI_ELEMENTS_DIR = path.join(process.cwd(), 'src', 'components', 'ai-elements');

// All known lucide-react icon names used in ai-elements (with Icon suffix)
const KNOWN_LUCIDE_ICONS = new Set([
  'BotIcon', 'XIcon', 'BrainIcon', 'ChevronDownIcon', 'DotIcon',
  'BookmarkIcon', 'CheckIcon', 'CopyIcon', 'EyeIcon', 'EyeOffIcon',
  'ChevronRightIcon', 'FolderOpenIcon', 'FolderIcon', 'FileIcon',
  'ArrowLeftIcon', 'ArrowRightIcon', 'ChevronLeftIcon', 'ChevronsUpDownIcon',
  'MessageCircleIcon', 'ExternalLinkIcon', 'ImageIcon', 'PlusIcon',
  'CornerDownLeftIcon', 'SquareIcon', 'PaperclipIcon', 'WrenchIcon',
  'ClockIcon', 'CheckCircleIcon', 'CircleIcon', 'XCircleIcon',
  'SearchIcon', 'TerminalIcon', 'Trash2Icon', 'MarsIcon', 'VenusIcon',
  'TransgenderIcon', 'MarsStrokeIcon', 'NonBinaryIcon', 'VenusAndMarsIcon',
  'CircleSmallIcon', 'PlayIcon', 'PauseIcon', 'AlertTriangleIcon',
  'CodeIcon', 'MicIcon',
]);

const files = fs.readdirSync(AI_ELEMENTS_DIR).filter(f => f.endsWith('.tsx'));
let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(AI_ELEMENTS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file has hugeicons imports
  if (!content.includes('@hugeicons/')) continue;
  
  // Remove hugeicons import lines
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();
    return !trimmed.includes('@hugeicons/react') && !trimmed.includes('@hugeicons/core-free-icons');
  });
  content = cleanedLines.join('\n');
  
  // Find all XxxIcon patterns used in the file (not in imports/strings)
  const iconPattern = /\b([A-Z][a-zA-Z0-9]*Icon)\b/g;
  const usedIcons = new Set();
  let match;
  while ((match = iconPattern.exec(content)) !== null) {
    const iconName = match[1];
    if (KNOWN_LUCIDE_ICONS.has(iconName)) {
      usedIcons.add(iconName);
    }
  }
  
  if (usedIcons.size === 0) {
    // Just remove hugeicons imports, no lucide-react needed
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ${file}: removed hugeicons imports (no icons used)`);
    totalFixed++;
    continue;
  }
  
  // Check if lucide-react import already exists
  const hasLucideImport = content.includes('lucide-react');
  
  if (!hasLucideImport) {
    // Add lucide-react import after the last import statement
    const iconList = Array.from(usedIcons).sort().join(', ');
    const lucideImport = `import { ${iconList} } from 'lucide-react';`;
    
    // Find the position to insert (after last import)
    const importRegex = /^import\s.+$/gm;
    let lastImportEnd = 0;
    let m;
    while ((m = importRegex.exec(content)) !== null) {
      // Handle multi-line imports
      if (m[0].includes('{') && !m[0].includes('}')) {
        // Multi-line import, find the closing brace
        const closingIdx = content.indexOf('}', m.index + m[0].length);
        if (closingIdx !== -1) {
          const semiIdx = content.indexOf(';', closingIdx);
          lastImportEnd = semiIdx !== -1 ? semiIdx + 1 : closingIdx + 1;
        }
      } else {
        lastImportEnd = m.index + m[0].length;
      }
    }
    
    if (lastImportEnd > 0) {
      content = content.slice(0, lastImportEnd) + '\n' + lucideImport + content.slice(lastImportEnd);
    }
  } else {
    // Merge into existing lucide-react import
    const lucideImportMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
    if (lucideImportMatch) {
      const existingIcons = lucideImportMatch[1].split(',').map(s => s.trim()).filter(Boolean);
      const allIcons = new Set([...existingIcons, ...usedIcons]);
      const newImport = `import { ${Array.from(allIcons).sort().join(', ')} } from 'lucide-react'`;
      content = content.replace(lucideImportMatch[0], newImport);
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ${file}: restored lucide-react with ${usedIcons.size} icons: ${Array.from(usedIcons).join(', ')}`);
  totalFixed++;
}

console.log(`\nFixed ${totalFixed} ai-elements files`);
