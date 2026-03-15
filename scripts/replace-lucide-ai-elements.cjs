/**
 * Script to replace lucide-react imports in ai-elements components.
 * These use Icon-suffixed names (e.g., ChevronDownIcon, CopyIcon).
 */
const fs = require('fs');
const path = require('path');

// Mapping of lucide icon name (with Icon suffix) -> hugeicons icon name
const ICON_MAP_SUFFIXED = {
  'BotIcon': 'BotIcon',
  'XIcon': 'Cancel01Icon',
  'ChevronDownIcon': 'ArrowDown01Icon',
  'ChevronRightIcon': 'ArrowRight01Icon',
  'ChevronLeftIcon': 'ArrowLeft01Icon',
  'ChevronsUpDownIcon': 'ArrowDown01Icon',
  'DotIcon': 'DotIcon',
  'BrainIcon': 'Brain01Icon',
  'BookmarkIcon': 'BookmarkIcon',
  'CheckIcon': 'Tick02Icon',
  'CopyIcon': 'Copy01Icon',
  'EyeIcon': 'EyeIcon',
  'EyeOffIcon': 'ViewIcon',
  'FileIcon': 'File01Icon',
  'FolderIcon': 'Folder01Icon',
  'FolderOpenIcon': 'Folder01Icon',
  'ArrowLeftIcon': 'ArrowLeft01Icon',
  'ArrowRightIcon': 'ArrowRight01Icon',
  'CornerDownLeftIcon': 'ArrowDown01Icon',
  'ImageIcon': 'Image01Icon',
  'PlusIcon': 'Add01Icon',
  'SquareIcon': 'SquareIcon',
  'MicIcon': 'Microphone01Icon',
  'PaperclipIcon': 'Attachment01Icon',
  'SearchIcon': 'Search01Icon',
  'Code': 'Code01Icon',
  'AlertTriangleIcon': 'Alert01Icon',
  'TerminalIcon': 'Terminal01Icon',
  'Trash2Icon': 'Delete01Icon',
  'CheckCircleIcon': 'CheckmarkCircle01Icon',
  'CircleIcon': 'Circle01Icon',
  'ClockIcon': 'Clock01Icon',
  'WrenchIcon': 'Wrench01Icon',
  'XCircleIcon': 'CancelCircleIcon',
  'CircleSmallIcon': 'CircleSmallIcon',
  'ExternalLinkIcon': 'ArrowUpRight01Icon',
  'MessageCircleIcon': 'Message01Icon',
  'BookIcon': 'Book01Icon',
  'PauseIcon': 'PauseIcon',
  'PlayIcon': 'PlayIcon',
  // Voice selector icons (gender-related) - not available in hugeicons, 
  // skip these (MarsIcon, VenusIcon, etc.)
};

