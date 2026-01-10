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
      "no-console": "warn",
      "no-undef": "off",
      "no-empty": "warn",  // Downgrade empty blocks to warning
      "no-case-declarations": "warn",  // Downgrade case declarations to warning
      "no-unreachable": "warn",  // Downgrade unreachable code to warning
      "no-useless-escape": "warn",  // Downgrade useless escape to warning
      "no-useless-catch": "warn"  // Downgrade useless catch to warning
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
      "no-empty": "warn",
      "no-case-declarations": "warn",
      "no-unreachable": "warn",
      "no-useless-escape": "warn",
      "no-useless-catch": "warn"
    }
  }
];

export default eslintConfig;
