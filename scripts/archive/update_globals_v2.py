import os

# Define the new content of globals.css with corrected Blue palette
new_content = """@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --font-serif: var(--font-playfair);
  --font-display: var(--font-inter);
  
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);

  /* Keep React Metal Palette */
  --color-metal-25: #fcfcfd;
  --color-metal-50: #f8fafc;
  --color-metal-100: #f1f5f9;
  --color-metal-200: #e2e8f0;
  --color-metal-300: #cbd5e1;
  --color-metal-400: #94a3b8;
  --color-metal-500: #64748b;
  --color-metal-600: #475569;
  --color-metal-700: #334155;
  --color-metal-800: #1e293b;
  --color-metal-900: #0f172a;

  /* Keep React Success Palette */
  --color-success-25: #f0fdf4;
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-300: #86efac;
  --color-success-400: #4ade80;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;
  --color-success-800: #166534;
  --color-success-900: #14532d;

  /* Keep React Warning Palette */
  --color-warning-25: #fffbeb;
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-300: #fcd34d;
  --color-warning-400: #fbbf24;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;
  --color-warning-800: #92400e;
  --color-warning-900: #78350f;

  /* Keep React Error Palette */
  --color-error-25: #fef2f2;
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-300: #fca5a5;
  --color-error-400: #f87171;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;
  --color-error-800: #991b1b;
  --color-error-900: #7f1d1d;

  /* Keep React Primary Palette - Unified Blue Action (#4DAFFF) */
  --color-primary-25: #eff6ff;
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #4DAFFF;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  
  --max-width-8xl: 88rem;
  --max-width-9xl: 96rem;
  
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  
  /* Animations */
  --animate-fade-in: fade-in 0.2s ease-out forwards;
  --animate-slide-up: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  --animate-zoom-in: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes slide-up {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes zoom-in {
    0% { transform: scale(0.95); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
}

:root {
  /* Porcelain & Flow System */
  /* Main Background: Porcelain Subtle (Canvas) */
  --background: #F9F9F8; 
  /* Text: Soft Black (Notion style) */
  --foreground: #222222;
  
  /* Cards: Pure White */
  --card: #FEFFFE;
  --card-foreground: #222222;
  
  --popover: #FEFFFE;
  --popover-foreground: #222222;
  
  /* Brand: Blue Action Color (iOS Style) */
  --primary: #4DAFFF; 
  --primary-foreground: #ffffff;
  
  --secondary: #F0F2F4; /* Surface Subtle / Hover */
  --secondary-foreground: #222222;
  
  --muted: #F0F2F4; 
  --muted-foreground: #999999; /* Text Secondary */
  
  --accent: #E5E7EB; /* Slightly darker for interactions */
  --accent-foreground: #222222;
  
  --destructive: #FF3F40; /* Bright Alert Red */
  --destructive-foreground: #ffffff;
  
  --border: #F5F5F5; /* Very light separators */
  --input: #F0F2F4;
  --ring: #E5E7EB; /* Focus rings */
  
  /* Hyper-Rounded: 36px for large, 16px for small */
  --radius: 2.25rem; /* 36px */
  
  --chart-1: hsl(12 76% 61%);
  --chart-2: hsl(173 58% 39%);
  --chart-3: hsl(197 37% 24%);
  --chart-4: hsl(43 74% 66%);
  --chart-5: hsl(27 87% 67%);
  
  --sidebar: #FEFFFE;
  --sidebar-foreground: #222222;
  --sidebar-primary: #4DAFFF;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #e0f2fe;
  --sidebar-accent-foreground: #0284c7;
  --sidebar-border: rgba(0, 0, 0, 0.05);
  --sidebar-ring: #4DAFFF;
}

.dark {
  --background: #000000;
  --foreground: #f5f5f7;

  --card: rgba(28, 28, 30, 0.7);
  --card-foreground: #f5f5f7;

  --primary: #4DAFFF;
  --primary-foreground: #020617;

  --secondary: #1E293B;
  --secondary-foreground: #F8FAFC;

  --muted: #1E293B;
  --muted-foreground: #94A3B8;

  --accent: #1E293B;
  --accent-foreground: #F8FAFC;
  
  --destructive: #ff3b30;
  --destructive-foreground: #ffffff;
  
  --border: #1E293B;
  --input: #1E293B;
  --ring: #4DAFFF;
  
  --sidebar: #000000;
  --sidebar-foreground: #f5f5f7;
  --sidebar-primary: #4DAFFF;
  --sidebar-primary-foreground: #020617;
  --sidebar-accent: #1E293B;
  --sidebar-accent-foreground: #F8FAFC;
  --sidebar-border: #1E293B;
  --sidebar-ring: #4DAFFF;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Unified Glass Utilities */
@utility glass {
  @apply bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm;
}
@utility glass-card {
  @apply bg-white/60 backdrop-blur-lg border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)];
}

.glass-panel {
  @apply bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/[0.03];
}

.subtle-footer {
  @apply bg-transparent backdrop-blur-lg border-t border-black/[0.02];
}
"""

with open(r"c:\ekaacc\packages\shared-ui\src\styles\globals.css", "w", encoding='utf-8') as f:
    f.write(new_content)
