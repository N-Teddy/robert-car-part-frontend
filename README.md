# AutoParts Pro — Frontend

Vite + React + TypeScript app for AutoParts Pro with React Query, Tailwind, and multi-target support (web, Capacitor, Tauri).

## Prerequisites
- Node 20.x
- pnpm 8+

## Environment
Create `frontend/.env` (or `.env.local`):
```
# Production API (Vercel)
VITE_API_BASE_URL=https://robert-car-part-backend.vercel.app/api

# Local development API (uncomment to use local backend)
# VITE_API_BASE_URL=https://localhost:3000/api
```

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
- Build assets: `pnpm build`
- Sync: `npx cap sync android` (or `ios`)
- Android debug APK: `cd android && ./gradlew assembleDebug`

## Tauri (desktop)
```
pnpm tauri:dev
pnpm tauri:build
```

## Notes
- React Query is configured in `src/provider/QueryProvider.tsx` with 5m stale time and devtools.
- Auth and notification contexts wrap the app; routes defined in `src/routes/index.tsx`.
- Tailwind v4 enabled via `@tailwindcss/vite`.
