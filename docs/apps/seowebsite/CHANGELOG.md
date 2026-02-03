# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-13

### Added
- **Personalized Services**: Launched dedicated landing pages for Artists, Athletes, Musicians, Office Workers, and Students.
- **User Onboarding**: Implemented user onboarding flow with Supabase RLS policies (`user_onboarding` table).
- **Vercel Blob Integration**: Added support for Vercel Blob storage for managing assets like the logo and therapist photo.
- **SEO Optimization**: Implemented `SEOOptimized` component with JSON-LD structured data support.
- **Documentation**: Added comments to key configuration files (`vite.config.ts`, `worker/index.ts`) for better maintainability.

### Changed
- **React Version**: Stabilized on React 18.3.1 to ensure compatibility with UI libraries and resolve blank page issues.
- **Visual Identity**: Replaced generic stock images with professional wellness imagery from Pexels and Unsplash.
- **Localization**: Improved English translations for better clarity and professionalism.
- **Dependencies**: Optimized `package.json` by removing unused packages (`botid`, `canvas-confetti`, `openai`, `recharts`, etc.).
- **Build Configuration**: Fixed `tsconfig.worker.json` type definitions to resolve build errors.

### Fixed
- **TypeScript Errors**: Resolved type mismatches in `AnimatedCounter` and `useIntersectionObserver` hooks.
- **Deployment**: Fixed Vercel deployment issues related to TypeScript configuration.
- **Assets**: Fixed broken image links by replacing `mocha-cdn` placeholders with valid Vercel Blob and stock image URLs.

### Removed
- **Unused Files**: Deleted `legal-pages-test.js` and other redundant test scripts.
- **Cleanup**: Removed duplicate and unused React components.