const dir = path.resolve('src/components/ai-elements');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const orig = content;
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  
  // Match lucide import
  const lucideImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?\n?/g;
  let match;
  const allImports = [];
  
  while ((match = lucideImportRegex.exec(content)) !== null) {
    allImports.push({
      full: match[0],
      icons: match[1].split(',').map(s => s.trim()).filter(Boolean)
    });
  }
  
  if (allImports.length === 0) return;
  
  const mapped = [];
  const unmapped = [];
  
  for (const imp of allImports) {
    for (const icon of imp.icons) {
      // Handle "Type as Alias" imports
      const baseName = icon.includes(' as ') ? icon.split(' as ')[0].trim() : icon;
      const alias = icon.includes(' as ') ? icon.split(' as ')[1].trim() : null;
      
      if (ICON_MAP_SUFFIXED[baseName]) {
        mapped.push({ from: baseName, alias, to: ICON_MAP_SUFFIXED[baseName], jsxName: alias || baseName });
      } else {
        unmapped.push(icon);
      }
    }
  }
  
  if (mapped.length === 0) {
    if (unmapped.length > 0) {
      console.log(`SKIP (all unmapped): ${rel} - ${unmapped.join(', ')}`);
    }
    return;
  }
  
  // Remove old lucide imports
  for (const imp of allImports) {
    content = content.replace(imp.full, '');
  }
  
  // Build new imports
  const hugeiconsNames = [...new Set(mapped.map(m => m.to))];
  const hasHugeiconsImport = content.includes("from '@hugeicons/react'");
  const hasCoreImport = content.includes("from '@hugeicons/core-free-icons'");
  
  let newImports = '';
  if (!hasHugeiconsImport) {
    newImports += "import { HugeiconsIcon } from '@hugeicons/react';\n";
  }
  if (!hasCoreImport && hugeiconsNames.length > 0) {
    newImports += `import { ${hugeiconsNames.join(', ')} } from '@hugeicons/core-free-icons';\n`;
  } else if (hasCoreImport && hugeiconsNames.length > 0) {
    const coreRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@hugeicons\/core-free-icons['"];?\n?/;
    const coreMatch = content.match(coreRegex);
    if (coreMatch) {
      const existingIcons = coreMatch[1].split(',').map(s => s.trim()).filter(Boolean);
      const allIcons = [...new Set([...existingIcons, ...hugeiconsNames])];
      content = content.replace(coreRegex, `import { ${allIcons.join(', ')} } from '@hugeicons/core-free-icons';\n`);
      // Don't add newImports for core
    } else {
      newImports += `import { ${hugeiconsNames.join(', ')} } from '@hugeicons/core-free-icons';\n`;
    }
  }
  
  // Keep unmapped imports from lucide-react
  if (unmapped.length > 0) {
    newImports += `import { ${unmapped.join(', ')} } from 'lucide-react';\n`;
  }
  
  // Insert new imports
  if (newImports) {
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^import\s/)) {
        lastImportIdx = i;
      }
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, newImports.trimEnd());
      content = lines.join('\n');
    } else {
      content = newImports + content;
    }
  }
  
  // Replace JSX usage
  for (const { jsxName, to } of mapped) {
    // Self-closing
    const selfCloseRegex = new RegExp(`<${jsxName}(\\s[^>]*)\\s*/>`, 'g');
    content = content.replace(selfCloseRegex, (match, attrs) => {
      attrs = attrs.replace(/\s+strokeWidth=\{[^}]*\}/g, '');
      attrs = attrs.replace(/(?:className="[^"]*?)(?:h-(\d+(?:\.\d+)?) w-\1)/g, (m) => {
        return m.replace(/h-(\d+(?:\.\d+)?) w-\1/, 'size-$1');
      });
      return `<HugeiconsIcon icon={${to}}${attrs} />`;
    });
    
    // Self-closing with no attrs
    const bareRegex = new RegExp(`<${jsxName}\\s*/>`, 'g');
    content = content.replace(bareRegex, `<HugeiconsIcon icon={${to}} />`);
    
    // Opening tag
    const openRegex = new RegExp(`<${jsxName}(\\s[^>]*)>`, 'g');
    content = content.replace(openRegex, (match, attrs) => {
      attrs = attrs.replace(/\s+strokeWidth=\{[^}]*\}/g, '');
      return `<HugeiconsIcon icon={${to}}${attrs}>`;
    });
    
    // Closing tag
    const closeRegex = new RegExp(`</${jsxName}>`, 'g');
    content = content.replace(closeRegex, '</HugeiconsIcon>');
  }
  
  if (content !== orig) {
    fs.writeFileSync(filePath, content);
    console.log(`OK: ${rel} (${mapped.length} icons, ${unmapped.length} kept as lucide)`);
  }
}

// Process all .tsx files in ai-elements
const entries = fs.readdirSync(dir, { withFileTypes: true });
for (const entry of entries) {
  if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
    const fullPath = path.join(dir, entry.name);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes("from 'lucide-react'") || content.includes('from "lucide-react"')) {
      processFile(fullPath);
    }
  }
}
