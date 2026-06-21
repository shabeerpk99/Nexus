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

## Recommended next steps

- Add backend integration for authentication, payments, and user data
- Replace mock data with API calls
- Add unit and integration tests
- Configure a CI pipeline with lint/build checks

## License

This project is provided as-is for frontend demonstration purposes.
