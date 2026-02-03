
# Migration to Next.js - Strategy & TODO

## 1. Architecture Decisions
**Current**: React (Vite) + Cloudflare Worker (Hono) using D1/R2.
**Goal**: Next.js (App Router).

### Database & Storage (D1/R2)
Since the project relies on Cloudflare-specific resources (D1 Database, R2 Storage), these bindings are natively available in **Cloudflare Workers** or **Cloudflare Pages**.
- **Option A (Recommended for Next.js)**: Deploy to **Cloudflare Pages**. This allows Next.js API routes (Edge Runtime) to access `env.DB` and `env.R2` directly provided you use `@cloudflare/next-on-pages`.
- **Option B (Vercel Deployment)**: If deploying to Vercel, the Next.js app **cannot** directly access D1/R2. You must keep the logic in `src/worker` separate (deployed as a worker) and have Next.js fetch data from it via HTTP.

**Plan**: We will proceed with **Option A** (Cloudflare Pages compatible structure) or a path that supports **Option B** (Client components fetching from existing API).
*For now, we will maintain the existing `src/worker` as the backend and migrate the Frontend to Next.js. This is the safest first step.*

## 2. Migration Steps

### Phase 1: Setup (In Progress)
- [x] Install Next.js dependencies.
- [ ] Create `next.config.mjs`.
- [ ] Configure `tsconfig.json` for Next.js.

### Phase 2: Frontend Migration
- [ ] Create `src/app/layout.tsx` (Root Layout) transferring logic from `main.tsx` and `App.tsx`.
- [ ] Create `src/app/page.tsx` (Home Page).
- [ ] Migrate Components:
    - Update `Link` from `react-router` to `next/link`.
    - Update Image handling (verify `next/image` usage or keep `<img>` for now).
    - Add `"use client"` directive to interactive components.
- [ ] Recreate Route Structure in `src/app`:
    - `/services`
    - `/services/massage`
    - `/contact`
    - etc.

### Phase 3: Cleanup
- [ ] Remove `vite.config.ts`.
- [ ] Remove `index.html`.
- [ ] Update `package.json` scripts.
