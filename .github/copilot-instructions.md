# EKA Account - Copilot Instructions

This document provides essential guidance for AI agents working on the EKA Account codebase. Understanding these concepts is critical for being productive and avoiding common issues.

## 1. Core Architecture: The Data Service Abstraction

The most important architectural pattern in this app is the **data service abstraction layer**. It allows the application to seamlessly switch between mock data for development and live Firebase data for production.

- **Key File**: `src/services/data-service.ts`
- **Interface**: `IDataService` defines the contract that all data services must follow.
- **Implementations**:
  - `src/services/mock-data-service.ts` (for development, testing, and demos)
  - `src/services/firebase-data-service.ts` (for production)

**How to Switch Data Sources:**

To switch between mock and Firebase data, edit `src/services/data-service.ts`:

```typescript
// src/services/data-service.ts
export const USE_MOCK_DATA = true; // Set to `false` to use Firebase
```

After changing this flag, you **must restart the development server** (`npm run dev`).

**Agent Guideline**: When asked to work on data-related features, always check which data service is active. Do not directly interact with Firebase or mock data files; use the `getDataService()` function to get the active service instance.

## 2. Development Workflow

- **Run the app**: `npm run dev` (starts on `http://localhost:9002` with Turbopack)
- **Run tests**: `npm run test` (uses Vitest)
- **Type checking**: `npm run typecheck`

The app is configured to use mock data by default, so it can be run immediately after `npm install`.

## 3. Key Components & Patterns

### Application Layout and Context

- **Main Layout**: `src/app/(app)/layout.tsx` is the primary layout for the authenticated part of the app.
- **Context Providers**: The main layout wraps children in important providers:
  - `SidebarProvider`: Manages the state of the main navigation sidebar.
  - `UnifiedDataProvider`: Provides data from the active data service to the entire component tree. Use the `useUnifiedData()` hook to access this data.

### AI Integration with Genkit

- **Configuration**: `src/ai/genkit.ts` configures Google AI through Genkit.
- **Flows**: AI-powered workflows are defined in `src/ai/flows/`.
- **Agent Guideline**: When adding new AI features, create new flows and call them from the backend or API routes. Use the `ai` object exported from `src/ai/genkit.ts`.

### External Services

- **Firebase**: Used for authentication, Firestore database, and storage. Configuration is likely in a file like `src/firebase/firebase.ts`.
- **Stripe & Square**: Integrated for payment processing. Look for related services or hooks in `src/services/` or `src/hooks/`.

## 4. Project Conventions

- **Styling**: This project uses Tailwind CSS with `clsx` and `tailwind-merge`. UI components are built with Radix UI and are located in `src/components/ui`.
- **Testing**: Tests are written with Vitest and React Testing Library. Test files are co-located with components (e.g., `src/components/__tests__`) or in the top-level `src/__tests__` directory.
- **Paths**: The project uses `@/` as an alias for the `src/` directory.
