/**
 * Comprehensive icon fix script:
 * 1. Fix wrong Hugeicons import names
 * 2. Replace bare lucide icon name references with Hugeicons equivalents
 * 3. Ensure referenced icons are properly imported
 */
const fs = require('fs');
const path = require('path');

// Wrong import names → correct Hugeicons names
const IMPORT_FIXES = {
  'HeartIcon': 'FavouriteIcon',
  'Lock01Icon': 'LockIcon',
  'SmileFreeIcon': 'SmileIcon',
  'SadFreeIcon': 'Sad01Icon',
  'MehFreeIcon': 'MehIcon',
  'Filter01Icon': 'FilterIcon',
  'Zap01Icon': 'ZapIcon',
  'Stethoscope01Icon': 'StethoscopeIcon',
  'Phone01Icon': 'TelephoneIcon',
  'Microphone01Icon': 'Mic01Icon',
  'Bell01Icon': 'Notification01Icon',
  'HistoryIcon': 'WorkHistoryIcon',
  'PlusCircleIcon': 'PlusSignCircleIcon',
  'List01Icon': 'ListViewIcon',
  'Clipboard01Icon': 'ClipboardIcon',
};

// Bare lucide names → Hugeicons names (for value/type references)
const BARE_FIXES = {
  'Heart': 'FavouriteIcon',
  'Brain': 'Brain01Icon',
  'Zap': 'ZapIcon',
  'Shield': 'ShieldIcon',
  'Moon': 'Moon01Icon',
  'Activity': 'Activity01Icon',
  'Stethoscope': 'StethoscopeIcon',
  'TrendingUp': 'AnalyticsUpIcon',
  'Target': 'Target01Icon',
  'Lightbulb': 'BulbIcon',
  'Calendar': 'Calendar03Icon',
  'Home': 'Home01Icon',
  'Sparkles': 'SparklesIcon',
  'Briefcase': 'Briefcase01Icon',
  'Users': 'UserMultipleIcon',
  'Globe': 'GlobeIcon',
  'Clock': 'Clock01Icon',
  'Phone': 'TelephoneIcon',
  'Mail': 'Mail01Icon',
  'MapPin': 'Location01Icon',
  'MessageCircle': 'Message01Icon',
  'CheckCircle2': 'CheckmarkCircle01Icon',
  'Sun': 'Sun01Icon',
  'Music': 'MusicNote01Icon',
  'Monitor': 'ComputerIcon',
  'Leaf': 'Leaf01Icon',
  'Receipt': 'ReceiptTextIcon',
  'ShieldCheck': 'ShieldIcon',
  'UserPlus': 'UserAdd01Icon',
  'Edit': 'Edit01Icon',
  'FileText': 'File01Icon',
  'Palette': 'PaintBoardIcon',
  'List': 'ListViewIcon',
  'Bell': 'Notification01Icon',
  'Lock': 'LockIcon',
  'CalendarIcon': 'Calendar03Icon',
  'BarChartIcon': 'BarChartIcon',
};

