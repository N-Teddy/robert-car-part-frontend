# Phase 1 — Target Architecture

## Goals
- Feature-first organization that scales across web + Tauri + Capacitor without breaking existing behavior.
- Clear boundaries between app shell, shared utilities/UI, and domain features; minimal coupling.
- Consistent data flow using React Query for server state and Context only for cross-cutting session/notification state.
- Developer-friendly defaults (strict TS, lint/format) while keeping current UX intact and polling-based notifications.

## Proposed Top-Level Structure
```
src/
  app/                # App shell
    providers/        # QueryProvider, AuthProvider, NotificationProvider wrappers
    router/           # Route definitions + guards
    config/           # env parsing, platform flags (web/tauri/capacitor)
    types/            # app-wide types (Env, RouteMeta)
  shared/             # Reusable, framework-agnostic pieces
    ui/               # Button, Input, Toast, Modal, Table primitives
    lib/              # axios client, query helpers, storage, logger
    hooks/            # generic hooks (useDebounce, useMediaQuery, useToast)
    styles/           # global styles, tailwind tokens, animations
    types/            # generic DTO helpers
  features/
    auth/
      api/            # authApi
      model/          # types + schema (zod)
      hooks/          # useLogin, useRegister, useRefreshToken
      components/     # LoginForm, RegisterForm
      pages/          # LoginPage, RegisterPage, Forgot/Reset
    notifications/
      api/
      hooks/          # useNotificationPolling
      components/     # NotificationBell/Dropdown/Toast
      context/        # NotificationProvider
    orders/           # similar pattern: api, hooks, components, pages
    parts/
    vehicles/
    categories/
    users/
  pages/              # Route-level entry pages that compose feature components (optional thin wrappers)
  assets/
  styles/             # entrypoint CSS if needed
```

## Data & State
- **Server state:** React Query per feature with stable query keys; exported hooks directly (no factory wrappers). Shared query options centralized in `shared/lib/queryClient.ts`.
- **Client state:** Context only for auth session and notifications; other UI state stays local or in feature hooks.
- **Transport:** `shared/lib/apiClient` (Axios) with env-driven base URL, sane timeouts, env-gated logging.
- **Polling:** Keep notification polling (per requirement) inside `features/notifications/hooks/useNotificationPolling` with configurable interval.

## Routing
- Central router in `app/router` using React Router v7; route objects grouped by feature and lazy-loadable. Guards (`ProtectedRoute`) stay in app layer, consuming Auth context.

## Styling
- Tailwind tokens defined in `tailwind.config.js` + `shared/styles/tokens.css` (CSS vars for colors/spacing/typography). Global utilities and animations deduped.
- Feature components use shared UI primitives; avoid ad-hoc class duplication.

## Platform Considerations (Web + Tauri + Capacitor)
- Keep platform-specific configs under root (`tauri.conf`, `capacitor.config`) unchanged.
- `app/config/env.ts` resolves `VITE_API_BASE_URL` with fallbacks per platform (e.g., file:// for Tauri) and exposes a typed `env` object.
- Avoid direct `window` references in shared/lib; guard with platform checks.

## Why This Helps
- Feature folders keep domain logic together, reducing coupling and easing onboarding.
- Shared layer prevents drift in UI/utility code and makes responsive requirements consistent across targets.
- App layer isolates bootstrapping (providers, routing, env), simplifying tests and future CI steps.
- Clear env/config story reduces ambiguity around API base URLs for dev/prod and across platforms.
