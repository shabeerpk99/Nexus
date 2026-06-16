# Business Nexus Frontend Architecture

## Overview
This project is a React + TypeScript single-page application built with Vite and Tailwind CSS. It is designed to connect entrepreneurs and investors through user profiles, chat, documents, deal tracking, and collaboration requests.

## Architecture Summary

### 1. Core App Shell
- `src/App.tsx`
  - Defines routing structure using `react-router-dom`.
  - Wraps the app with `AuthProvider` for global authentication state.
  - Uses `DashboardLayout` to render protected pages inside a consistent navigation shell.

- `src/main.tsx`
  - Mounts the app with `React.StrictMode`.
  - Loads global styles from `src/index.css`.

### 2. Global Context
- `src/context/AuthContext.tsx`
  - Maintains authentication state, user session, and mock auth flows.
  - Exposes `login`, `register`, `logout`, `forgotPassword`, `resetPassword`, and `updateProfile`.
  - Uses local storage to persist the signed-in user.

### 3. UI Layout Components
- `src/components/layout/DashboardLayout.tsx`
  - Provides layout for authenticated pages.
  - Renders `Navbar`, `Sidebar`, and page content via `Outlet`.
  - Redirects unauthenticated users to `/login`.

- `src/components/layout/Navbar.tsx`
  - Top-level navigation with links, profile shortcuts, and logout control.
  - Shows role-aware dashboard links.

- `src/components/layout/Sidebar.tsx`
  - Role-specific navigation for entrepreneur and investor user journeys.
  - Includes support links and common navigation items.

### 4. UI Primitives
- `src/components/ui/Button.tsx`
  - Reusable button component with variant, size, loading, and icon support.

- `src/components/ui/Input.tsx`
  - Reusable input component with label, validation state, adornments, and helper text.

- `src/components/ui/Card.tsx` (not included in code summary but is a shared card wrapper component)
- `src/components/ui/Avatar.tsx` / `Badge.tsx` / others for consistent design patterns.

### 5. Pages by Domain
- `src/pages/auth` - Authentication flows.
  - `LoginPage.tsx`
  - `RegisterPage.tsx`

- `src/pages/dashboard` - Role-specific dashboards.
  - `EntrepreneurDashboard.tsx`
  - `InvestorDashboard.tsx`

- `src/pages/profile` - User profile detail pages.
  - `EntrepreneurProfile.tsx`
  - `InvestorProfile.tsx`

- `src/pages` - Core app features.
  - `InvestorsPage.tsx`
  - `EntrepreneursPage.tsx`
  - `MessagesPage.tsx`
  - `NotificationsPage.tsx`
  - `DocumentsPage.tsx`
  - `SettingsPage.tsx`
  - `HelpPage.tsx`
  - `DealsPage.tsx`
  - `ChatPage.tsx`

### 6. Static Data Layer
- `src/data/users.ts`
  - Mock user profiles for entrepreneurs and investors.
  - Includes helper functions `findUserById` and `getUsersByRole`.

- `src/data/messages.ts`
  - Stores mock chat messages, conversation logic, and send utilities.

- `src/data/collaborationRequests.ts`
  - Stores collaboration request records and helper functions to query/create/update.

### 7. Types and Domain Models
- `src/types/index.ts`
  - Central type definitions for `User`, `Entrepreneur`, `Investor`, `Message`, `ChatConversation`, `CollaborationRequest`, `Document`, and auth context types.

## Component Structure

### Layouts
- `src/components/layout`
  - `DashboardLayout.tsx`
  - `Navbar.tsx`
  - `Sidebar.tsx`

### Shared UI
- `src/components/ui`
  - `Avatar.tsx`
  - `Badge.tsx`
  - `Button.tsx`
  - `Card.tsx`
  - `Input.tsx`

### Feature-specific UI
- `src/components/chat`
  - `ChatMessage.tsx`
  - `ChatUserList.tsx`

- `src/components/collaboration`
  - `CollaborationRequestCard.tsx`

- `src/components/investor`
  - `InvestorCard.tsx`

- `src/components/entrepreneur`
  - `EntrepreneurCard.tsx`

## Styling and Theme
- Tailwind CSS is the design system foundation.
- `tailwind.config.js` defines the color palette, responsive container, shadows, spacing, fonts, and custom animations.
- `src/index.css` adds base body styling, typography defaults, and utility classes for theme consistency.

## Responsive Design
- Layout components use Tailwind grid and flex utilities.
- `DashboardLayout` uses responsive sidebars and content containers.
- Pages use responsive grid columns like `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for mobile-first UX.

## Production Standard Notes
- The app is currently organized with clear boundaries between layout, pages, shared UI, and data.
- For production, the next steps should be:
  1. Replace mock data with API services.
  2. Add feature-level state management or data fetching hooks.
  3. Add unit tests for shared components and critical page logic.
  4. Add accessibility support and ARIA attributes on interactive elements.
  5. Add a design token layer if the theme becomes more complex.
