/**
 * Comprehensive lucide-react → Hugeicons replacement script.
 * Covers ALL remaining files in src/ (pages, marketing, contexts, components).
 * Skips editor/Plate UI components (src/components/ui/block-*, align-toolbar-button, etc.)
 */
const fs = require('fs');
const path = require('path');

// Complete mapping: lucide name -> Hugeicons name
const ICON_MAP = {
  // Arrows & Navigation
  'ArrowLeft': 'ArrowLeft01Icon',
  'ArrowRight': 'ArrowRight01Icon',
  'ArrowUpRight': 'ArrowUpRight01Icon',
  'ArrowDownRight': 'ArrowTurnDownIcon',
  'ChevronDown': 'ArrowDown01Icon',
  'ChevronRight': 'ArrowRight01Icon',
  'ChevronLeft': 'ArrowLeft01Icon',
  'ChevronsUpDown': 'ArrowDown01Icon',
  'ExternalLink': 'ArrowUpRight01Icon',
  'Navigation': 'Navigation01Icon',
  'CornerDownLeft': 'ArrowTurnDownIcon',
  
  // Status & Feedback
  'Check': 'Tick02Icon',
  'CheckCircle': 'CheckmarkCircle01Icon',
  'CheckCircle2': 'CheckmarkCircle01Icon',
  'X': 'Cancel01Icon',
  'XCircle': 'CancelCircleIcon',
  'AlertCircle': 'Alert01Icon',
  'AlertTriangle': 'Alert01Icon',
  'Info': 'InformationCircleIcon',
  'Ban': 'Cancel01Icon',
  
  // Loading & Progress
  'Loader2': 'Loading03Icon',
  'RefreshCw': 'Refresh01Icon',
  'RotateCcw': 'RotateIcon',
  'Activity': 'Activity01Icon',
  
  // User & People
  'User': 'UserIcon',
  'Users': 'UserMultipleIcon',
  'UserPlus': 'UserAdd01Icon',
  
  // Communication
  'Send': 'SentIcon',
  'Phone': 'Phone01Icon',
  'Video': 'Video01Icon',
  'MessageSquare': 'Message01Icon',
  'MessageCircle': 'Message01Icon',
  'Mic': 'Microphone01Icon',
  'Mail': 'Mail01Icon',
  
  // Time & Calendar
  'Calendar': 'Calendar03Icon',
  'CalendarDays': 'Calendar02Icon',
  'Clock': 'Clock01Icon',
  'History': 'WorkHistoryIcon',
  
  // Location
  'MapPin': 'Location01Icon',
  'Globe': 'GlobeIcon',
  
  // Finance & Commerce
  'Wallet': 'Wallet01Icon',
  'CreditCard': 'CreditCardIcon',
  'DollarSign': 'DollarCircleIcon',
  'Receipt': 'InvoiceIcon',
  'Tag': 'Tag01Icon',
  'Percent': 'PercentSquareIcon',
  'Gift': 'GiftIcon',
  'Crown': 'CrownIcon',
  
  // Actions
  'Plus': 'Add01Icon',
  'PlusCircle': 'PlusSignCircleIcon',
  'Search': 'Search01Icon',
  'Settings': 'Settings01Icon',
  'Download': 'Download01Icon',
  'Upload': 'Upload01Icon',
  'Save': 'FloppyDiskIcon',
  'Edit': 'Edit01Icon',
  'Pencil': 'PencilIcon',
  'Trash2': 'Delete01Icon',
  'Copy': 'Copy01Icon',
  'Link': 'Link01Icon',
  'Paperclip': 'Attachment01Icon',
  'Share2': 'Share01Icon',
  
  // Content & Files
  'File': 'File01Icon',
  'FileText': 'File01Icon',
  'BookOpen': 'Book02Icon',
  'Layers': 'Layers01Icon',
  'LayoutGrid': 'LayoutGridIcon',
  'List': 'List01Icon',
  
  // Data & Charts
  'BarChart': 'BarChart01Icon',
  'BarChart3': 'BarChart01Icon',
  'PieChart': 'PieChart01Icon',
  'TrendingUp': 'AnalyticsUpIcon',
  'TrendingDown': 'ArrowTurnDownIcon',
  
  // Security & Auth
  'Lock': 'Lock01Icon',
  'Shield': 'ShieldIcon',
  'Eye': 'EyeIcon',
  'EyeOff': 'ViewIcon',
  'Key': 'Key01Icon',
  'LogOut': 'Logout01Icon',
  
  // UI & Layout
  'Bell': 'Bell01Icon',
  'Home': 'Home01Icon',
  'LayoutDashboard': 'DashboardSquare01Icon',
  'MoreVertical': 'MoreVerticalIcon',
  'MoreHorizontal': 'MoreHorizontalIcon',
  'Menu': 'Menu01Icon',
  
  // Nature & Health
  'Brain': 'Brain01Icon',
  'Heart': 'HeartIcon',
  'HeartPulse': 'Pulse01Icon',
  'Sparkles': 'SparklesIcon',
  'Smile': 'SmileFreeIcon',
  'SmilePlus': 'SmilePlusIcon',
  'Frown': 'SadFreeIcon',
  'Meh': 'MehFreeIcon',
  'Sun': 'Sun01Icon',
  'Moon': 'Moon01Icon',
  'Target': 'Target01Icon',
  'Zap': 'Zap01Icon',
  'Lightbulb': 'Idea01Icon',
  'Leaf': 'Leaf01Icon',
  'Dna': 'DnaIcon',
  
  // Media
  'PlayCircle': 'PlayCircleIcon',
  'Play': 'PlayIcon',
  'Pause': 'PauseIcon',
  'Music': 'MusicNote01Icon',
  'Image': 'Image01Icon',
  
  // Buildings & Work
  'Building2': 'Building02Icon',
  'Briefcase': 'Briefcase01Icon',
  'Monitor': 'ComputerActivityIcon',
  'Cookie': 'CookieIcon',
  
  // Bookmarks & Favorites
  'Star': 'StarIcon',
  'Bookmark': 'Bookmark01Icon',
  'BookmarkPlus': 'Bookmark01Icon',
  
  // Social & Feedback
  'ThumbsUp': 'ThumbsUpIcon',
  'ThumbsDown': 'ThumbsDownIcon',
  
  // Art & Creativity
  'Palette': 'PaintBoardIcon',
  
  // Misc
  'Bot': 'BotIcon',
  
  // Additional from therapist pages
  'Stethoscope': 'Stethoscope01Icon',
  'ClipboardList': 'Clipboard01Icon',
  'ClipboardCheck': 'Clipboard01Icon',
  'FileEdit': 'FileEdit01Icon',
  'FolderOpen': 'Folder01Icon',
  'Filter': 'Filter01Icon',
  'SortDesc': 'SortIcon',
  'Calendar1': 'Calendar01Icon',
  'CalendarCheck': 'Calendar03Icon',
  'UserCheck': 'UserCheck01Icon',
  'FileQuestion': 'File01Icon',
  'ChevronUp': 'ArrowUp01Icon',
};

