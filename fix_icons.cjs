const fs = require('fs');
const { globSync } = require('glob');

const files = globSync('src/**/*.{ts,tsx}');
let updated = 0;

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

function getHugeIconName(name) {
    if (iconMap[name]) return iconMap[name];
    if (name.endsWith('Icon')) return name; // Assume it's already mapped
    return name + 'Icon'; // Fallback
}

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    // Use a simpler approach to find the import statement
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g;

    content = content.replace(importRegex, (match, importsStr) => {
        const imports = importsStr.split(',').map(i => i.trim()).filter(i => i);
        const mappedImports = [];

        for (let imp of imports) {
            if (imp.includes(' as ')) {
                const parts = imp.split(' as ');
                const originalName = parts[0].trim();
                const alias = parts[1].trim();
                const newName = getHugeIconName(originalName);
                mappedImports.push(`${newName} as ${alias}`);
                // Since there is an alias, we don't need to replace the usage in the code
            } else {
                const originalName = imp;
                const newName = getHugeIconName(originalName);
                mappedImports.push(newName);

                // Replace all usages of the component
                const tagRegex1 = new RegExp(`<${originalName}([\\s>])`, 'g');
                content = content.replace(tagRegex1, `<${newName}$1`);

                const tagRegex2 = new RegExp(`</${originalName}>`, 'g');
                content = content.replace(tagRegex2, `</${newName}>`);

                // Also replace variable references (e.g., icon={ChevronRight})
                const refRegex = new RegExp(`\\b${originalName}\\b`, 'g');
                content = content.replace(refRegex, newName);
            }
        }

        // Return the modified import statement
        // Note: hugeicons imports might not work exactly this way if the library structure differs,
        // but 'hugeicons-react' exports them as named imports.
        return `import { ${[...new Set(mappedImports)].join(', ')} } from 'hugeicons-react'`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        updated++;
    }
}

console.log(`Fully updated ${updated} files`);
