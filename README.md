# Business Nexus

A production-ready React + Vite frontend for a startup and investor collaboration platform.

## Overview

Business Nexus is a modular dashboard application built with:

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- ESLint

The app includes authentication, role-based dashboard routing, chat, payments, document sharing, meetings, and portfolio management.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview the production build:

   ```bash
   npm run preview
   ```

## Scripts

- `npm run dev` — start local development server
- `npm run build` — create production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
- `npm run lint:fix` — run ESLint and apply auto-fixes

## Project structure

- `src/` — application source code
- `src/components/` — reusable UI components and layout pieces
- `src/pages/` — page-level views and routes
- `src/context/` — global context providers
- `src/data/` — mock data and helper functions
- `src/types/` — TypeScript interfaces and shared types

## Notes for production readiness

- Removed unused dependencies from `package.json`
- Simplified routing with protected and role-based guards
- Kept `react-joyride` tour feature for guided demo walkthroughs
- Added `Forgot Password` and `Reset Password` routes
- Updated ESLint config for modern TypeScript and React validation

### Vercel deployment notes

- This project uses Vite; Vercel will run `npm run build` by default. A `prebuild` script now auto-runs `npm run lint:fix` before `build` to reduce lint issues.
- Environment variables and secrets: configure via Vercel Dashboard (do NOT commit secrets to Git).
- Demo OTP behavior: In development the OTP is deterministic (`123456`) and logged to the browser console. In production the app generates random OTPs and does not log them.

### Security checklist (before deploying to production)

- Remove any debug console logging and demo helpers.
- Store secrets and API keys in Vercel Environment Variables.
- Enforce HTTPS and HSTS (Vercel provides HTTPS by default; `vercel.json` includes HSTS header).
- Configure Content Security Policy (CSP) headers if integrating third-party resources.
- Use a secure backend for authentication; replace mock auth in `src/context/AuthContext.tsx`.
- Run `npm run lint` and fix all remaining issues, and add tests where applicable.

### Deploy to Vercel

1. Push your repository to GitHub/GitLab.
2. Create a new project in Vercel and point it to the repo.
3. Set the following (example) environment variables in Vercel:
   - `API_BASE_URL` — backend base URL
   - `VITE_SENTRY_DSN` — optional error tracking DSN
4. Vercel build & output settings: framework detected as Vite; build command: `npm run build`; output directory: `dist`.
5. Click Deploy.

### Quick commands

- Install deps: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Auto-fix lint issues: `npm run lint:fix`
- Build (runs `prebuild`): `npm run build`

## Recommended post-deploy checks

- Verify HTTPS and headers via curl or security scanners.
- Confirm no OTP or sensitive info appears in client console.
- Run a smoke test for main user flows: login, 2FA, dashboard, create request, payments flow.

## Recommended next steps

- Add backend integration for authentication, payments, and user data
- Replace mock data with API calls
- Add unit and integration tests
- Configure a CI pipeline with lint/build checks

## License

This project is provided as-is for frontend demonstration purposes.
