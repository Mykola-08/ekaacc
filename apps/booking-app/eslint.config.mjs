// Minimal ESLint config to avoid current next/core-web-vitals issues
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  js.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "no-unused-vars": "warn",
      "no-console": "off", // Turned off - use logger utility for production code
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "no-undef": "off", // TypeScript handles this
      "no-unused-vars": "off", // TypeScript handles this
      "no-console": "off" // Turned off - use logger utility for production code
    }
  },
  // More lenient rules for scripts and tests
  {
    files: ["**/scripts/**/*.ts", "**/scripts/**/*.js", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "no-console": "off" // Allow console in scripts and tests
    }
  }
];

export default eslintConfig;
