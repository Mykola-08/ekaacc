const fs = require('fs');

// --- 1. GLOBALS.CSS ---
let css = fs.readFileSync('src/styles/globals.css', 'utf8');

const lightTokens = `
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
  --chart-1: oklch(0.828 0.111 230.318);
  --chart-2: oklch(0.685 0.169 237.323);
  --chart-3: oklch(0.588 0.158 241.966);
  --chart-4: oklch(0.5 0.134 242.749);
  --chart-5: oklch(0.443 0.11 240.79);
  --radius: 0.875rem;
`;

const darkTokens = `
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
  --chart-1: oklch(0.828 0.111 230.318);
  --chart-2: oklch(0.685 0.169 237.323);
  --chart-3: oklch(0.588 0.158 241.966);
  --chart-4: oklch(0.5 0.134 242.749);
  --chart-5: oklch(0.443 0.11 240.79);
`;

css = css.replace(/:root\s*{([^}]+)}/, function(match, inner) {
  let cleaned = inner
    .replace(/--background:[^;]+;/g, '')
    .replace(/--foreground:[^;]+;/g, '')
    .replace(/--card:[^;]+;/g, '')
    .replace(/--card-foreground:[^;]+;/g, '')
    .replace(/--popover:[^;]+;/g, '')
    .replace(/--popover-foreground:[^;]+;/g, '')
    .replace(/--primary:[^;]+;/g, '')
    .replace(/--primary-foreground:[^;]+;/g, '')
    .replace(/--secondary:[^;]+;/g, '')
    .replace(/--secondary-foreground:[^;]+;/g, '')
    .replace(/--muted:[^;]+;/g, '')
    .replace(/--muted-foreground:[^;]+;/g, '')
    .replace(/--accent:[^;]+;/g, '')
    .replace(/--accent-foreground:[^;]+;/g, '')
    .replace(/--destructive:[^;]+;/g, '')
    .replace(/--destructive-foreground:[^;]+;/g, '')
    .replace(/--border:[^;]+;/g, '')
    .replace(/--input:[^;]+;/g, '')
    .replace(/--ring:[^;]+;/g, '')
    .replace(/--chart-[1-5]:[^;]+;/g, '')
    .replace(/--radius:[^;]+;/g, '');
  return ":root {\n" + lightTokens + "\n" + cleaned + "}";
});

css = css.replace(/\.dark\s*{([^}]+)}/, function(match, inner) {
  let cleaned = inner
    .replace(/--background:[^;]+;/g, '')
    .replace(/--foreground:[^;]+;/g, '')
    .replace(/--card:[^;]+;/g, '')
    .replace(/--card-foreground:[^;]+;/g, '')
    .replace(/--popover:[^;]+;/g, '')
    .replace(/--popover-foreground:[^;]+;/g, '')
    .replace(/--primary:[^;]+;/g, '')
    .replace(/--primary-foreground:[^;]+;/g, '')
    .replace(/--secondary:[^;]+;/g, '')
    .replace(/--secondary-foreground:[^;]+;/g, '')
    .replace(/--muted:[^;]+;/g, '')
    .replace(/--muted-foreground:[^;]+;/g, '')
    .replace(/--accent:[^;]+;/g, '')
    .replace(/--accent-foreground:[^;]+;/g, '')
    .replace(/--destructive:[^;]+;/g, '')
    .replace(/--destructive-foreground:[^;]+;/g, '')
    .replace(/--border:[^;]+;/g, '')
    .replace(/--input:[^;]+;/g, '')
    .replace(/--ring:[^;]+;/g, '')
    .replace(/--chart-[1-5]:[^;]+;/g, '');
  return ".dark {\n" + darkTokens + "\n" + cleaned + "}";
});

if (!css.includes('corner-shape: squircle')) {
  css += "\n* {\n  corner-shape: squircle;\n}\n";
}
fs.writeFileSync('src/styles/globals.css', css);

// --- 2. TAILWIND.CONFIG.TS ---
let tw = fs.readFileSync('tailwind.config.ts', 'utf8');
tw = tw.replace(/borderRadius:\s*{[^}]+}/, `borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)', // 18px
        '2xl': '25.2px',                 // Document specifically mentions card radius is 25.2px
        '3xl': '36.4px',                 // Fully rounded / pill for most buttons
        apple: '32px',
        'apple-lg': '48px',
        'apple-xl': '64px',
        full: '9999px',
      }`);
