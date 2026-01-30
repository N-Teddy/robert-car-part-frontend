# Phase 5 — Validation (to be executed after refactor)

## Commands to run
- Install: `pnpm install`
- Lint: `pnpm lint`
- Format check: `pnpm format:check`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Tauri dev: `pnpm tauri:dev`
- Capacitor sync: `npx cap sync android` (or ios) after `pnpm build`

## Manual Test Checklist (initial)
- Auth: login with valid/invalid creds; register flow; forgot/reset password screens render.
- Navigation: Protected routes redirect unauthenticated users to `/login`; authorized user sees dashboard; 404 route shows NotFound.
- Orders: list loads; create/edit/delete modal flows; export CSV works.
- Parts: list loads; low-stock indicators; create/update part with images.
- Notifications: bell shows unread badge; dropdown lists latest; mark-as-read works; polling indicator shows connected; sound toggle persists.
- Profile: user profile loads; logout returns to login.
- Responsiveness: dashboard sidebar toggles on mobile; forms usable at 360px width.
- Platform: basic smoke on Tauri/Capacitor (app launches, routes render, API hits correct base URL when configured).

## Acceptance Criteria
- Build and lint pass with no warnings/errors.
- App behavior matches pre-refactor flows (no feature loss).
- Responsive layout intact (desktop-first but functional on mobile widths).
- Polling-based notifications remain functional.
