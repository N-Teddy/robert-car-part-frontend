# Phase 2 — Coding Standards

## Naming
- Files/folders: kebab-case for folders, PascalCase for React components, camelCase for helpers/hooks; tests match source filename with `.test.tsx`.
- Hooks: prefix with `use` and export directly (no factory objects), e.g., `useGetOrders`.
- Context providers end with `Provider` and hooks with `useXContext`.
- Env vars: `VITE_API_BASE_URL` (dev/prod), consider platform suffix if diverging (e.g., `VITE_API_BASE_URL_DESKTOP`).

## Folder Conventions
- `src/app/`: app shell (providers, router, config/env, types).
- `src/shared/`: UI primitives, generic hooks, lib (axios client, query client, storage, logger), styles/tokens.
- `src/features/<domain>/`: api, model (types + zod schemas), hooks (React Query), components, pages (optional per domain), context (if domain-scoped), tests.
- `src/pages/`: thin route-level page entries composing feature components (optional layer).
- `src/assets/`, `src/styles/` for static/global CSS.

## React Rules
- Components: function components with explicit prop types; avoid default exports where possible; keep side-effects inside `useEffect`/`useMemo`.
- Hooks: call unconditionally at top level; keep hooks pure; memoize expensive selectors.
- Context: only for cross-cutting concerns (auth, notifications). Prefer hook + React Query for server data.

## State & Data Fetching
- Server state: React Query with stable query keys per feature; co-locate queries and mutations in feature hooks; enable `enabled` flags for conditional fetches (e.g., require `user?.id`).
- Client state: local component state or feature-level context; avoid prop drilling by composing smaller components.
- Errors/loading: standard pattern — show `LoadingScreen` or skeleton while `isLoading`; surface API errors via shared `Toast`/alert component.

## Styling
- Tailwind v4 utilities with shared tokens: define colors/spacing/typography in `tailwind.config.js` and `shared/styles/tokens.css`.
- Deduplicate animations/utilities; prefer shared classes over inline repetition.
- Ensure responsiveness (desktop-first but responsive) across web, Tauri, Capacitor.

## Linting/Formatting
- ESLint (flat, type-aware) using `tsconfig.app.json` + `tsconfig.node.json`; run with `pnpm lint`.
- Prettier config in `prettier.config.cjs`; use `pnpm format` / `pnpm format:check`.
- EditorConfig added for consistent indentation/newlines.

## Logging & Timeouts
- Axios logging gated to development; production logs minimal. Use sane timeout (~30s) and central error handling.

## Platform Targets
- Keep Capacitor & Tauri flows: avoid browser-only APIs without guards; no hardcoded window globals in shared libs; ensure routing works with file:// by using history-safe router config.
