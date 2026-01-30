# Phase 2 — Onboarding

## Requirements
- Node 20.x
- pnpm 8+
- Vite + React tooling installed by pnpm
- Platform targets kept: Web, Capacitor, Tauri

## Environment
Create `frontend/.env` (or `.env.local`) with:
```
# Production API (Vercel)
VITE_API_BASE_URL=https://robert-car-part-backend.vercel.app/api

# Local development API
# Uncomment for local backend
# VITE_API_BASE_URL=https://localhost:3000/api
```
Use HTTPS locally if backend serves TLS; adjust host/port as needed. For platform-specific overrides, add platform suffixes when we introduce typed env parsing (e.g., `VITE_API_BASE_URL_DESKTOP`).

## Install
```
pnpm install
```

## Run (web)
```
pnpm dev
```

## Build (web)
```
pnpm build
```

## Lint & Format
```
pnpm lint
pnpm format:check
pnpm format
```

## Capacitor (Android/iOS)
- Build web assets: `pnpm build`
- Sync: `npx cap sync android` (or `ios`)
- Android debug APK (CI mirrors): `cd android && ./gradlew assembleDebug`

## Tauri (desktop)
```
pnpm tauri:dev
pnpm tauri:build
```

## Add a Feature (quick start)
1) Create `src/features/<feature>/` with `api/`, `model/`, `hooks/`, `components/`, `pages/`.
2) Export React Query hooks directly (e.g., `useGetX`).
3) Use shared UI primitives from `src/shared/ui` and shared libs (axios client, query helpers).
4) Add route in `src/app/router` (to be introduced) and thin page wrapper in `src/pages/` if needed.

## Testing (to add)
- Placeholder: plan to add minimal smoke tests (auth flow render, dashboard shell) once structure is in place.
