# Phase 3 — Refactor Plan

## Definition of Done (overall)
- `pnpm lint` and `pnpm build` succeed with no new warnings/errors.
- App behavior unchanged (auth, routing, orders/parts/notifications flows still work).
- Folder structure follows app/shared/features direction; imports updated or aliased.
- Env/config clarified for web + Tauri + Capacitor; Axios client hardened.
- Documentation in `docs/refactor/*` and root `README.md` reflects final state.

## Step-by-step Plan (small, reversible checkpoints)

1) **Tighten Type & Lint Baseline**
   - Files: `tsconfig.app.json`, `package.json`, `eslint.config.js` (if needed).
   - Actions: enable TS `strict`, remove mismatched `@types/react-router-dom@5`, ensure React Router v7 types resolve; run lint to surface issues (fix minimal blockers only).
   - Acceptance: TypeScript compile passes; app still builds; no v5 router types in lockfile.
   - Risks: surfacing many TS errors — mitigate by incremental fixes and selective `satisfies` typings.

2) **Env & Axios Hardening**
   - Files: `src/provider/AxiosClient.ts`, new `src/app/config/env.ts` (or `shared/lib/env`).
   - Actions: gate logging to `import.meta.env.DEV`, set timeout ~30s, namespace auth storage key, centralize base URL/env parsing with fallbacks for web/Tauri/Capacitor.
   - Acceptance: Axios uses parsed base URL; prod logs quiet; unauthorized handling remains.
   - Risks: breaking auth header injection — mitigate by tests/manual login.

3) **Routing Layer Cleanup**
   - Files: move `src/routes/index.tsx` → `src/app/router/routes.tsx`; update imports in `App.tsx`, others; align ProtectedRoute types; ensure lazy-safe exports.
   - Acceptance: Routing works identical; dev server navigates; no import errors.
   - Risks: path typos — mitigate via TypeScript + manual smoke (login → dashboard → pages).

4) **Shared Layer Establishment**
   - Files: create `src/shared/ui` (move `Button`, `Input`, `Toast`, `LoadingScreen`), `src/shared/lib` (axios/query helpers), `src/shared/hooks` (useDebounce/useToast), add index barrels; provide temporary re-exports to avoid wide churn.
   - Acceptance: components import from new paths or transitional barrels; app still builds.
   - Risks: broken import paths — mitigate by staged re-export and search/replace with `rg`.

5) **Feature Hook Simplification**
   - Files: `src/hooks/*` → per-feature `src/features/<domain>/hooks/`. Replace factory-return pattern with direct exports (`useGetOrders`, etc.). Update consumers gradually starting with Orders/Parts/Auth.
   - Acceptance: No hook rule violations; affected pages compile; tests/manual flows pass.
   - Risks: misuse of hooks conditionally — mitigate by keeping usage patterns the same while changing import paths.

6) **Notifications Naming & Guards**
   - Files: `src/hooks/useWebSocket.ts` (rename to polling hook), Notification provider/components.
   - Actions: rename to reflect polling; add `enabled: !!user` guards; ensure interval configurable; keep behavior.
   - Acceptance: notifications still arrive via polling; unread badge updates; no runtime errors when user is undefined.
   - Risks: missed rename — mitigate with import search.

7) **Auth Lifecycle Stability**
   - Files: `src/context/AuthContext.tsx`.
   - Actions: wait for refresh before clearing loading; add storage key namespace; ensure logout path emits navigation hook; tighten dependencies.
   - Acceptance: initial load doesn’t flash unauthenticated; refresh handles expiry; logout clears tokens and redirects.
   - Risks: regression in auto-refresh — mitigate via manual test and log inspection.

8) **Documentation & Validation Finalization**
   - Files: `docs/refactor/07-final-report.md`, update existing docs if steps adjusted.
   - Actions: summarize structural changes, how to add features, remaining debt; run validation checklist and record results in `docs/refactor/08-validation.md`.
   - Acceptance: Docs align with final structure; validation results captured.
   - Risks: stale docs — mitigate by updating alongside code changes.