tw = tw.replace(/transitionTimingFunction:\s*{/, `transitionTimingFunction: {
        'out-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-smooth': 'cubic-bezier(0.45, 0, 0.55, 1)',
        'out-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',`);
fs.writeFileSync('tailwind.config.ts', tw);

// --- 3. UI COMPONENTS ---
const patchComponent = (path, replaceMap) => {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    for (const [find, replace] of Object.entries(replaceMap)) {
      // Create regex without the /g because we use string mapping instead
      const regex = new RegExp(find, 'g');
      content = content.replace(regex, replace);
    }
    fs.writeFileSync(path, content);
  }
};

patchComponent('src/components/ui/card.tsx', {
  'rounded-\\[var\\(--radius\\)\\]': 'rounded-2xl',
  'border border-border bg-card py-6 text-sm text-card-foreground shadow-xs transition-shadow duration-200 hover:shadow-sm has-\\[>img:first-child\\]:pt-0 data-\\[size=sm\\]:gap-4 data-\\[size=sm\\]:py-4 \\*:\\[img:first-child\\]:rounded-t-\\[var\\(--radius\\)\\] \\*:\\[img:last-child\\]:rounded-b-\\[var\\(--radius\\)\\]': 'bg-card text-sm text-card-foreground shadow-[0_0_0_1px_rgba(37,37,37,0.1)] transition-all duration-300 ease-in-out-smooth hover:shadow-md has-[>img:first-child]:pt-0',
  'rounded-t-\\[var\\(--radius\\)\\] px-5 py-4 group-data-\[size=sm\]\\/card:px-4 has-data-\\[slot=card-action\\]:grid-cols-\\[1fr_auto\\] has-data-\\[slot=card-description\\]:grid-rows-\\[auto_auto\\] \\[\\.border-b\\]:pb-4 group-data-\\[size=sm\\]\\/card:\\[\\.border-b\\]:pb-3': 'rounded-t-2xl px-6 pt-6',
  'text-base font-medium': 'text-base font-medium font-heading tracking-tight',
  'text-sm text-muted-foreground': 'text-sm text-muted-foreground leading-relaxed',
  'px-5 pb-5 group-data-\\[size=sm\\]\\/card:px-4': 'px-6 flex flex-col gap-6',
  'flex items-center rounded-b-\\[var\\(--radius\\)\\] border-t border-border bg-muted\\/30 px-5 py-3 group-data-\\[size=sm\\]\\/card:px-4': 'flex items-center rounded-b-2xl px-6 pb-6 pt-2'
});

patchComponent('src/components/ui/button.tsx', {
  'rounded-\\[calc\\(var\\(--radius\\)\\*0\\.8\\)\\]': 'rounded-full',
  'transition-all outline-none': 'transition-all duration-300 ease-out-spring outline-none'
});

patchComponent('src/components/ui/input.tsx', {
  'rounded-\\[calc\\(var\\(--radius\\)\\*0\\.8\\)\\]': 'rounded-full',
  'bg-transparent': 'bg-input/30',
  'transition-colors': 'transition-all duration-300 ease-out-spring'
});

patchComponent('src/components/ui/badge.tsx', {
  'transition-all': 'transition-all duration-300 ease-out-spring'
});

patchComponent('src/components/ui/tabs.tsx', {
  'rounded-\\[var\\(--radius\\)\\]': 'rounded-full',
  'transition-all': 'transition-all duration-300 ease-out-spring'
});

patchComponent('src/components/ui/dialog.tsx', {
  'rounded-full bg-background': 'rounded-2xl bg-background shadow-apple border-none ring-0',
  'duration-100': 'duration-300 ease-out-spring'
});

// --- 4. APP OVERHAUL ---
patchComponent('src/app/(dashboard)/dashboard/page.tsx', {
  'rounded-\\[var\\(--radius\\)\\]': 'rounded-2xl',
  'rounded-\\[calc\\(var\\(--radius\\)\\*0\\.8\\)\\]': 'rounded-full',
  'gap-6 pb-10': 'gap-10 pb-12',
  'gap-4': 'gap-8',
  'can\\(permissions,': 'can(permissions as any,'
});

