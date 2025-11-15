#!/usr/bin/env node

/**
 * Keep React Migration Script
 * 
 * This script automatically migrates components from Radix UI to Keep React.
 * It performs the following transformations:
 * 
 * 1. Updates imports from '@/components/ui/*' to '@/components/keep'
 * 2. Renames components (Dialog → Modal, TabsTrigger → TabsItem, etc.)
 * 3. Removes unnecessary wrappers (SelectTrigger)
 * 4. Updates component props where needed
 * 
 * Usage:
 *   node migrate-to-keep-react.js <file-path>
 *   node migrate-to-keep-react.js --all (migrate all files)
 */

const fs = require('fs');
const path = require('path');

// Component mapping: Radix UI → Keep React
const COMPONENT_MAPPINGS = {
  // Direct mappings (same name)
  'Button': 'Button',
  'Input': 'Input',
  'Label': 'Label',
  'Checkbox': 'Checkbox',
  'Switch': 'Switch',
  'Table': 'Table',
  'TableHeader': 'TableHeader',
  'TableBody': 'TableBody',
  'TableRow': 'TableRow',
  'TableHead': 'TableHead',
  'TableCell': 'TableCell',
  'Card': 'Card',
  'CardHeader': 'CardHeader',
  'CardTitle': 'CardTitle',
  'CardDescription': 'CardDescription',
  'CardContent': 'CardContent',
  'Badge': 'Badge',
  'Avatar': 'Avatar',
  'AvatarImage': 'AvatarImage',
  'AvatarFallback': 'AvatarFallback',
  'Textarea': 'Textarea',
  'Skeleton': 'Skeleton',
  'SkeletonLine': 'SkeletonLine',
  
  // Name changes
  'Dialog': 'Modal',
  'DialogTrigger': 'ModalAction',
  'DialogContent': 'ModalContent',
  'DialogHeader': 'ModalHeader',
  'DialogTitle': 'ModalTitle',
  'DialogDescription': 'ModalDescription',
  'DialogFooter': 'ModalFooter',
  'DialogClose': 'ModalClose',
  
  'TabsTrigger': 'TabsItem',
  'Tabs': 'Tabs',
  'TabsList': 'TabsList',
  'TabsContent': 'TabsContent',
  
  'Separator': 'Divider',
  
  'Alert': 'Notification',
  'AlertTitle': 'NotificationTitle',
  'AlertDescription': 'NotificationDescription',
  
  // Select components
  'Select': 'Select',
  'SelectContent': 'SelectContent',
  'SelectItem': 'SelectItem',
  'SelectValue': 'SelectValue',
  'SelectGroup': 'SelectGroup',
  'SelectLabel': 'SelectLabel',
  // SelectTrigger is removed - not needed in Keep React
  
  // Dropdown
  'DropdownMenu': 'Dropdown',
  'DropdownMenuTrigger': 'DropdownAction',
  'DropdownMenuContent': 'DropdownContent',
  'DropdownMenuItem': 'DropdownItem',
  'DropdownMenuLabel': 'DropdownList',
  
  // Tooltip
  'Tooltip': 'Tooltip',
  'TooltipTrigger': 'TooltipAction',
  'TooltipContent': 'TooltipContent',
  'TooltipProvider': null, // Not needed in Keep React
  
  // Popover
  'Popover': 'Popover',
  'PopoverTrigger': 'PopoverAction',
  'PopoverContent': 'PopoverContent',
  
  // Progress
  'Progress': 'Progress',
  
  // Slider
  'Slider': 'Slider',
  
  // Sheet → Drawer
  'Sheet': 'Drawer',
  'SheetTrigger': 'DrawerAction',
  'SheetContent': 'DrawerContent',
  'SheetHeader': 'DrawerHeader',
  'SheetTitle': 'DrawerTitle',
  'SheetDescription': 'DrawerDescription',
  'SheetFooter': 'DrawerFooter',
};

// Components that need special handling
const REMOVED_COMPONENTS = [
  'TooltipProvider',
  'SelectTrigger',
  'ScrollArea', // Use native overflow
];

