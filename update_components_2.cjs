const fs = require('fs');

function updateCheckbox() {
    const path = 'src/components/ui/checkbox.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Checkbox: 16x16, 6px radius, border 1px
    content = content.replace(
        /className={cn\(\s*"peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-\[state=checked\]:bg-primary data-\[state=checked\]:text-primary-foreground",\s*className\s*\)}/,
        `className={cn("peer h-4 w-4 shrink-0 rounded-[6px] border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground", className)}`
    );

    fs.writeFileSync(path, content);
}

function updateRadio() {
    const path = 'src/components/ui/radio-group.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Radio Group Item: 16x16, circular, border 1px, bg when checked
    content = content.replace(
        /className={cn\(\s*"aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",\s*className\s*\)}/,
        `className={cn("aspect-square h-4 w-4 rounded-full border border-input text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary", className)}`
    );

    fs.writeFileSync(path, content);
}

function updateSlider() {
    const path = 'src/components/ui/slider.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Track: 12px height, fully rounded, muted
    content = content.replace(
        /className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"/,
        `className="relative h-3 w-full grow overflow-hidden rounded-full bg-muted"`
    );
    // Range: primary
    content = content.replace(
        /className="absolute h-full bg-primary"/,
        `className="absolute h-full bg-primary/80"`
    );
    // Thumb: circular
    content = content.replace(
        /className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"/,
        `className="block h-5 w-5 rounded-full border-[1.5px] border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"`
    );

    fs.writeFileSync(path, content);
}


function updateAvatar() {
    const path = 'src/components/ui/avatar.tsx';
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');

    // Avatar: 40x40, rounded full
    content = content.replace(
        /className={cn\(\s*"relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",\s*className\s*\)}/,
        `className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}`
    );

    fs.writeFileSync(path, content);
}

updateCheckbox();
updateRadio();
updateSlider();
updateAvatar();
