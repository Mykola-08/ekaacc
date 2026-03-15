/**
 * Script to replace lucide-react imports with @hugeicons/react + @hugeicons/core-free-icons
 * across all component files (excluding ui/ and editor/).
 */
const fs = require('fs');
const path = require('path');

// Mapping of lucide icon name -> hugeicons icon name
const ICON_MAP = {
  // Common
  'Check': 'Tick02Icon',
  'X': 'Cancel01Icon',
  'Plus': 'Add01Icon',
  'Search': 'Search01Icon',
  'Loader2': 'Loading03Icon',
  'AlertCircle': 'Alert01Icon',
  'AlertTriangle': 'Alert01Icon',
  'ChevronRight': 'ArrowRight01Icon',
  'ChevronDown': 'ArrowDown01Icon',
  'ExternalLink': 'ArrowUpRight01Icon',
  'MoreVertical': 'MoreVerticalIcon',
  'MoreHorizontal': 'MoreHorizontalIcon',
  'RefreshCw': 'Refresh01Icon',
  'RotateCcw': 'RotateIcon',
  'Download': 'Download01Icon',
  'Upload': 'Upload01Icon',

  // Communication
  'Send': 'SentIcon',
  'Phone': 'Phone01Icon',
  'Video': 'Video01Icon',
  'MessageSquare': 'Message01Icon',
  'MessageCircle': 'Message01Icon',
  'Mail': 'Message01Icon',
  'Mic': 'Microphone01Icon',
  'MicOff': 'MicOff01Icon',
  'VideoOff': 'VideoOffIcon',

  // Navigation & Layout
  'ArrowLeft': 'ArrowLeft01Icon',
  'ArrowRight': 'ArrowRight01Icon',
  'PanelLeft': 'PanelLeftIcon',
  'Navigation': 'Navigation01Icon',
  'Move': 'Move01Icon',
  'Globe': 'GlobeIcon',
  'Monitor': 'GlobeIcon',
  'Eye': 'EyeIcon',
  'EyeOff': 'ViewIcon',
  'Home': 'Home01Icon',

  // Content
  'Copy': 'Copy01Icon',
  'Trash2': 'Delete01Icon',
  'Save': 'FloppyDiskIcon',
  'Paperclip': 'Attachment01Icon',
  'Link': 'Link01Icon',
  'Tag': 'Tag01Icon',
  'Layers': 'Layers01Icon',
  'Edit': 'Edit01Icon',
  'File': 'File01Icon',
  'Hash': 'HashtagIcon',
  'Receipt': 'ReceiptIcon',
  'Package': 'Package01Icon',

  // Calendar & Time
  'Calendar': 'Calendar03Icon',
  'CalendarDays': 'Calendar02Icon',
  'Clock': 'Clock01Icon',
  'History': 'HistoryIcon',

  // User & Auth
  'User': 'UserIcon',
  'Users': 'UserIcon',
  'UserPlus': 'UserAdd01Icon',
  'PlusCircle': 'PlusCircleIcon',
  'Shield': 'ShieldIcon',
  'ShieldCheck': 'ShieldIcon',
  'Lock': 'Lock01Icon',
  'LogOut': 'ArrowRight01Icon',

  // Finance
  'Wallet': 'Wallet01Icon',
  'CreditCard': 'CreditCardIcon',
  'DollarSign': 'CreditCardIcon',

  // Status & Feedback
  'CheckCircle2': 'CheckmarkCircle01Icon',
  'CheckCircle': 'CheckmarkCircle01Icon',
  'XCircle': 'CancelCircleIcon',
  'Ban': 'Cancel01Icon',
  'Bell': 'Bell01Icon',
  'ThumbsUp': 'ThumbsUpIcon',
  'ThumbsDown': 'ThumbsDownIcon',

  // Charts  
  'Activity': 'Activity01Icon',
  'BarChart3': 'BarChart01Icon',
  'BarChart': 'BarChart01Icon',
  'PieChart': 'PieChart01Icon',
  'TrendingUp': 'AnalyticsUpIcon',
  'LayoutGrid': 'LayoutGridIcon',
  'List': 'List01Icon',

  // Misc
  'Settings': 'Settings01Icon',
  'Brain': 'Brain01Icon',
  'Heart': 'HeartIcon',
  'Sparkles': 'SparklesIcon',
  'BookOpen': 'Book02Icon',
  'Smile': 'SmileFreeIcon',
  'Frown': 'SadFreeIcon',
  'Meh': 'MehFreeIcon',
  'Moon': 'Moon01Icon',
  'Sun': 'Sun01Icon',
  'Star': 'StarIcon',
  'MapPin': 'Location01Icon',
  'Target': 'Target01Icon',
  'Zap': 'Zap01Icon',
  'Lightbulb': 'Idea01Icon',
  'Building2': 'Building02Icon',
};

