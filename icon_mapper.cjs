const fs = require('fs');
const glob = require('glob');
const path = require('path');

// Simple Map for common Lucide -> HugeIcons replacements
// This will map standard lucide-react names to hugeicons-react
// The icon style we use from Hugeicons is generally 'IconName'
const iconMap = {
    'ChevronRight': 'ArrowRight01Icon',
    'ChevronLeft': 'ArrowLeft01Icon',
    'ChevronDown': 'ArrowDown01Icon',
    'ChevronUp': 'ArrowUp01Icon',
    'ArrowRight': 'ArrowRight01Icon',
    'ArrowLeft': 'ArrowLeft01Icon',
    'Search': 'Search01Icon',
    'Settings': 'Settings01Icon',
    'User': 'UserIcon',
    'Users': 'UserMultipleIcon',
    'Home': 'Home01Icon',
    'Bell': 'Notification01Icon',
    'Menu': 'Menu01Icon',
    'X': 'Cancel01Icon',
    'Check': 'CheckmarkBadge01Icon',
    'Plus': 'PlusSignIcon',
    'Minus': 'MinusSignIcon',
    'Trash2': 'Delete02Icon',
    'Trash': 'Delete02Icon',
    'Edit': 'Edit02Icon',
    'Calendar': 'Calendar01Icon',
    'Clock': 'Time02Icon',
    'Mail': 'Mail01Icon',
    'Phone': 'CallIcon',
    'LogOut': 'Logout01Icon',
    'LogIn': 'Login01Icon',
    'Info': 'InformationCircleIcon',
    'AlertCircle': 'Alert01Icon',
    'AlertTriangle': 'Alert02Icon',
    'CheckCircle2': 'CheckmarkCircle02Icon',
    'CheckCircle': 'CheckmarkCircle01Icon',
    'Loader2': 'Loading02Icon',
    'Image': 'Image01Icon',
    'Upload': 'Upload01Icon',
    'Download': 'Download01Icon',
    'FileText': 'File02Icon',
    'Link': 'Link01Icon',
    'ExternalLink': 'LinkSquare02Icon',
    'Play': 'PlayIcon',
    'Pause': 'PauseIcon',
    'Copy': 'Copy01Icon',
    'Share': 'Share01Icon',
    'ShoppingBag': 'ShoppingBag01Icon',
    'MoreVertical': 'MoreVerticalIcon',
    'MoreHorizontal': 'MoreHorizontalIcon',
    'Sparkles': 'SparklesIcon',
    'Eye': 'ViewIcon',
    'EyeOff': 'ViewOffIcon',
    'MapPin': 'Location01Icon',
    'Lock': 'LockKeyIcon',
    'Unlock': 'UnlockIcon',
    'Shield': 'Shield01Icon',
    'Heart': 'FavouriteIcon',
    'MessageSquare': 'Comment01Icon',
    'MessageCircle': 'Comment02Icon',
    'Filter': 'FilterIcon',
    'Globe': 'GlobalIcon',
    'Star': 'StarIcon',
    'Sun': 'Sun01Icon',
    'Moon': 'Moon02Icon',
    'Activity': 'Activity01Icon',
    'PieChart': 'PieChartIcon',
    'BarChart': 'BarChartCircle01Icon',
    'BarChart2': 'BarChart02Icon',
    'TrendingUp': 'ArrowUpRight01Icon',
    'TrendingDown': 'ArrowDownRight01Icon',
    'Box': 'PackageIcon',
    'Briefcase': 'Briefcase01Icon',
    'CreditCard': 'CreditCard01Icon',
    'Database': 'DatabaseIcon',
    'File': 'File01Icon',
    'Folder': 'Folder01Icon',
    'Gift': 'GiftIcon',
    'Headphones': 'HeadphonesIcon',
    'Laptop': 'Laptop01Icon',
    'Layers': 'Layers01Icon',
    'Layout': 'Layout01Icon',
    'LifeBuoy': 'LifebuoyIcon',
    'Monitor': 'Monitor01Icon',
    'Printer': 'PrinterIcon',
    'Radio': 'RadioIcon',
    'Save': 'SaveIcon',
    'Server': 'ServerIcon',
    'Smartphone': 'Smartphone01Icon',
    'Speaker': 'SpeakerIcon',
    'Tablet': 'Tablet01Icon',
    'Tag': 'Tag01Icon',
    'Target': 'Target01Icon',
    'Truck': 'Truck01Icon',
    'Tv': 'Tv01Icon',
    'Watch': 'Watch01Icon',
    'Wifi': 'Wifi01Icon',
    'Zap': 'ZapIcon'
};

// Fallback function to generate a hugeicon name from a lucide name
function getHugeIconName(lucideName) {
    if (iconMap[lucideName]) return iconMap[lucideName];
    // Default fallback approach: append 'Icon' to the name. This may fail, but we'll try to catch it in pre-commit
    return lucideName + 'Icon';
}

function processFiles(files) {
    let filesUpdated = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf-8');
        let initialContent = content;

        // Find all lucide-react imports
        const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g;
        let match;

        while ((match = importRegex.exec(content)) !== null) {
            const importedIcons = match[1].split(',').map(i => i.trim()).filter(i => i);
            let hugeIconsToImport = [];

            for (const icon of importedIcons) {
                // Handle aliases: import { Search as SearchIcon } from 'lucide-react'
                let originalName = icon;
                let alias = null;

                if (icon.includes(' as ')) {
                    [originalName, alias] = icon.split(' as ').map(i => i.trim());
                }

                const hugeIconName = getHugeIconName(originalName);
                hugeIconsToImport.push(alias ? `${hugeIconName} as ${alias}` : hugeIconName);

                // Replace the component usage in the file if no alias is used
                if (!alias) {
                    const usageRegex = new RegExp(`<${originalName}([^>]*)>`, 'g');
                    content = content.replace(usageRegex, `<${hugeIconName}$1>`);

                    const usageRegexClose = new RegExp(`</${originalName}>`, 'g');
                    content = content.replace(usageRegexClose, `</${hugeIconName}>`);

                    // Also replace function calls/references like `icon={ChevronRight}`
                    const refRegex = new RegExp(`\\b${originalName}\\b`, 'g');
                    content = content.replace(refRegex, hugeIconName);
                }
            }

            // Deduplicate imports
            hugeIconsToImport = [...new Set(hugeIconsToImport)];

            // Replace the import statement
            content = content.replace(match[0], `import { ${hugeIconsToImport.join(', ')} } from 'hugeicons-react'`);
        }

        if (content !== initialContent) {
            fs.writeFileSync(file, content);
            filesUpdated++;
        }
    }

    console.log(`Updated ${filesUpdated} files with HugeIcons`);
}

// Find all TS/TSX files
const { globSync } = require('glob');
const files = globSync('src/**/*.{ts,tsx}');
processFiles(files);