// Files to process (from TSC errors, excluding ai-elements and pre-existing)
const FILES = [
  'src/app/(auth)/reset-password/page.tsx',
  'src/app/(dashboard)/donations/reports/page.tsx',
  'src/app/(dashboard)/settings/privacy/page.tsx',
  'src/app/(dashboard)/therapist/session-notes/page.tsx',
  'src/app/(dashboard)/therapist/templates/page.tsx',
  'src/app/(marketing)/agenyz/[id]/AgenyzProductContent.tsx',
  'src/app/(marketing)/cases/[id]/CaseDetailContent.tsx',
  'src/components/ai/blocks/wellness-insights-card.tsx',
  'src/components/ai/chat-welcome.tsx',
  'src/components/ai/widgets/daily-summary.tsx',
  'src/components/ai/widgets/insights-panel.tsx',
  'src/components/business/BusinessPage.tsx',
  'src/components/community/CommunityChannelList.tsx',
  'src/components/community/CommunityFeed.tsx',
  'src/components/dashboard/chat/ChatInterface.tsx',
  'src/components/dashboard/therapist/active-session/ConstellationManager.tsx',
  'src/components/dashboard/therapist/active-session/VideoCallPanel.tsx',
  'src/components/dashboard/widgets/AvailabilityManager.tsx',
  'src/components/journal/JournalPage.tsx',
  'src/components/platform/admin/analytics-dashboard-headless.tsx',
  'src/components/platform/admin/role-management-panel-headless.tsx',
  'src/components/platform/admin/user-management-headless.tsx',
  'src/components/platform/editor/rich-text-editor.tsx',
  'src/components/platform/settings/billing-settings.tsx',
  'src/components/platform/settings/settings-content-headless.tsx',
  'src/components/platform/wallet/wallet-content-headless.tsx',
  'src/components/settings/add-family-dialog.tsx',
  'src/components/ui/list-toolbar-button.tsx',
  'src/marketing/components/AboutElenaContent.tsx',
  'src/marketing/components/ArtistsContent.tsx',
  'src/marketing/components/CasoDetailContent.tsx',
  'src/marketing/components/CasosContent.tsx',
  'src/marketing/components/CasosSection.tsx',
  'src/marketing/components/ContactForm.tsx',
  'src/marketing/components/ContactFormOptimized.tsx',
  'src/marketing/components/DiscoveryContent.tsx',
  'src/marketing/components/FooterPillMenu.tsx',
  'src/marketing/components/ForAthletesContent.tsx',
  'src/marketing/components/ForMusiciansContent.tsx',
  'src/marketing/components/ForOfficeWorkersContent.tsx',
  'src/marketing/components/ForParentsContent.tsx',
  'src/marketing/components/ForStudentsContent.tsx',
  'src/marketing/components/KinesiologyContent.tsx',
  'src/marketing/components/MassageContent.tsx',
  'src/marketing/components/NutritionContent.tsx',
  'src/marketing/components/PersonaContent.tsx',
  'src/marketing/components/ServicesContent.tsx',
  'src/marketing/components/VIPContent.tsx',
];

const ROOT = process.cwd();

