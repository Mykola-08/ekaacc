# Deployment Guide

This monorepo is configured to be deployed on Vercel.

## Project Structure

- `apps/web`: The main web application.
- `apps/docs`: The documentation site.

## Deploying on Vercel

To deploy this monorepo on Vercel, you should create two separate projects linked to the same GitHub repository.

### 1. Deploying the Web App

1.  Create a new project in Vercel.
2.  Import the repository.
3.  Select `apps/web` as the **Root Directory**.
4.  Vercel should automatically detect Next.js.
5.  Configure environment variables as needed.
6.  Deploy.

### 2. Deploying the Docs App

1.  Create a new project in Vercel.
2.  Import the repository.
3.  Select `apps/docs` as the **Root Directory**.
4.  Vercel should automatically detect Next.js.
5.  Deploy.

## Monorepo Configuration

The project uses Turbo to manage tasks. The root `vercel.json` is configured for the web app by default, but setting the Root Directory in Vercel settings overrides this for the docs project.

## Troubleshooting

### React Version Mismatch

If you encounter errors related to React versions (e.g., `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`), it is likely due to a conflict between React 19 (used by `web`) and React 18 (used by `docs` dependencies).

To resolve this, ensure that `apps/docs` has its own `node_modules` with the correct React version, or consider using a different documentation tool if Nextra does not yet support React 19.
