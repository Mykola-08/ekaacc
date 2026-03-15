/**
 * Comprehensive icon fix script.
 * Handles: wrong icon names, text corruptions, JSX wrapping, type fixes, missing imports.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let totalChanges = 0;

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function writeFile(relPath, content) {
  fs.writeFileSync(path.join(ROOT, relPath), content, 'utf8');
}

function replaceAll(content, old, replacement) {
  let count = 0;
  let result = content;
  while (result.includes(old)) {
    result = result.replace(old, replacement);
    count++;
  }
  return { result, count };
}

// ============================================
// PHASE 1: Global wrong icon name replacements
// ============================================
const WRONG_NAMES = {
  'Lock01Icon': 'LockIcon',
  'SmileFreeIcon': 'SmileIcon',
  'MehFreeIcon': 'MehIcon',
  'SadFreeIcon': 'Sad01Icon',
  'Filter01Icon': 'FilterIcon',
  'Zap01Icon': 'ZapIcon',
  'Phone01Icon': 'TelephoneIcon',
  'Clipboard01Icon': 'ClipboardIcon',
};

// Files to skip (editor/Plate, ai-elements, node_modules, scripts)
const SKIP_DIRS = ['node_modules', '.next', '.git', 'scripts', 'supabase'];
const SKIP_FILES_PATTERNS = [/editor-base-kit/, /comment\.tsx$/, /data-table\.tsx$/, /settings-dialog\.tsx$/, /use-chat\.ts$/];

function getAllTsFiles(dir) {
  const files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (SKIP_DIRS.includes(item)) continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getAllTsFiles(fullPath));
    } else if (/\.(tsx?|jsx?)$/.test(item)) {
      const rel = path.relative(ROOT, fullPath).replace(/\\/g, '/');
      const skip = SKIP_FILES_PATTERNS.some(p => p.test(rel));
      if (!skip) files.push(rel);
    }
  }
  return files;
}

function phase1_fixWrongNames() {
  console.log('\n=== PHASE 1: Fix wrong icon names globally ===');
  const files = getAllTsFiles(path.join(ROOT, 'src'));
  let fileCount = 0;
  for (const relPath of files) {
    let content = readFile(relPath);
    let changed = false;
    for (const [wrong, correct] of Object.entries(WRONG_NAMES)) {
      if (content.includes(wrong)) {
        const { result, count } = replaceAll(content, wrong, correct);
        content = result;
        console.log(`  ${relPath}: ${wrong} → ${correct} (${count}x)`);
        totalChanges += count;
        changed = true;
      }
    }
    if (changed) {
      writeFile(relPath, content);
      fileCount++;
    }
  }
  console.log(`  Phase 1 done: ${fileCount} files modified`);
}

// ============================================
// PHASE 2: Fix text corruptions from scripts
// ============================================
function phase2_fixTextCorruptions() {
  console.log('\n=== PHASE 2: Fix text corruptions ===');
  
  const fixes = [
    {
      file: 'src/components/platform/admin/analytics-dashboard-headless.tsx',
      replacements: [
        ['Tab.ListViewIcon', 'Tab.List'],
        ['Active UserMultipleIcon', 'Active Users'],
      ]
    }
  ];
  
  for (const { file, replacements } of fixes) {
    let content = readFile(file);
    let changed = false;
    for (const [old, replacement] of replacements) {
      if (content.includes(old)) {
        const { result, count } = replaceAll(content, old, replacement);
        content = result;
        console.log(`  ${file}: "${old}" → "${replacement}" (${count}x)`);
        totalChanges += count;
        changed = true;
      }
    }
    if (changed) writeFile(file, content);
  }
  console.log('  Phase 2 done');
}

// ============================================
// PHASE 3: Fix bare icon names (missing Icon suffix)
// ============================================
function phase3_fixBareNames() {
  console.log('\n=== PHASE 3: Fix bare icon names ===');
  
  // These files use bare names like `Activity` instead of `Activity01Icon`
  // Only fix specific files where TSC reported errors
  const bareNameFixes = [
    {
      file: 'src/app/(marketing)/cases/[id]/CaseDetailContent.tsx',
      replacements: [
        // Use word-boundary-aware replacements
      ]
    },
    {
      file: 'src/marketing/components/CasoDetailContent.tsx',
      replacements: []
    }
  ];
  
  // For CaseDetailContent.tsx and CasoDetailContent.tsx, 
  // bare names `Activity`, `Brain`, `Zap` need to become proper icon names
  // But these are used in import-like contexts. Let me handle them file-specifically.
  
  const caseFiles = [
    'src/app/(marketing)/cases/[id]/CaseDetailContent.tsx',
    'src/marketing/components/CasoDetailContent.tsx'
  ];
  
  for (const file of caseFiles) {
    let content = readFile(file);
    let changed = false;
    
    // Fix bare name imports/usages: "Activity" as identifier (not in strings)
    // These appear as standalone identifiers in import destructuring or object assignments
    // Be very careful: only replace when it's a standalone identifier
    
    // Pattern: at start of line or after { or , or space, followed by word boundary
    const bareReplacements = [
      // Match `Activity` as a standalone identifier (not part of Activity01Icon)
      [/\bActivity\b(?!01Icon|Icon|\w)/g, 'Activity01Icon'],
      [/\bBrain\b(?!01Icon|Icon|\w)/g, 'Brain01Icon'],
      [/\bZap\b(?!Icon|\w)/g, 'ZapIcon'],
    ];
    
    for (const [regex, replacement] of bareReplacements) {
      const newContent = content.replace(regex, replacement);
      if (newContent !== content) {
        const count = (content.match(regex) || []).length;
        console.log(`  ${file}: bare name fix (${count}x)`);
        content = newContent;
        totalChanges += count;
        changed = true;
      }
    }
    
    if (changed) writeFile(file, content);
  }
  
  console.log('  Phase 3 done');
}

// ============================================
// PHASE 4: Fix missing imports in specific files
// ============================================
function phase4_fixMissingImports() {
  console.log('\n=== PHASE 4: Fix missing imports ===');
  
  // ai-elements: add missing lucide-react imports
  const aiElementsFixes = [
    {
      file: 'src/components/ai-elements/artifact.tsx',
      addToLucideImport: ['XIcon'],
    },
    {
      file: 'src/components/ai-elements/chain-of-thought.tsx', 
      addToLucideImport: ['BrainIcon', 'ChevronDownIcon', 'DotIcon'],
    },
    {
      file: 'src/components/ai-elements/checkpoint.tsx',
      addToLucideImport: ['BookmarkIcon'],
    },
  ];
  
  for (const { file, addToLucideImport } of aiElementsFixes) {
    let content = readFile(file);
    
    // Check if file has `import type { LucideIcon } from 'lucide-react'`
    // Need to change to value import and add the icons
    if (content.includes("import type { LucideIcon } from 'lucide-react'")) {
      content = content.replace(
        "import type { LucideIcon } from 'lucide-react'",
        `import { type LucideIcon, ${addToLucideImport.join(', ')} } from 'lucide-react'`
      );
      console.log(`  ${file}: Added lucide imports: ${addToLucideImport.join(', ')}`);
      totalChanges++;
    } else if (content.includes("from 'lucide-react'")) {
      // Has an existing lucide-react import - add icons to it
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*'lucide-react'/,
        (match, imports) => {
          const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
          const toAdd = addToLucideImport.filter(i => !existing.includes(i));
          if (toAdd.length === 0) return match;
          return `import { ${[...existing, ...toAdd].join(', ')} } from 'lucide-react'`;
        }
      );
      console.log(`  ${file}: Augmented lucide imports with: ${addToLucideImport.join(', ')}`);
      totalChanges++;
    } else {
      // No lucide import at all - add one
      const importLine = `import { ${addToLucideImport.join(', ')} } from 'lucide-react';\n`;
      // Add after the last import
      const lastImportIdx = content.lastIndexOf('\nimport ');
      if (lastImportIdx >= 0) {
        const endOfLine = content.indexOf('\n', lastImportIdx + 1);
        content = content.slice(0, endOfLine + 1) + importLine + content.slice(endOfLine + 1);
      } else {
        content = importLine + content;
      }
      console.log(`  ${file}: Added new lucide import: ${addToLucideImport.join(', ')}`);
      totalChanges++;
    }
    
    writeFile(file, content);
  }
  
  // Fix jsx-preview.tsx and prompt-input.tsx: convert HugeiconsIcon usage to lucide
  // jsx-preview uses Alert01Icon → AlertTriangle from lucide
  {
    const file = 'src/components/ai-elements/jsx-preview.tsx';
    let content = readFile(file);
    
    // Replace <HugeiconsIcon icon={Alert01Icon} className="size-4 shrink-0"  />
    // with <AlertTriangleIcon className="size-4 shrink-0" />
    content = content.replace(
      '<HugeiconsIcon icon={Alert01Icon} className="size-4 shrink-0"  />',
      '<AlertTriangleIcon className="size-4 shrink-0" />'
    );
    
    // Add lucide import for AlertTriangleIcon
    if (!content.includes("from 'lucide-react'")) {
      const lastImportIdx = content.lastIndexOf('\nimport ');
      const endOfLine = content.indexOf('\n', lastImportIdx + 1);
      content = content.slice(0, endOfLine + 1) + 
        "import { AlertTriangleIcon } from 'lucide-react';\n" + 
        content.slice(endOfLine + 1);
    } else {
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*'lucide-react'/,
        (match, imports) => {
          const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
          if (!existing.includes('AlertTriangleIcon')) {
            existing.push('AlertTriangleIcon');
          }
          return `import { ${existing.join(', ')} } from 'lucide-react'`;
        }
      );
    }
    
    // Remove any leftover HugeiconsIcon/Alert01Icon imports if present
    content = content.replace(/import\s*{\s*HugeiconsIcon\s*}\s*from\s*'@hugeicons\/react';\n?/g, '');
    content = content.replace(/import\s*{\s*Alert01Icon\s*}\s*from\s*'@hugeicons\/core-free-icons';\n?/g, '');
    
    writeFile(file, content);
    console.log(`  ${file}: Replaced HugeiconsIcon usage with lucide AlertTriangleIcon`);
    totalChanges++;
  }
  
  // prompt-input.tsx: convert HugeiconsIcon+GlobeIcon to lucide Globe
  {
    const file = 'src/components/ai-elements/prompt-input.tsx';
    let content = readFile(file);
    
    // Replace <HugeiconsIcon icon={GlobeIcon} className="mr-2 size-4"  />
    // with <GlobeIcon className="mr-2 size-4" />
    content = content.replace(
      '<HugeiconsIcon icon={GlobeIcon} className="mr-2 size-4"  />',
      '<Globe className="mr-2 size-4" />'
    );
    
    // Remove Hugeicons imports
    content = content.replace(/import\s*{\s*HugeiconsIcon\s*}\s*from\s*'@hugeicons\/react';\n?/g, '');
    content = content.replace(/import\s*{\s*GlobeIcon\s*}\s*from\s*'@hugeicons\/core-free-icons';\n?/g, '');
    
    // Add lucide Globe import
    if (content.includes("from 'lucide-react'")) {
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*'lucide-react'/,
        (match, imports) => {
          const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
          if (!existing.includes('Globe')) existing.push('Globe');
          return `import { ${existing.join(', ')} } from 'lucide-react'`;
        }
      );
    } else {
      const lastImportIdx = content.lastIndexOf('\nimport ');
      const endOfLine = content.indexOf('\n', lastImportIdx + 1);
      content = content.slice(0, endOfLine + 1) + 
        "import { Globe } from 'lucide-react';\n" + 
        content.slice(endOfLine + 1);
    }
    
    writeFile(file, content);
    console.log(`  ${file}: Replaced HugeiconsIcon usage with lucide Globe`);
    totalChanges++;
  }
  
  // Fix missing UserIcon import in user-management-headless.tsx and settings-content-headless.tsx
  const filesNeedingUserIconImport = [
    'src/components/platform/admin/user-management-headless.tsx',
    'src/components/platform/settings/settings-content-headless.tsx',
  ];
  
  for (const file of filesNeedingUserIconImport) {
    let content = readFile(file);
    
    if (content.includes("from '@hugeicons/core-free-icons'")) {
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*'@hugeicons\/core-free-icons'/,
        (match, imports) => {
          const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
          if (!existing.includes('UserIcon')) existing.push('UserIcon');
          return `import { ${existing.join(', ')} } from '@hugeicons/core-free-icons'`;
        }
      );
      console.log(`  ${file}: Added UserIcon to Hugeicons import`);
      totalChanges++;
    } else {
      // Add new Hugeicons import
      const lastImportIdx = content.lastIndexOf('\nimport ');
      const endOfLine = content.indexOf('\n', lastImportIdx + 1);
      content = content.slice(0, endOfLine + 1) + 
        "import { UserIcon } from '@hugeicons/core-free-icons';\n" + 
        content.slice(endOfLine + 1);
      console.log(`  ${file}: Added new Hugeicons import for UserIcon`);
      totalChanges++;
    }
    
    writeFile(file, content);
  }
  
  // Fix HeartIcon → FavouriteIcon in files that use HeartIcon
  // HeartIcon doesn't exist in Hugeicons, it should be FavouriteIcon
  // The global replacement in Phase 1 didn't include this. Let me handle it:
  const heartIconFiles = [
    'src/app/(dashboard)/donations/reports/page.tsx',
    'src/components/community/CommunityFeed.tsx',
    'src/marketing/components/AboutElenaContent.tsx',
    'src/marketing/components/ServicesContent.tsx',
  ];
  
  for (const file of heartIconFiles) {
    let content = readFile(file);
    if (content.includes('HeartIcon')) {
      // Check if HeartIcon is imported from Hugeicons or not imported at all
      // If imported from hugeicons, it's wrong name. If not imported, it's a missing import.
      // In either case, replace HeartIcon with FavouriteIcon
      const { result, count } = replaceAll(content, 'HeartIcon', 'FavouriteIcon');
      content = result;
      
      // Ensure FavouriteIcon is in the hugeicons import
      if (content.includes("from '@hugeicons/core-free-icons'") && !content.includes('FavouriteIcon')) {
        content = content.replace(
          /import\s*{([^}]+)}\s*from\s*'@hugeicons\/core-free-icons'/,
          (match, imports) => {
            const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
            if (!existing.includes('FavouriteIcon')) existing.push('FavouriteIcon');
            return `import { ${existing.join(', ')} } from '@hugeicons/core-free-icons'`;
          }
        );
      }
      
      console.log(`  ${file}: HeartIcon → FavouriteIcon (${count}x)`);
      totalChanges += count;
      writeFile(file, content);
    }
  }
  
  // Fix HistoryIcon → WorkHistoryIcon in wallet
  {
    const file = 'src/components/platform/wallet/wallet-content-headless.tsx';
    let content = readFile(file);
    if (content.includes('HistoryIcon')) {
      const { result, count } = replaceAll(content, 'HistoryIcon', 'WorkHistoryIcon');
      content = result;
      // Ensure WorkHistoryIcon is imported
      if (content.includes("from '@hugeicons/core-free-icons'")) {
        content = content.replace(
          /import\s*{([^}]+)}\s*from\s*'@hugeicons\/core-free-icons'/,
          (match, imports) => {
            const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
            if (!existing.includes('WorkHistoryIcon')) existing.push('WorkHistoryIcon');
            return `import { ${existing.join(', ')} } from '@hugeicons/core-free-icons'`;
          }
        );
      }
      console.log(`  ${file}: HistoryIcon → WorkHistoryIcon (${count}x)`);
      totalChanges += count;
      writeFile(file, content);
    }
  }
  
  console.log('  Phase 4 done');
}

// ============================================
// PHASE 5: Wrap direct Hugeicons JSX with HugeiconsIcon
// ============================================
function phase5_wrapJsx() {
  console.log('\n=== PHASE 5: Wrap direct Hugeicons icon JSX with HugeiconsIcon ===');
  
  // Files where Hugeicons icons are used directly as JSX components
  // Pattern: <IconName className="..." /> → <HugeiconsIcon icon={IconName} className="..." />
  // Pattern: <feature.icon className="..." /> → <HugeiconsIcon icon={feature.icon} className="..." />
  
  const filesToFix = [
    // Direct icon names as JSX
    {
      file: 'src/components/platform/admin/analytics-dashboard-headless.tsx',
      iconPatterns: ['BarChartIcon', 'Activity01Icon'],
    },
    {
      file: 'src/components/platform/admin/role-management-panel-headless.tsx',
      iconPatterns: ['UserAdd01Icon', 'Edit01Icon'],
    },
    {
      file: 'src/components/platform/settings/billing-settings.tsx',
      iconPatterns: ['ShieldIcon', 'ReceiptTextIcon'],
    },
    {
      file: 'src/components/ai/widgets/daily-summary.tsx',
      iconPatterns: ['TimeIcon'],
    },
    // Variable-based icon rendering
    {
      file: 'src/components/ai/blocks/wellness-insights-card.tsx',
      iconPatterns: ['Icon'],
    },
    {
      file: 'src/components/ai/chat-welcome.tsx',
      iconPatterns: ['Icon'],
    },
    {
      file: 'src/components/ai/widgets/insights-panel.tsx',
      iconPatterns: ['Icon'],
    },
    // Object property icon rendering
    {
      file: 'src/components/business/BusinessPage.tsx',
      iconPatterns: ['feature\\.icon'],
    },
    {
      file: 'src/marketing/components/ContactForm.tsx',
      iconPatterns: ['item\\.icon', 'option\\.icon'],
    },
    {
      file: 'src/marketing/components/ContactFormOptimized.tsx',
      iconPatterns: ['item\\.icon', 'option\\.icon'],
    },
    {
      file: 'src/marketing/components/FooterPillMenu.tsx',
      iconPatterns: ['item\\.icon'],
    },
    {
      file: 'src/marketing/components/VIPContent.tsx',
      iconPatterns: ['service\\.icon'],
    },
  ];
  
  for (const { file, iconPatterns } of filesToFix) {
    let content = readFile(file);
    let changed = false;
    
    for (const pattern of iconPatterns) {
      // Match self-closing: <IconName className="..." /> or <IconName />
      const selfClosingRegex = new RegExp(
        `<(${pattern})(\\s[^>]*)?\\s*/>`,
        'g'
      );
      
      const newContent = content.replace(selfClosingRegex, (match, name, attrs) => {
        // Don't double-wrap if already wrapped
        if (match.includes('HugeiconsIcon')) return match;
        const cleanAttrs = attrs ? attrs : '';
        return `<HugeiconsIcon icon={${name}}${cleanAttrs} />`;
      });
      
      if (newContent !== content) {
        const count = (content.match(selfClosingRegex) || []).length;
        console.log(`  ${file}: Wrapped <${pattern} /> → <HugeiconsIcon icon={...} /> (${count}x)`);
        content = newContent;
        totalChanges += count;
        changed = true;
      }
      
      // Match opening tag (non-self-closing): <IconName className="...">
      const openRegex = new RegExp(
        `<(${pattern})(\\s[^>]*)?>(?!\\s*<HugeiconsIcon)`,
        'g'
      );
      const openContent = content.replace(openRegex, (match, name, attrs) => {
        if (match.includes('HugeiconsIcon')) return match;
        const cleanAttrs = attrs ? attrs : '';
        return `<HugeiconsIcon icon={${name}}${cleanAttrs}>`;
      });
      
      if (openContent !== content) {
        content = openContent;
        changed = true;
      }
      
      // Match closing tag: </IconName>
      const closeRegex = new RegExp(`</(${pattern})>`, 'g');
      const closeContent = content.replace(closeRegex, '</HugeiconsIcon>');
      if (closeContent !== content) {
        content = closeContent;
        changed = true;
      }
    }
    
    // Ensure HugeiconsIcon is imported
    if (changed && !content.includes("import { HugeiconsIcon }") && !content.includes("HugeiconsIcon }") && !content.includes("HugeiconsIcon,")) {
      // Check for existing @hugeicons/react import
      if (content.includes("from '@hugeicons/react'")) {
        content = content.replace(
          /import\s*{([^}]+)}\s*from\s*'@hugeicons\/react'/,
          (match, imports) => {
            const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
            if (!existing.includes('HugeiconsIcon')) existing.unshift('HugeiconsIcon');
            return `import { ${existing.join(', ')} } from '@hugeicons/react'`;
          }
        );
      } else {
        // Add new import
        const firstImportIdx = content.indexOf('import ');
        if (firstImportIdx >= 0) {
          content = content.slice(0, firstImportIdx) + 
            "import { HugeiconsIcon } from '@hugeicons/react';\n" + 
            content.slice(firstImportIdx);
        }
      }
    }
    
    if (changed) {
      writeFile(file, content);
    }
  }
  
  // Also handle CasosSection rendering (ProblemIcon pattern)
  {
    const file = 'src/marketing/components/CasosSection.tsx';
    let content = readFile(file);
    
    // Replace <ProblemIcon className="..." /> with <HugeiconsIcon icon={ProblemIcon} className="..." />
    content = content.replace(
      /<ProblemIcon(\s[^>]*)?\/>/g,
      (match, attrs) => `<HugeiconsIcon icon={ProblemIcon}${attrs || ''} />`
    );
    
    // Ensure HugeiconsIcon import
    if (!content.includes('HugeiconsIcon')) {
      if (content.includes("from '@hugeicons/react'")) {
        content = content.replace(
          /import\s*{([^}]+)}\s*from\s*'@hugeicons\/react'/,
          (match, imports) => {
            const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
            if (!existing.includes('HugeiconsIcon')) existing.unshift('HugeiconsIcon');
            return `import { ${existing.join(', ')} } from '@hugeicons/react'`;
          }
        );
      } else {
        const firstImportIdx = content.indexOf('import ');
        content = content.slice(0, firstImportIdx) + 
          "import { HugeiconsIcon } from '@hugeicons/react';\n" + 
          content.slice(firstImportIdx);
      }
    }
    
    writeFile(file, content);
    console.log(`  ${file}: Wrapped ProblemIcon JSX`);
    totalChanges++;
  }
  
  console.log('  Phase 5 done');
}

// ============================================
// PHASE 6: Fix type annotations (ComponentType/ElementType → IconSvgElement)
// ============================================
function phase6_fixTypes() {
  console.log('\n=== PHASE 6: Fix type annotations ===');
  
  // Files that need type annotation changes
  const typeFixFiles = [
    'src/marketing/components/CasosSection.tsx',
    'src/marketing/components/CasosContent.tsx',
  ];
  
  for (const file of typeFixFiles) {
    let content = readFile(file);
    let changed = false;
    
    // Replace React.ComponentType<{ className?: string }> with IconSvgElement
    if (content.includes('React.ComponentType<{ className?: string }>')) {
      content = content.replace(/React\.ComponentType<\{\s*className\?\s*:\s*string\s*\}>/g, 'IconSvgElement');
      changed = true;
    }
    if (content.includes('React.ComponentType<any>')) {
      content = content.replace(/React\.ComponentType<any>/g, 'IconSvgElement');
      changed = true;
    }
    if (content.includes('React.ElementType')) {
      content = content.replace(/React\.ElementType/g, 'IconSvgElement');
      changed = true;
    }
    if (content.includes('ComponentType<{ className?: string }>')) {
      content = content.replace(/ComponentType<\{\s*className\?\s*:\s*string\s*\}>/g, 'IconSvgElement');
      changed = true;
    }
    if (content.includes('ComponentType<any>')) {
      content = content.replace(/ComponentType<any>/g, 'IconSvgElement');
      changed = true;
    }
    if (content.includes(': ElementType')) {
      content = content.replace(/:\s*ElementType\b/g, ': IconSvgElement');
      changed = true;
    }
    
    if (changed) {
      // Add IconSvgElement import from @hugeicons/react
      if (!content.includes('IconSvgElement')) {
        // Already replaced above, so it should be there
      }
      if (content.includes("from '@hugeicons/react'")) {
        if (!content.includes('IconSvgElement')) {
          // This shouldn't happen since we just replaced types
        }
        content = content.replace(
          /import\s*{([^}]+)}\s*from\s*'@hugeicons\/react'/,
          (match, imports) => {
            const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
            if (!existing.some(e => e.includes('IconSvgElement'))) {
              existing.push('type IconSvgElement');
            }
            return `import { ${existing.join(', ')} } from '@hugeicons/react'`;
          }
        );
      } else {
        const firstImportIdx = content.indexOf('import ');
        content = content.slice(0, firstImportIdx) + 
          "import { type IconSvgElement } from '@hugeicons/react';\n" + 
          content.slice(firstImportIdx);
      }
      
      writeFile(file, content);
      console.log(`  ${file}: Fixed type annotations`);
      totalChanges++;
    }
  }
  
  // Fix type in wellness-insights-card.tsx: typeof Brain01Icon → IconSvgElement
  {
    const file = 'src/components/ai/blocks/wellness-insights-card.tsx';
    let content = readFile(file);
    if (content.includes('typeof Brain01Icon')) {
      content = content.replace(/typeof Brain01Icon/g, 'IconSvgElement');
      // Add IconSvgElement to @hugeicons/react import
      if (content.includes("from '@hugeicons/react'")) {
        content = content.replace(
          /import\s*{([^}]+)}\s*from\s*'@hugeicons\/react'/,
          (match, imports) => {
            const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
            if (!existing.some(e => e.includes('IconSvgElement'))) {
              existing.push('type IconSvgElement');
            }
            return `import { ${existing.join(', ')} } from '@hugeicons/react'`;
          }
        );
      } else {
        const firstImportIdx = content.indexOf('import ');
        content = content.slice(0, firstImportIdx) + 
          "import { type IconSvgElement } from '@hugeicons/react';\n" + 
          content.slice(firstImportIdx);
      }
      writeFile(file, content);
      console.log(`  ${file}: Fixed typeof Brain01Icon → IconSvgElement`);
      totalChanges++;
    }
  }
  
  console.log('  Phase 6 done');
}

// ============================================
// PHASE 7: Fix shared template components 
// ============================================
function phase7_fixSharedTemplates() {
  console.log('\n=== PHASE 7: Fix shared template components ===');
  
  // PersonalizedServiceTemplate — used by many marketing persona pages
  // Need to find it and change Icon prop type + rendering
  const templateFile = 'src/marketing/components/PersonalizedServiceTemplate.tsx';
  if (fs.existsSync(path.join(ROOT, templateFile))) {
    let content = readFile(templateFile);
    let changed = false;
    
    // Fix Icon prop type from ElementType/ComponentType to IconSvgElement
    if (content.includes('ElementType') || content.includes('ComponentType')) {
      // Replace in type/interface definitions
      content = content.replace(/Icon:\s*React\.ElementType/g, 'Icon: IconSvgElement');
      content = content.replace(/Icon:\s*ElementType/g, 'Icon: IconSvgElement');
      content = content.replace(/Icon:\s*React\.ComponentType<[^>]*>/g, 'Icon: IconSvgElement');
      content = content.replace(/Icon:\s*ComponentType<[^>]*>/g, 'Icon: IconSvgElement');
      changed = true;
    }
    
    // Fix rendering: <Icon className="..." /> → <HugeiconsIcon icon={Icon} className="..." />
    content = content.replace(
      /<Icon(\s[^>]*)?\/>/g,
      (match, attrs) => {
        if (match.includes('HugeiconsIcon')) return match;
        return `<HugeiconsIcon icon={Icon}${attrs || ''} />`;
      }
    );
    
    // Ensure imports
    if (changed || content.includes('<HugeiconsIcon')) {
      if (!content.includes('HugeiconsIcon')) {
        if (content.includes("from '@hugeicons/react'")) {
          content = content.replace(
            /import\s*{([^}]+)}\s*from\s*'@hugeicons\/react'/,
            (match, imports) => {
              const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
              if (!existing.includes('HugeiconsIcon')) existing.unshift('HugeiconsIcon');
              if (!existing.some(e => e.includes('IconSvgElement'))) existing.push('type IconSvgElement');
              return `import { ${existing.join(', ')} } from '@hugeicons/react'`;
            }
          );
        } else {
          const firstImportIdx = content.indexOf('import ');
          content = content.slice(0, firstImportIdx) + 
            "import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';\n" + 
            content.slice(firstImportIdx);
        }
      }
    }
    
    if (changed) {
      writeFile(file, content);
      console.log(`  ${templateFile}: Fixed Icon prop type and rendering`);
      totalChanges++;
    }
  }
  
  // PageSection component — used by session-notes/page.tsx
  // Find and fix it
  const pageFiles = getAllTsFiles(path.join(ROOT, 'src'));
  for (const pf of pageFiles) {
    if (pf.includes('PageSection') || (pf.includes('page-section'))) {
      console.log(`  Found potential PageSection: ${pf}`);
    }
  }
  
  console.log('  Phase 7 done');
}

// ============================================
// PHASE 8: Fix CaseDetailContent and CasoDetailContent type issues
// ============================================
function phase8_fixCaseFiles() {
  console.log('\n=== PHASE 8: Fix Case/Caso content files ===');
  
  const caseFiles = [
    'src/app/(marketing)/cases/[id]/CaseDetailContent.tsx',
    'src/marketing/components/CasoDetailContent.tsx',
  ];
  
  for (const file of caseFiles) {
    let content = readFile(file);
    let changed = false;
    
    // Fix ComponentType<any> → IconSvgElement
    if (content.includes('ComponentType<any>')) {
      content = content.replace(/ComponentType<any>/g, 'IconSvgElement');
      changed = true;
    }
    if (content.includes('React.ComponentType<any>')) {
      content = content.replace(/React\.ComponentType<any>/g, 'IconSvgElement');
      changed = true;
    }
    if (content.includes('ElementType')) {
      content = content.replace(/:\s*React\.ElementType\b/g, ': IconSvgElement');
      content = content.replace(/:\s*ElementType\b/g, ': IconSvgElement');
      changed = true;
    }
    
    // Fix icon rendering: find patterns like <Icon className="..." /> or <category.icon .../>
    // These files may render icons from the config
    content = content.replace(
      /<(category\.icon|problem\.icon|Icon)(\s[^>]*)?\/>/g,
      (match, name, attrs) => {
        if (match.includes('HugeiconsIcon')) return match;
        return `<HugeiconsIcon icon={${name}}${attrs || ''} />`;
      }
    );
    
    if (changed) {
      // Ensure imports
      if (!content.includes('HugeiconsIcon') || !content.includes('IconSvgElement')) {
        if (content.includes("from '@hugeicons/react'")) {
          content = content.replace(
            /import\s*{([^}]+)}\s*from\s*'@hugeicons\/react'/,
            (match, imports) => {
              const existing = imports.split(',').map(s => s.trim()).filter(Boolean);
              if (!existing.includes('HugeiconsIcon')) existing.unshift('HugeiconsIcon');
              if (!existing.some(e => e.includes('IconSvgElement'))) existing.push('type IconSvgElement');
              return `import { ${existing.join(', ')} } from '@hugeicons/react'`;
            }
          );
        } else {
          const firstImportIdx = content.indexOf('import ');
          content = content.slice(0, firstImportIdx) + 
            "import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';\n" + 
            content.slice(firstImportIdx);
        }
      }
      
      writeFile(file, content);
      console.log(`  ${file}: Fixed types and rendering`);
      totalChanges++;
    }
  }
  
  console.log('  Phase 8 done');
}

// ============================================
// PHASE 9: Fix rich-text-editor Leaf01Icon conflict
// ============================================
function phase9_fixMisc() {
  console.log('\n=== PHASE 9: Fix miscellaneous issues ===');
  
  // rich-text-editor.tsx has import conflict with Leaf01Icon
  {
    const file = 'src/components/platform/editor/rich-text-editor.tsx';
    if (fs.existsSync(path.join(ROOT, file))) {
      let content = readFile(file);
      // If there's both an import and a local declaration of Leaf01Icon,
      // rename the import to Leaf01HugeIcon or remove it
      if (content.includes("Leaf01Icon") && content.includes("from '@hugeicons/core-free-icons'")) {
        // Check if Leaf01Icon is in the hugeicons import line
        const match = content.match(/import\s*{([^}]*)Leaf01Icon([^}]*)}\s*from\s*'@hugeicons\/core-free-icons'/);
        if (match) {
          // Remove Leaf01Icon from the import (it conflicts with local declaration)
          content = content.replace(
            /import\s*{([^}]*)}\s*from\s*'@hugeicons\/core-free-icons'/,
            (m, imports) => {
              const items = imports.split(',').map(s => s.trim()).filter(s => s && s !== 'Leaf01Icon');
              if (items.length === 0) return ''; // Remove entire import
              return `import { ${items.join(', ')} } from '@hugeicons/core-free-icons'`;
            }
          );
          console.log(`  ${file}: Removed conflicting Leaf01Icon import`);
          totalChanges++;
          writeFile(file, content);
        }
      }
    }
  }
  
  console.log('  Phase 9 done');
}

// Run all phases
phase1_fixWrongNames();
phase2_fixTextCorruptions();
phase3_fixBareNames();
phase4_fixMissingImports();
phase5_wrapJsx();
phase6_fixTypes();
phase7_fixSharedTemplates();
phase8_fixCaseFiles();
phase9_fixMisc();

console.log(`\n=== ALL DONE: ${totalChanges} total changes ===`);
