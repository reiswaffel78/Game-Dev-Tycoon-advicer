---
name: SEO JSON-LD locale pattern
description: How to correctly localize JSON-LD structured data URLs and language codes in SSR context.
---

## Rule
When generating JSON-LD in page components, use locale-aware values instead of hardcoded English URLs:

- **URL**: Use `getCanonicalUrl(pageKey, locale)` from `@/seo/seo` instead of `${BASE_URL}/path`.
- **Language**: Use `locale` directly (e.g., `"en"`, `"de"`) instead of `t("lang", { defaultValue: "en" })`.
- **SSR safety**: Use `useLocale()` from `@/lib/locale` which returns `i18n.language` (SSR-safe) instead of `t("lang", ...)` which may not resolve during SSR.

## How to avoid duplicate declarations
Many pages already declare `locale` via `extractLocaleFromPath(pathname)` or `useLocale()`. Before adding a new `useLocale()` call, check if `locale` is already in scope. If it is, reuse it; don't redeclare it. Duplicate declarations cause build errors (`The symbol "locale" has already been declared`).

## Dependency array
When `locale` is used inside `useMemo(() => jsonLd, [t, locale])`, include it in the dependency array to prevent stale closures.

## Why
- Search engines and social crawlers need locale-aware canonical URLs and language codes in structured data to index localized content correctly.
- Hardcoded English URLs (`${BASE_URL}/faq`) leak crawl authority back to the default locale and confuse Google about which version is canonical for non-English pages.