// Find all files that import from lucide-react
function findFilesWithLucide(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules, .git, ui directory, editor directory
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      results.push(...findFilesWithLucide(fullPath));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("from 'lucide-react'") || content.includes('from "lucide-react"')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// Directories to process
const dirs = [
  'src/components/dashboard',
  'src/components/platform',
  'src/components/ai',
  'src/components/admin',
  'src/components/journal',
  'src/components/resources',
  'src/components/features',
  'src/components/business',
  'src/components/community',
  'src/components/payment',
  'src/components/settings',
  'src/components/ai-elements',
];

let allFiles = [];
for (const dir of dirs) {
  const fullDir = path.resolve(dir);
  if (fs.existsSync(fullDir)) {
    allFiles.push(...findFilesWithLucide(fullDir));
  }
}

// Also check root-level component files (dropzone.tsx, etc.)
const componentsRoot = path.resolve('src/components');
const rootEntries = fs.readdirSync(componentsRoot, { withFileTypes: true });
for (const entry of rootEntries) {
  if (!entry.isDirectory() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
    const fullPath = path.join(componentsRoot, entry.name);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes("from 'lucide-react'") || content.includes('from "lucide-react"')) {
      allFiles.push(fullPath);
    }
  }
}

// Also skip editor files
allFiles = allFiles.filter(f => {
  const rel = path.relative(process.cwd(), f).replace(/\\/g, '/');
  return !rel.includes('/editor/') && !rel.includes('plate') && !rel.includes('code-block');
});

console.log(`Found ${allFiles.length} files with lucide-react imports\n`);