function processFile(relPath) {
  const filePath = path.join(ROOT, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${relPath} (not found)`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  const changes = [];

  // Step 1: Fix wrong import names in @hugeicons/core-free-icons imports
  const hugeiconsImportRegex = /(import\s*\{[^}]*\}\s*from\s*['"]@hugeicons\/core-free-icons['"])/g;
  let importMatch;
  while ((importMatch = hugeiconsImportRegex.exec(content)) !== null) {
    let importStr = importMatch[1];
    let newImportStr = importStr;
    for (const [wrong, correct] of Object.entries(IMPORT_FIXES)) {
      // Use word boundary to avoid partial matches
      const re = new RegExp('\\b' + wrong + '\\b', 'g');
      if (re.test(newImportStr)) {
        newImportStr = newImportStr.replace(re, correct);
        changes.push(`import: ${wrong} → ${correct}`);
      }
    }
    if (newImportStr !== importStr) {
      content = content.replace(importStr, newImportStr);
    }
  }

  // Step 2: Replace bare lucide icon names with Hugeicons equivalents
  // Only replace outside of import statements, strings, and comments
  const lines = content.split('\n');
  const processedLines = lines.map((line, idx) => {
    // Skip import lines
    if (line.trim().startsWith('import ') || line.trim().startsWith('} from ')) return line;
    // Skip if inside a multi-line import (rough heuristic)
    if (line.trim().startsWith("'") || line.trim().startsWith('"')) return line;

    let newLine = line;
    for (const [bare, hugeName] of Object.entries(BARE_FIXES)) {
      // Match bare icon name as a word boundary
      // But NOT inside strings (rough: not preceded/followed by quote chars)
      const re = new RegExp('\\b' + bare.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
      if (!re.test(newLine)) continue;

      // More careful replacement - avoid matches inside string literals
      newLine = newLine.replace(re, (match, offset) => {
        // Check if inside a string by counting quotes before this position
        const before = newLine.substring(0, offset);
        const singleQuotes = (before.match(/'/g) || []).length;
        const doubleQuotes = (before.match(/"/g) || []).length;
        const backticks = (before.match(/`/g) || []).length;
        // If odd number of quotes, we're inside a string
        if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0 || backticks % 2 !== 0) {
          return match;
        }
        // Don't replace if already the target name
        if (match === hugeName) return match;
        // Don't replace in JSX text content (preceded by >)
        if (before.trimEnd().endsWith('>')) return match;
        // Don't replace in comments
        if (before.includes('//') || before.includes('/*')) return match;
        changes.push(`L${idx + 1}: ${bare} → ${hugeName}`);
        return hugeName;
      });
    }
    return newLine;
  });
  content = processedLines.join('\n');

  // Step 3: Ensure all referenced Hugeicons icon names are imported
  // Find all Hugeicons icon names used in the file
  const allHugeIconNames = new Set();
  const allValues = [...Object.values(IMPORT_FIXES), ...Object.values(BARE_FIXES)];
  for (const iconName of allValues) {
    const re = new RegExp('\\b' + iconName + '\\b');
    if (re.test(content)) {
      allHugeIconNames.add(iconName);
    }
  }

  // Also find any other *Icon names from @hugeicons that are already in the import
  const existingImportMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]@hugeicons\/core-free-icons['"]/);
  const existingImports = new Set();
  if (existingImportMatch) {
    existingImportMatch[1].split(',').map(s => s.trim()).filter(Boolean).forEach(s => existingImports.add(s));
  }

  // Find icons used in JSX/code but not imported
  const missingImports = [];
  for (const iconName of allHugeIconNames) {
    if (!existingImports.has(iconName)) {
      missingImports.push(iconName);
    }
  }

  if (missingImports.length > 0 && existingImportMatch) {
    // Add missing icons to the existing import
    const allImports = [...existingImports, ...missingImports].sort();
    // Deduplicate
    const uniqueImports = [...new Set(allImports)];
    const newImportLine = `import { ${uniqueImports.join(', ')} } from '@hugeicons/core-free-icons'`;
    content = content.replace(existingImportMatch[0], newImportLine);
    changes.push(`added to import: ${missingImports.join(', ')}`);
  } else if (missingImports.length > 0 && !existingImportMatch) {
    // Need to add a new import line
    // Find after the last import
    const importRegex = /^import\s.+$/gm;
    let lastImportEnd = 0;
    let m;
    const tempContent = content;
    while ((m = importRegex.exec(tempContent)) !== null) {
      if (m[0].includes('{') && !m[0].includes('}')) {
        const closingIdx = tempContent.indexOf('}', m.index + m[0].length);
        if (closingIdx !== -1) {
          const semiIdx = tempContent.indexOf(';', closingIdx);
          lastImportEnd = semiIdx !== -1 ? semiIdx + 1 : closingIdx + 1;
        }
      } else {
        lastImportEnd = m.index + m[0].length;
      }
    }
    if (lastImportEnd > 0) {
      const newImport = `\nimport { ${missingImports.sort().join(', ')} } from '@hugeicons/core-free-icons';`;
      // Check if HugeiconsIcon import exists, if not add it too
      let hugeiconsImport = '';
      if (!content.includes('@hugeicons/react')) {
        hugeiconsImport = `\nimport { HugeiconsIcon } from '@hugeicons/react';`;
      }
      content = content.slice(0, lastImportEnd) + hugeiconsImport + newImport + content.slice(lastImportEnd);
      changes.push(`new import: ${missingImports.join(', ')}`);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ${relPath}: ${changes.length} changes`);
    changes.forEach(c => console.log(`    - ${c}`));
    return true;
  }

  return false;
}

let total = 0;
for (const file of FILES) {
  if (processFile(file)) total++;
}
console.log(`\nProcessed ${total} files`);