// Files/patterns to skip (Plate editor components)
const SKIP_PATTERNS = [
  'block-draggable',
  'block-discussion',
  'block-suggestion',
  'block-list-static',
  'align-toolbar-button',
  'block-context-menu',
  'block-menu',
  'block-toolbar',
  'callout-element',
  'code-block',
  'column-element',
  'comment',
  'cursor-overlay',
  'date-element',
  'emoji',
  'equation',
  'fixed-toolbar',
  'floating-toolbar',
  'ghost-text',
  'hr-element',
  'image-element',
  'indent-todo',
  'link-element',
  'list-element',
  'media-',
  'mention-',
  'paragraph-element',
  'placeholder',
  'slash-input',
  'table-',
  'toc-element',
  'toggle-element',
  'editor-base-kit',
];

function shouldSkip(filePath) {
  const basename = path.basename(filePath);
  return SKIP_PATTERNS.some(p => basename.includes(p));
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const orig = content;
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  
  // Match lucide import lines
  const lucideImportRegex = /import\s*(?:type\s*)?\{([^}]+)\}\s*from\s*['"]lucide-react['"];?\n?/g;
  let match;
  const allImports = [];
  
  while ((match = lucideImportRegex.exec(content)) !== null) {
    const isTypeOnly = match[0].includes('import type');
    allImports.push({
      full: match[0],
      icons: match[1].split(',').map(s => s.trim()).filter(Boolean),
      isTypeOnly,
    });
  }
  
  if (allImports.length === 0) return;
  
  const mapped = [];
  const unmapped = [];
  const typeImports = [];
  
  for (const imp of allImports) {
    for (const icon of imp.icons) {
      const baseName = icon.includes(' as ') ? icon.split(' as ')[0].trim() : icon;
      const alias = icon.includes(' as ') ? icon.split(' as ')[1].trim() : null;
      
      if (imp.isTypeOnly) {
        typeImports.push(icon);
        continue;
      }
      
      if (ICON_MAP[baseName]) {
        mapped.push({ from: baseName, alias, to: ICON_MAP[baseName], jsxName: alias || baseName });
      } else {
        unmapped.push(icon);
      }
    }
  }
  
  if (mapped.length === 0 && typeImports.length === 0) {
    if (unmapped.length > 0) {
      console.log(`SKIP (unmapped): ${rel} - ${unmapped.join(', ')}`);
    }
    return;
  }
  
  // Handle type-only imports (like LucideIcon) - skip file
  if (typeImports.length > 0 && mapped.length === 0) {
    console.log(`SKIP (type-only): ${rel} - ${typeImports.join(', ')}`);
    return;
  }
  
  // Remove old lucide imports
  for (const imp of allImports) {
    if (!imp.isTypeOnly) {
      content = content.replace(imp.full, '');
    }
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
    // Merge into existing core import
    const coreRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@hugeicons\/core-free-icons['"];?\n?/;
    const coreMatch = content.match(coreRegex);
    if (coreMatch) {
      const existingIcons = coreMatch[1].split(',').map(s => s.trim()).filter(Boolean);
      const allIcons = [...new Set([...existingIcons, ...hugeiconsNames])];
      content = content.replace(coreRegex, `import { ${allIcons.join(', ')} } from '@hugeicons/core-free-icons';\n`);
    } else {
      newImports += `import { ${hugeiconsNames.join(', ')} } from '@hugeicons/core-free-icons';\n`;
    }
  }
  
  // Keep unmapped as lucide
  if (unmapped.length > 0) {
    newImports += `import { ${unmapped.join(', ')} } from 'lucide-react';\n`;
  }
  
  // Insert new imports after last import line
  if (newImports) {
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/^import\s/.test(lines[i]) || (lastImportIdx >= 0 && /^\s*\}/.test(lines[i]) && i === lastImportIdx + 1)) {
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
    // Self-closing with attributes
    const selfCloseRegex = new RegExp(`<${jsxName}(\\s[^>]*)\\s*/>`, 'g');
    content = content.replace(selfCloseRegex, (match, attrs) => {
      attrs = attrs.replace(/\s+strokeWidth=\{[^}]*\}/g, '');
      // h-N w-N -> size-N
      attrs = attrs.replace(/\bh-(\d+(?:\.\d+)?)\s+w-\1\b/g, 'size-$1');
      attrs = attrs.replace(/\bw-(\d+(?:\.\d+)?)\s+h-\1\b/g, 'size-$1');
      return `<HugeiconsIcon icon={${to}}${attrs} />`;
    });
    
    // Self-closing bare
    const bareRegex = new RegExp(`<${jsxName}\\s*/>`, 'g');
    content = content.replace(bareRegex, `<HugeiconsIcon icon={${to}} className="size-4" />`);
    
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
    const mappedNames = mapped.map(m => `${m.from}→${m.to}`);
    console.log(`OK: ${rel} (${mapped.length} icons: ${mappedNames.join(', ')}${unmapped.length > 0 ? '; kept: ' + unmapped.join(', ') : ''})`);
  } else {
    console.log(`NOCHANGE: ${rel}`);
  }
}

// Collect all .tsx/.ts files in src/ recursively
function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and .next
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      results.push(...collectFiles(fullPath));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Process all files in src/
const srcDir = path.resolve('src');
const allFiles = collectFiles(srcDir);
let processed = 0;

for (const filePath of allFiles) {
  if (shouldSkip(filePath)) continue;
  
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("from 'lucide-react'") || content.includes('from "lucide-react"')) {
    processFile(filePath);
    processed++;
  }
}

console.log(`\nDone. Processed ${processed} files.`);
