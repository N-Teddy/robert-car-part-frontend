# Phase 0 — Repo Intake

## Current Project Overview
- React + TypeScript SPA branded "AutoParts Pro" for managing auto parts business: authentication, dashboard, users, categories, vehicles, parts, orders, notifications. UI uses dashboard layout with protected routes and auth pages (login/register/forgot/reset) plus domain pages (orders, parts, vehicles, categories, notifications, users, profile).
- Runs in browser (Vite) with evidence of desktop (Tauri) and mobile (Capacitor) targets; SPA routing configured for Vercel via `vercel.json` rewrite.
- Server interaction via REST over Axios; tokens stored in `localStorage` and decoded client-side. React Query handles server state; notifications currently polled via Axios (WebSocket placeholder hook).

## Current Tech Stack & Dependencies
- Framework/build: Vite 5, React 19, TypeScript ~5.8, React Router 7, Tailwind CSS 4 (via `@tailwindcss/vite`).
- Data: Axios with interceptors (`src/provider/AxiosClient.ts`), @tanstack/react-query v5 + devtools; react-hook-form + zod for forms/validation.
- UI/UX: Tailwind utility classes; lucide-react icons; custom components under `src/components/ui`; drag-and-drop via `@dnd-kit/*`; PDF/QR tools (html2canvas, jspdf, qrcode, qr-scanner).
- Platform tooling: Capacitor (android/ios), Tauri CLI/API for desktop, Vercel rewrite for SPA hosting.
- Tooling: ESLint 9 flat config with React Hooks + React Refresh plugins; Prettier 3 (no local config file); vite-plugin-checker for TS; TypeScript config sets `strict: false` for app; moduleResolution `bundler`.
- Package management: pnpm lockfile present (`pnpm-lock.yaml`), scripts assume pnpm-compatible commands.

## Folder Structure (high level)
- `src/main.tsx` → `QueryProvider` → `StrictMode` → `App`.
- `src/App.tsx` → providers (`AuthProvider`, `NotificationProvider`) + `BrowserRouter` → `src/routes/index.tsx` for route definitions.
- `src/api/` REST wrappers per domain (auth, user, part, vehicle, order, category, notification) using shared Axios client.
- `src/hooks/` React Query hooks per domain + util hooks (`useDebounce`, `useToast`, `useWebSocket`).
- `src/context/` global contexts (auth, notification); `src/provider/` shared providers (`QueryProvider`, `AxiosClient`).
- `src/components/` domain-specific UI (parts, vehicles, orders, notifications, users, categories) + `components/ui` primitives; `src/layouts/` Auth & Dashboard shells; `src/pages/` route-level pages mirroring domains.
- `src/validation/` zod schemas for auth/user; `src/utils/` helpers (e.g., formatting); `src/assets/` static; `src/shared/` and `src/features/` directories exist but are effectively empty placeholders.
- Configs: `vite.config.ts`, `eslint.config.js`, `tailwind.config.js`, `tsconfig*.json`; `vercel.json` SPA rewrite; Capacitor/Tauri configs/directories present.

## Current App Flow (high level)
1) `main.tsx` mounts `<App>` within `QueryProvider` (React Query client, devtools enabled, refetchOnWindowFocus disabled, staleTime 5m).
2) `App.tsx` composes `AuthProvider` → `BrowserRouter` → `NotificationProvider` → `AppRoutes`.
3) `AuthProvider` restores tokens from `localStorage`, decodes JWT for user info, handles login/register/refresh/logout via React Query mutations.
4) `AppRoutes` defines public auth routes under `AuthLayout`, redirects root `/` to `/login`, and wraps dashboard routes with `<ProtectedRoute>` which gates on auth and user role; `DashboardLayout` renders nav/sidebar/topbar and `Outlet` for domain pages.
5) Domain pages (orders, parts, vehicles, categories, notifications, users/profile) fetch data through React Query hooks tied to `api/*` modules and render domain-specific components/modals.
6) `NotificationProvider` uses `useWebSocket` (currently Axios polling every 30s) to push new notifications, track unread counts, and show toasts; plays audio via `/sounds/*.mp3` and stores sound preference in `localStorage`.

## Risks / Fragile Areas Observed Early
- Type safety loose: `tsconfig.app.json` has `strict: false`; React Router v7 is used with `@types/react-router-dom@5` (version mismatch) which can break types and DX.
- Architecture inconsistency: `src/features/` and `src/shared/` are empty while domain code lives under `components/` + `pages/`, making boundaries unclear and growth harder.
- Tooling gaps: No project-level Prettier/EditorConfig; ESLint not type-aware; minimal scripts for CI; formatting conventions implicit.
- Runtime assumptions: requires `VITE_API_BASE_URL`; Axios client logs every request/response and sets very long timeout (1,000,000ms) which could mask hangs in production.
- Notification channel: `useWebSocket` actually polls via Axios, so `socket.io-client` dependency is unused; polling interval and refetch logic may cause redundant network traffic.
- Styling: Tailwind v4 with `@import 'tailwindcss'` plus duplicated keyframes in `index.css`; no global design tokens; potential class name drift.

## Questions to Clarify Before Phase 1
1) Should we keep Capacitor/Tauri targets active or prioritize the web SPA only for refactor scope?
2) Preferred package manager (pnpm vs npm/yarn) and Node version to standardize in docs/CI?
3) What is the expected backend base URL(s) for `VITE_API_BASE_URL` (dev/prod), and is auth strictly JWT-based as implemented?
4) Any requirement to stick with React Router v7 beta, or can we align types/version to stable?
5) Is `socket.io-client` planned for real-time notifications, or should we standardize on polling/React Query?
6) Should verbose Axios request/response logging remain in production builds, or can we gate/remove it?
7) Are there critical user flows or SLAs (e.g., offline support, mobile-first) that must be preserved during refactor?
