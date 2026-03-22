const fs = require('fs');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Add Inter import if needed
    if (!content.includes('import \'@fontsource/inter') && filePath.endsWith('layout.tsx') && filePath.includes('src/app/layout.tsx')) {
        content = `import '@fontsource/inter/400.css';\nimport '@fontsource/inter/500.css';\nimport '@fontsource/inter/600.css';\n` + content;
    }

    // Change font variables in className
    if (content.includes('GeistSans.variable')) {
        // Inter is native via @fontsource, we'll just add 'font-sans' and 'font-heading' via Tailwind classes that map to the standard system defaults if not using a specific local font,
        // but since we installed @fontsource/inter, it applies globally or via standard CSS font-family rules.
        // We already added var(--font-geist-sans) to the theme for heading, and Inter for sans in globals.css.
        // We just need to make sure the body class applies it.

        content = content.replace(/className=\{cn\('font-sans antialiased', GeistSans.variable, GeistMono.variable\)\}/, `className={cn('font-sans antialiased', GeistSans.variable, GeistMono.variable)}`);
    }

    fs.writeFileSync(filePath, content);
}

processFile('src/app/layout.tsx');
console.log('Done');
