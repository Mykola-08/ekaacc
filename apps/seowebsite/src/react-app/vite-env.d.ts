/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
}