function migrateFile(filePath) {
  console.log(`Migrating: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Step 1: Find all imports from '@/components/ui/*'
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui\/([^'"]+)['"]/g;
  let match;
  const allImports = new Set();
  
  while ((match = importRegex.exec(content)) !== null) {
    const components = match[1].split(',').map(c => c.trim());
    components.forEach(comp => allImports.add(comp));
  }
  
  // Step 2: Build Keep React import
  const keepReactComponents = [];
  allImports.forEach(comp => {
    const mapped = COMPONENT_MAPPINGS[comp];
    if (mapped && !REMOVED_COMPONENTS.includes(comp)) {
      keepReactComponents.push(mapped);
    } else if (!mapped && !REMOVED_COMPONENTS.includes(comp)) {
      console.warn(`  ⚠ No mapping for: ${comp}`);
    }
  });
  
  if (keepReactComponents.length > 0) {
    // Step 3: Remove old imports
    content = content.replace(importRegex, '');
    
    // Step 4: Add new Keep React import at the top of imports
    const uniqueComponents = [...new Set(keepReactComponents)];
    const newImport = `import { ${uniqueComponents.sort().join(', ')} } from '@/components/keep';\n`;
    
    // Find the first import statement and add before it
    const firstImportIndex = content.search(/^import\s/m);
    if (firstImportIndex !== -1) {
      content = content.slice(0, firstImportIndex) + newImport + content.slice(firstImportIndex);
    } else {
      // Add after 'use client' if it exists
      const useClientIndex = content.indexOf("'use client'");
      if (useClientIndex !== -1) {
        const insertIndex = content.indexOf('\n', useClientIndex) + 1;
        content = content.slice(0, insertIndex) + '\n' + newImport + content.slice(insertIndex);
      } else {
        content = newImport + content;
      }
    }
    
    // Step 5: Replace component names in the code
    Object.entries(COMPONENT_MAPPINGS).forEach(([oldName, newName]) => {
      if (newName && allImports.has(oldName)) {
        // Replace JSX tags
        const jsxRegex = new RegExp(`<${oldName}([\\s>])`, 'g');
        const jsxCloseRegex = new RegExp(`</${oldName}>`, 'g');
        content = content.replace(jsxRegex, `<${newName}$1`);
        content = content.replace(jsxCloseRegex, `</${newName}>`);
      }
    });
    
    // Step 6: Remove SelectTrigger wrapping
    content = content.replace(/<SelectTrigger[^>]*>\s*<SelectValue([^/]*)\/?>\s*<\/SelectTrigger>/g, '<SelectValue$1 />');
    
    // Step 7: Remove TooltipProvider wrapping  
    content = content.replace(/<TooltipProvider>\s*/g, '');
    content = content.replace(/\s*<\/TooltipProvider>/g, '');
    
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Migrated successfully`);
    return true;
  } else {
    console.log(`  ⏭  No changes needed`);
    return false;
  }
}

function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help') {
  console.log('Usage:');
  console.log('  node migrate-to-keep-react.js <file-path>');
  console.log('  node migrate-to-keep-react.js --all');
  console.log('  node migrate-to-keep-react.js --src');
  process.exit(0);
}

if (args[0] === '--all') {
  console.log('Migrating all .tsx/.ts files in the project...\n');
  const files = findTsxFiles('./src');
  let migratedCount = 0;
  
  files.forEach(file => {
    if (migrateFile(file)) {
      migratedCount++;
    }
  });
  
  console.log(`\n✨ Migration complete! Migrated ${migratedCount} of ${files.length} files.`);
} else if (args[0] === '--src') {
  console.log('Migrating src directory...\n');
  const files = findTsxFiles('./src');
  let migratedCount = 0;
  
  files.forEach(file => {
    if (migrateFile(file)) {
      migratedCount++;
    }
  });
  
  console.log(`\n✨ Migration complete! Migrated ${migratedCount} of ${files.length} files.`);
} else {
  const filePath = args[0];
  if (fs.existsSync(filePath)) {
    migrateFile(filePath);
  } else {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
}
