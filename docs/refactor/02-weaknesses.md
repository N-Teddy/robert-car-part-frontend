# Phase 1 — Weaknesses

1) **Type safety turned off + router type mismatch**  
   - Files: `tsconfig.app.json` (`"strict": false`), `package.json` (`react-router-dom@7.9.1` + `@types/react-router-dom@5.3.3`).  
   - Issue: Disabled strict mode hides null/undefined and API shape errors; mismatched types with Router v7 break IDE intellisense and can cause wrong props.  
   - Severity: High.  
   - Fix direction: Enable strict TS, add proper React Router v7 types (remove v5 types), run `pnpm lint --max-warnings=0` to surface fixes iteratively.

2) **Inconsistent architecture and unused feature shell**  
   - Files: `src/features/` and `src/shared/` exist but are empty; domain UI lives in `src/components/*` and `src/pages/*`, providers in `src/context/`, routers in `src/routes/index.tsx`.  
   - Issue: Mixed layering makes discoverability poor and future features harder to isolate; dead directories imply abandoned migration.  
   - Severity: High.  
   - Fix direction: Adopt clear feature-based structure (app/shared/features/entities) and move modules gradually with index barrels + aliasing.

3) **Axios client overly noisy and lenient**  
   - File: `src/provider/AxiosClient.ts`.  
   - Issue: Console logs every request/response and sets `timeout: 1000000ms`; noisy in production, hides hung calls, and exposes user agent data.  
   - Severity: Medium.  
   - Fix direction: Gate logging by env, set sane timeout (20–30s), add error surface strategy (toast/hook) instead of console-only.

4) **“WebSocket” hook is polling-only and misnamed**  
   - File: `src/hooks/useWebSocket.ts`.  
   - Issue: Uses `setInterval` polling via Axios every 30s but exports `useWebSocket`/`isConnected`; naming suggests sockets, may mislead contributors and double-poll when real sockets added.  
   - Severity: Medium.  
   - Fix direction: Rename to `useNotificationPolling`, parameterize interval, centralize in notification feature, and plan actual socket client separately.

5) **React Query hooks wrapped in factory objects**  
   - Files: `src/hooks/orderHook.ts`, `partHook.ts`, `notificationHook.ts`, etc.  
   - Issue: Components call `const { useGetAllOrders } = useOrder();` then invoke hook; factory allocates new hook creators per render and obscures import paths; increases cognitive load and risks rule-of-hooks misuse when destructured conditionally.  
   - Severity: Medium.  
   - Fix direction: Export hooks directly (named hooks per domain) from a feature index, no factory wrapper.

6) **Auth lifecycle race + limited error pathways**  
   - File: `src/context/AuthContext.tsx`.  
   - Issue: Initial effect sets `loading` false immediately even if refresh mutation is in-flight; refresh effect depends only on `tokens`, not `refreshMutation` handlers; logout on 401 only removes storage, no navigation; tokens saved to localStorage without namespacing.  
   - Severity: Medium.  
   - Fix direction: Track refresh promise, await before clearing `loading`; include mutation dependencies; emit auth event/navigation; namespace storage key with app id.

7) **Notification dropdown assumes user is always defined**  
   - File: `src/components/notifications/NotificationDropdown.tsx` (`user.id` passed into query).  
   - Issue: If context is null or user not loaded yet, code would throw; currently guarded by `ProtectedRoute` but brittle for future reuse and during initial auth loading.  
   - Severity: Low.  
   - Fix direction: Guard on `user?.id`, enable `enabled: !!user` in query.

8) **Styling lacks shared tokens and has duplicated keyframes**  
   - File: `src/index.css` (duplicate `@keyframes fadeIn`, ad-hoc utilities).  
   - Issue: No design tokens or theme variables; duplicates risk divergence and makes Tailwind theming harder across web/Tauri/Capacitor targets.  
   - Severity: Low.  
   - Fix direction: Create shared design tokens (color/spacing/typography) via Tailwind config + CSS variables; dedupe keyframes and utilities under `src/styles`.

9) **Testing and lint coverage absent**  
   - Files: no tests directory; ESLint present but not type-aware; Prettier/EditorConfig missing.  
   - Issue: Hard to guard regressions during refactor; code style not enforced across contributors/CI.  
   - Severity: Medium.  
   - Fix direction: Add type-aware ESLint, Prettier, EditorConfig, and minimal smoke tests for core flows (auth, dashboard render) with pnpm scripts + CI hook.
