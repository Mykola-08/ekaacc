import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const fontFamily = defaultTheme.fontFamily;

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
} satisfies Config;
