const fs = require('fs');

function updateCard() {
    const path = 'src/components/ui/card.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Remove basic border and add our inset shadow ring and specific radius
    content = content.replace(
        /className={cn\(\s*"rounded-xl border bg-card text-card-foreground shadow",\s*className\s*\)}/,
        `className={cn("rounded-[var(--radius-card)] bg-card text-card-foreground shadow-[var(--shadow-card-ring)] border-0", className)}`
    );

    // Header padding and gap
    content = content.replace(
        /className={cn\("flex flex-col space-y-1.5 p-6", className\)}/,
        `className={cn("flex flex-col gap-2 px-6 pt-6 pb-0", className)}`
    );

    // Content padding and gap
    content = content.replace(
        /className={cn\("p-6 pt-0", className\)}/,
        `className={cn("p-6 flex flex-col gap-6", className)}`
    );

    // Footer padding
    content = content.replace(
        /className={cn\("flex items-center p-6 pt-0", className\)}/,
        `className={cn("flex items-center px-6 pb-6 pt-0", className)}`
    );

    // Title font-heading
    content = content.replace(
        /className={cn\("font-semibold leading-none tracking-tight", className\)}/,
        `className={cn("font-heading text-base font-medium leading-none tracking-tight text-foreground", className)}`
    );

    // Description text-muted-foreground
    content = content.replace(
        /className={cn\("text-sm text-muted-foreground", className\)}/,
        `className={cn("font-sans text-sm font-normal text-muted-foreground", className)}`
    );

    fs.writeFileSync(path, content);
}

function updateButton() {
    const path = 'src/components/ui/button.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Make fully rounded (pill)
    content = content.replace(
        /class-variance-authority"\);\s*const buttonVariants = cva\(\s*"([^"]+)"/,
        `class-variance-authority");\n\nconst buttonVariants = cva(\n  "$1 rounded-full font-sans font-medium transition-all"`
    );

    // Remove "rounded-md" if it exists in the base string
    content = content.replace(/rounded-md\s*/, '');

    // Update sizes
    content = content.replace(/h-9 px-4 py-2/, 'h-[36px] px-3'); // default
    content = content.replace(/h-8 rounded-md px-3 text-xs/, 'h-[32px] px-3 text-sm'); // sm
    content = content.replace(/h-10 rounded-md px-8/, 'h-[40px] px-8'); // lg
    content = content.replace(/h-9 w-9/, 'h-[36px] w-[36px]'); // icon

    // Adjust outline variant background color specifically for Maia (alpha grey is applied natively via Tailwind colors, but let's make sure border is border)
    // The design specifies outline: background 30% alpha grey, border 1px border. We will rely on border and transparent.

    fs.writeFileSync(path, content);
}

function updateInput() {
    const path = 'src/components/ui/input.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Input pill, 36px height, alpha grey background
    content = content.replace(
        /flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors/,
        `flex h-[36px] w-full rounded-full border border-input bg-muted/30 px-3 py-1 font-sans text-sm text-foreground shadow-sm transition-colors`
    );
    content = content.replace(
        /flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background/,
        `flex h-[36px] w-full rounded-full border border-input bg-muted/30 px-3 py-1 font-sans text-sm text-foreground shadow-sm transition-colors ring-offset-background`
    );

    fs.writeFileSync(path, content);
}

function updateTextarea() {
    const path = 'src/components/ui/textarea.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Textarea: 19.6px radius, alpha grey background
    content = content.replace(
        /flex min-h-\[60px\] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm/,
        `flex min-h-[64px] w-full rounded-[var(--radius-textarea)] border border-input bg-muted/30 p-3 font-sans text-sm text-foreground shadow-sm`
    );

    fs.writeFileSync(path, content);
}

function updateBadge() {
    const path = 'src/components/ui/badge.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Fully rounded pill, font-medium, 12px font
    content = content.replace(
        /inline-flex items-center rounded-md border px-2\.5 py-0\.5 text-xs font-semibold transition-colors/,
        `inline-flex items-center rounded-full border px-2 py-0.5 font-sans text-xs font-medium transition-colors`
    );

    fs.writeFileSync(path, content);
}

function updateTabs() {
    const path = 'src/components/ui/tabs.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // List: pill container, h-36px, muted bg, p-1 (approx 3px)
    content = content.replace(
        /className={cn\(\s*"inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",\s*className\s*\)}/,
        `className={cn("inline-flex h-[36px] items-center justify-center rounded-full bg-muted p-[3px] text-muted-foreground", className)}`
    );
    content = content.replace(
        /className={cn\(\s*"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",\s*className\s*\)}/,
        `className={cn("inline-flex h-[36px] items-center justify-center rounded-full bg-muted p-[3px] text-muted-foreground", className)}`
    );

    // Trigger: pill active, h-29px
    content = content.replace(
        /className={cn\(\s*"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1\.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-\[state=active\]:bg-background data-\[state=active\]:text-foreground data-\[state=active\]:shadow",\s*className\s*\)}/,
        `className={cn("inline-flex h-[29px] items-center justify-center whitespace-nowrap rounded-full px-3 py-1 font-sans text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className)}`
    );

    fs.writeFileSync(path, content);
}

function updateSelect() {
    const path = 'src/components/ui/select.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    content = content.replace(
        /className={cn\(\s*"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background/,
        `className={cn("flex h-[36px] w-full items-center justify-between whitespace-nowrap rounded-full border border-input bg-muted/30 px-3 py-2 font-sans text-sm text-foreground shadow-sm ring-offset-background`
    );
    content = content.replace(
        /className={cn\(\s*"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background/,
        `className={cn("flex h-[36px] w-full items-center justify-between rounded-full border border-input bg-muted/30 px-3 py-2 font-sans text-sm text-foreground ring-offset-background`
    );

    fs.writeFileSync(path, content);
}


function updateSwitch() {
    const path = 'src/components/ui/switch.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Switch: 32x18.4px, fully rounded
    content = content.replace(
        /className={cn\(\s*"peer inline-flex h-\[20px\] w-\[36px\] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-\[state=checked\]:bg-primary data-\[state=unchecked\]:bg-input",\s*className\s*\)}/,
        `className={cn("peer inline-flex h-[18.4px] w-[32px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className)}`
    );

    // Thumb: 14.4x14.4px
    content = content.replace(
        /className={cn\(\s*"pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-\[state=checked\]:translate-x-4 data-\[state=unchecked\]:translate-x-0"/,
        `className={cn("pointer-events-none block h-[14.4px] w-[14.4px] rounded-full bg-background shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-[13.6px] data-[state=unchecked]:translate-x-0"`
    );

    fs.writeFileSync(path, content);
}


updateCard();
updateButton();
updateInput();
updateTextarea();
updateBadge();
updateTabs();
updateSelect();
updateSwitch();

console.log('UI Components updated to Maia preset');