patchComponent('src/components/booking/BookingWizard.tsx', {
  'rounded-\\[var\\(--radius\\)\\]': 'rounded-2xl',
  'rounded-\\[calc\\(var\\(--radius\\)\\*0\\.8\\)\\]': 'rounded-full',
  'gap-6 pb-10': 'gap-10 pb-12',
  'gap-4': 'gap-8'
});

patchComponent('src/components/ai/chat-view.tsx', {
  'rounded-\\[var\\(--radius\\)\\]': 'rounded-2xl',
  'rounded-\\[calc\\(var\\(--radius\\)\\*0\\.8\\)\\]': 'rounded-2xl'
});

patchComponent('src/components/ai/AIRightPanel.tsx', {
  'rounded-\\[var\\(--radius\\)\\]': 'rounded-2xl',
  'rounded-\\[calc\\(var\\(--radius\\)\\*0\\.8\\)\\]': 'rounded-2xl'
});

// --- 5. DASHBOARD LAYOUT & NOTIFICATIONS ---
let layoutShell = fs.readFileSync('src/components/dashboard/layout/UnifiedDashboardShell.tsx', 'utf8');
layoutShell = layoutShell.replace(/import { can } from '@\/lib\/permissions';\n/, `// Simple client-side check\nconst can = (permissions: any[], resource: string, action: string) => {\n  if (!permissions) return false;\n  return permissions.some((p: any) => p.resource === resource && p.action === action);\n};\n`);
fs.writeFileSync('src/components/dashboard/layout/UnifiedDashboardShell.tsx', layoutShell);

let notifDrop = fs.readFileSync('src/components/dashboard/layout/NotificationDropdown.tsx', 'utf8');
notifDrop = notifDrop.replace(/const { notifications, markAllRead } = useNotifications\(userId\);/,
  `const { notifications, setNotifications } = useNotifications(userId);\n  const markAllRead = async () => {\n    setNotifications((prev: any) => prev.map((n: any) => ({ ...n, read: true })));\n  };`);
fs.writeFileSync('src/components/dashboard/layout/NotificationDropdown.tsx', notifDrop);

// --- 6. AI SDK v3.2 -> v4 UPDATE IN COMMAND PALETTE ---
let cmdPalette = fs.readFileSync('src/components/dashboard/GlobalCommandPalette.tsx', 'utf8');
if (cmdPalette.includes('append(')) {
  cmdPalette = cmdPalette.replace(/const { messages, append, isLoading: aiLoading, setMessages } = useChat\({/g,
    'const { messages, sendMessage, status, setMessages } = useChat({\n    transport: new DefaultChatTransport({ api: "/api/ai/command" }),');
  if (!cmdPalette.includes('DefaultChatTransport')) {
    cmdPalette = cmdPalette.replace(/import { useChat } from '@ai-sdk\/react';/, "import { useChat } from '@ai-sdk/react';\nimport { DefaultChatTransport } from 'ai';");
  }
  cmdPalette = cmdPalette.replace(/aiLoading/g, "(status === 'submitted' || status === 'streaming')");
  cmdPalette = cmdPalette.replace(/const content = lastMessage\.content;/g, `const content = lastMessage.parts?.[0]?.type === 'text' ? lastMessage.parts[0].text : '';`);
  cmdPalette = cmdPalette.replace(/append\(\{/g, 'sendMessage({');
  cmdPalette = cmdPalette.replace(/sendMessage\(\{ role: 'user', content: q \}\)/g, 'sendMessage({ text: q })');
  cmdPalette = cmdPalette.replace(/sendMessage\(\{ role: 'user', content: suggestion \}\)/g, 'sendMessage({ text: suggestion })');
  fs.writeFileSync('src/components/dashboard/GlobalCommandPalette.tsx', cmdPalette);
} else {
  if (!cmdPalette.includes('DefaultChatTransport')) {
    cmdPalette = cmdPalette.replace(/import { useChat } from '@ai-sdk\/react';/, "import { useChat } from '@ai-sdk/react';\nimport { DefaultChatTransport } from 'ai';");
  }
  cmdPalette = cmdPalette.replace(/const { messages, sendMessage, status, setMessages } = useChat\(\{([^}]+)\}\);/,
    'const { messages, sendMessage, status, setMessages } = useChat({ transport: new DefaultChatTransport({ api: "/api/ai/command" }) });');
  fs.writeFileSync('src/components/dashboard/GlobalCommandPalette.tsx', cmdPalette);
}
