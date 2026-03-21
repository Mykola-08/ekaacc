const fs = require('fs');
let content = fs.readFileSync('src/styles/globals.css', 'utf-8');

const newRootTokens = `
  /* Maia Preset b3d7NJF17o Tokens */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Chart Color Palette (Sky Series) */
  --chart-1: oklch(0.828 0.111 230.318);
  --chart-2: oklch(0.685 0.169 237.323);
  --chart-3: oklch(0.588 0.158 241.966);
  --chart-4: oklch(0.5 0.134 242.749);
  --chart-5: oklch(0.443 0.11 240.79);

  /* Radius Tokens */
  --radius: 0.875rem;

  /* Specific Component Radii for Maia */
  --radius-card: 25.2px;
  --radius-pill: 36.4px;
  --radius-textarea: 19.6px;
`;

const newDarkTokens = `
  /* Maia Preset b3d7NJF17o Tokens */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.708 0 0);

  /* Chart Color Palette (Sky Series - identical to light mode) */
  --chart-1: oklch(0.828 0.111 230.318);
  --chart-2: oklch(0.685 0.169 237.323);
  --chart-3: oklch(0.588 0.158 241.966);
  --chart-4: oklch(0.5 0.134 242.749);
  --chart-5: oklch(0.443 0.11 240.79);
`;

const rootRegex = /:root\s*\{([\s\S]*?)\}/;
const rootBlockMatch = content.match(rootRegex);
if(rootBlockMatch) {
    const rootBlock = rootBlockMatch[1];
    const oldTokensRegex = /\/\* Maia Preset[\s\S]*?--radius:[^;]+;/m;
    const newRootBlock = rootBlock.replace(oldTokensRegex, newRootTokens);
    content = content.replace(rootRegex, `:root {${newRootBlock}}`);
}

const darkRegex = /\.dark\s*\{([\s\S]*?)\}/;
const darkBlockMatch = content.match(darkRegex);
if(darkBlockMatch) {
    const darkBlock = darkBlockMatch[1];
    const oldDarkTokensRegex = /\/\* Maia Preset[\s\S]*?--chart-5:[^;]+;/m;
    const newDarkBlock = darkBlock.replace(oldDarkTokensRegex, newDarkTokens);
    content = content.replace(darkRegex, `.dark {${newDarkBlock}}`);
}

content = content.replace(/@theme\s*\{([\s\S]*?)--font-sans:[^\n]+;/, `@theme {$1--font-sans: 'Inter', system-ui, -apple-system, sans-serif;\n  --font-heading: 'Geist', var(--font-geist-sans), system-ui, sans-serif;\n  --shadow-card-ring: 0 0 0 1px oklab(0.145 0 0 / 0.10);`);

// Replace radiuses with our new ones
content = content.replace(/--radius-sm:[^\n]+;\n\s*--radius-md:[^\n]+;\n\s*--radius-lg:[^\n]+;\n\s*--radius-xl:[^\n]+;\n\s*--radius-2xl:[^\n]+;\n\s*--radius-3xl:[^\n]+;/, `--radius-sm: calc(var(--radius) * 0.6);\n  --radius-md: calc(var(--radius) * 0.8);\n  --radius-lg: var(--radius);\n  --radius-xl: calc(var(--radius) * 1.4);\n  --radius-2xl: calc(var(--radius) * 1.8);\n  --radius-3xl: calc(var(--radius) * 2.2);\n  --radius-card: var(--radius-card);\n  --radius-pill: var(--radius-pill);\n  --radius-textarea: var(--radius-textarea);`);

if (!content.includes('@layer base')) {
    content += `\n\n@layer base {\n  * {\n    @apply border-border outline-ring/50;\n  }\n  body {\n    @apply bg-background text-foreground;\n    font-rendering: optimizeLegibility;\n  }\n}`;
}

fs.writeFileSync('src/styles/globals.css', content);
console.log('Done');
