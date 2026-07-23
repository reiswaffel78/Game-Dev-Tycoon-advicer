---
name: No manualChunks or React.lazy in production
description: Vite manualChunks and React.lazy() cause permanent loading spinners in Replit autoscale production deployments — must use single eager bundle.
---

## Rule
Never use `manualChunks` in `vite.config.ts` or `React.lazy()` / `Suspense` for route components in this project.

**Why:** In the Replit autoscale production deployment, split JS chunks (vendor-react, vendor-query, etc.) fail to load correctly. The browser silently gets 404s or load failures for the chunk files, causing `Suspense` fallback spinners to remain permanently visible. All interactive pages (Sliders, Planner, Research, Staff, Timeline, Checklist, FAQ, Manual, App Guide) become broken — showing only a spinner. The dev server (Vite HMR) works fine because it serves modules differently, masking the production bug. This has caused production breakage three separate times (Tasks #22, #25, and again after #25 re-merge).

**How to apply:**
- `vite.config.ts` `build:` block must have NO `rollupOptions.output.manualChunks`
- `client/src/App.tsx` must use direct `import X from "@/pages/x"` — no `lazy()`
- The `Suspense` wrapper around `<Switch>` must be removed
- The single output bundle will be large (~2.3 MB) — this is acceptable and correct
- SSR (`AppSSR.tsx`) can still use eager imports separately if needed; the SSR bundle is not served to browsers so its size doesn't matter
