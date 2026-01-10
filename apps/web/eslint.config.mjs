// Minimal ESLint config to avoid current next/core-web-vitals issues
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";

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
      "**/payload-types.ts", // Auto-generated file
    ],
  },
  ...compat.config({
    extends: ["eslint:recommended"],
    env: {
      browser: true,
      node: true,
      es6: true,
      jest: true
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }], // Allow console.warn and console.error
      "no-undef": "off",
      "no-empty": "off",  // Turn off empty block warnings
      "no-case-declarations": "off",  // Turn off case declarations warnings
      "no-unreachable": "off",  // Turn off unreachable code warnings (often intentional)
      "no-useless-escape": "warn",
      "no-useless-catch": "warn"
    }
  }),
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
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-empty": "off",
      "no-case-declarations": "off",
      "no-unreachable": "off",
      "no-useless-escape": "warn",
      "no-useless-catch": "warn"
    }
  },
  // More lenient rules for scripts and development files
  {
    files: ["**/scripts/**/*.ts", "**/scripts/**/*.js", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "no-console": "off" // Allow console in scripts and tests
    }
  }
];

export default eslintConfig;