let totalReplacements = 0;

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  
  // Extract lucide import statement
  const lucideImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?\n?/;
  const match = content.match(lucideImportRegex);
  if (!match) continue;
  
  const importedIcons = match[1].split(',').map(s => s.trim()).filter(Boolean);
  
  // Check for type-only imports (like LucideIcon)
  const typeImports = importedIcons.filter(name => {
    const baseName = name.includes(' as ') ? name.split(' as ')[0].trim() : name;
    return baseName === 'LucideIcon' || name.startsWith('type ');
  });
  const iconImports = importedIcons.filter(name => {
    const baseName = name.includes(' as ') ? name.split(' as ')[0].trim() : name;
    return baseName !== 'LucideIcon' && !name.startsWith('type ');
  });
  
  // Map icons (handle aliased imports)
  const mapped = [];
  const unmapped = [];
  for (const iconSpec of iconImports) {
    let icon, alias;
    if (iconSpec.includes(' as ')) {
      const parts = iconSpec.split(' as ').map(s => s.trim());
      icon = parts[0];
      alias = parts[1];
    } else {
      icon = iconSpec;
      alias = null;
    }
    if (ICON_MAP[icon]) {
      mapped.push({ from: icon, alias: alias, to: ICON_MAP[icon] });
    } else {
      unmapped.push(iconSpec);
    }
  }
  
  if (unmapped.length > 0) {
    console.log(`WARNING: ${rel} has unmapped icons: ${unmapped.join(', ')}`);
  }
  
  if (mapped.length === 0 && typeImports.length > 0) {
    // Only type imports - skip for now
    console.log(`SKIP (type-only): ${rel}`);
    continue;
  }
  
  // Build hugeicons import
  const hugeiconsNames = [...new Set(mapped.map(m => m.to))];
  const hasHugeiconsImport = content.includes("from '@hugeicons/react'");
  const hasCoreImport = content.includes("from '@hugeicons/core-free-icons'");
  
  // Remove old lucide import
  content = content.replace(lucideImportRegex, '');
  
  // Add hugeicons imports at the position where lucide was
  let newImports = '';
  if (!hasHugeiconsImport) {
    newImports += "import { HugeiconsIcon } from '@hugeicons/react';\n";
  }
  if (!hasCoreImport && hugeiconsNames.length > 0) {
    newImports += `import { ${hugeiconsNames.join(', ')} } from '@hugeicons/core-free-icons';\n`;
  } else if (hasCoreImport && hugeiconsNames.length > 0) {
    // Need to merge with existing core import
    const coreRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@hugeicons\/core-free-icons['"];?\n?/;
    const coreMatch = content.match(coreRegex);
    if (coreMatch) {
      const existingIcons = coreMatch[1].split(',').map(s => s.trim()).filter(Boolean);
      const allIcons = [...new Set([...existingIcons, ...hugeiconsNames])];
      content = content.replace(coreRegex, `import { ${allIcons.join(', ')} } from '@hugeicons/core-free-icons';\n`);
    }
  }
  
  // Insert new imports after the last existing import or at top
  if (newImports) {
    // Find good insertion point - after last import statement
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].match(/^\s*import\s/)) {
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
  
  // Replace JSX usage: <IconName className="..." /> -> <HugeiconsIcon icon={IconName} className="..." />
  // Also handle <IconName className="..." strokeWidth={...} />
  for (const { from, alias, to } of mapped) {
    // The name used in JSX is the alias if present, otherwise the original name
    const jsxName = alias || from;
    
    // Self-closing: <Icon className="h-4 w-4" strokeWidth={2.5} />
    const selfCloseRegex = new RegExp(`<${jsxName}(\\s[^>]*)\\s*/>`, 'g');
    content = content.replace(selfCloseRegex, (match, attrs) => {
      // Remove strokeWidth prop
      attrs = attrs.replace(/\s+strokeWidth=\{[^}]*\}/g, '');
      // Replace h-N w-N with size-N
      attrs = attrs.replace(/(?:className="[^"]*?)(?:h-(\d+(?:\.\d+)?) w-\1)/g, (m) => {
        return m.replace(/h-(\d+(?:\.\d+)?) w-\1/, 'size-$1');
      });
      return `<HugeiconsIcon icon={${to}}${attrs} />`;
    });
    
    // Opening tag: <Icon className="...">
    const openRegex = new RegExp(`<${jsxName}(\\s[^>]*)>`, 'g');
    content = content.replace(openRegex, (match, attrs) => {
      attrs = attrs.replace(/\s+strokeWidth=\{[^}]*\}/g, '');
      return `<HugeiconsIcon icon={${to}}${attrs}>`;
    });
    
    // Closing tag: </Icon>
    const closeRegex = new RegExp(`</${jsxName}>`, 'g');
    content = content.replace(closeRegex, '</HugeiconsIcon>');
  }
  
  // Handle type imports that were mixed with icon imports
  if (typeImports.length > 0) {
    // We need to handle LucideIcon type - it maps to IconType from hugeicons or just use any
    // For StatsCard which uses LucideIcon as a type, we'll handle it specially
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`OK: ${rel} (${mapped.length} icons replaced)`);
  totalReplacements += mapped.length;
}

console.log(`\nTotal: ${totalReplacements} icon replacements across ${allFiles.length} files`);
