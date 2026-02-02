# SSR & SEO Implementation

This document describes the Server-Side Rendering (SSR) implementation for improved SEO and crawler indexability.

## Overview

The application uses **Vite + React SSR** with **wouter** for routing and **react-helmet-async** for managing meta tags. SSR is active in **production mode only**.

## Architecture

### Entry Points

- `client/src/main.tsx` - Client entry for hydration (uses hydrateRoot when SSR content exists)
- `client/src/entry-server.tsx` - Server entry for SSR rendering

### Key Files

- `server/static.ts` - Production SSR middleware
- `client/src/components/seo.tsx` - SEO component using react-helmet-async
- `script/build.ts` - Build script with SSR bundle generation

## How SSR Works

### Development Mode
- Standard Vite dev server (SPA mode)
- No SSR rendering
- Hot Module Replacement enabled

### Production Mode
1. Server receives request
2. `server/static.ts` loads the SSR bundle (`entry-server.js`)
3. React app is rendered to HTML string with wouter static location
4. Helmet collects meta tags during render
5. Meta tags are injected into `<head>`
6. Rendered HTML is injected into `<div id="root">`
7. Full HTML is sent to client
8. Client hydrates the server-rendered HTML

### Wouter SSR Routing

The `entry-server.tsx` uses a static location hook for wouter:

```tsx
const staticLocationHook = (url: string): [string, (to: string) => void] => {
  return [url, () => {}];
};

// Used in render:
<Router hook={() => staticLocationHook(url)}>
  <App />
</Router>
```

This ensures the correct route is rendered on the server based on the request URL.

## Meta Tags per Route

Each page uses the `<SEO>` component with route-specific props:

```tsx
<SEO 
  title={t("faq.title")} 
  description={t("faq.subtitle")}
  path="/faq"
/>
```

The SEO component generates:
- `<title>` 
- `<meta name="description">`
- `<link rel="canonical">`
- `<meta property="og:*">` (Open Graph)
- `<meta name="twitter:*">` (Twitter Cards)
- `<link rel="alternate" hreflang="*">` (i18n)

## SSR-Enabled Routes

The following routes are SSR-enabled with proper meta tags:
- `/` (Dashboard)
- `/faq`
- `/handbuch`
- `/app-guide`
- `/planner`
- `/timeline`
- `/privacy`
- `/recommend/topic` (Topic Recommender)
- `/recommend/genre` (Genre Recommender)
- `/recommend/platform` (Platform Recommender)
- `/sliders` (Slider Presets)
- `/checklist` (Game Progress Checklist)
- `/staff` (Staff Guide)
- `/research` (Research Guide)

## Build Commands

```bash
# Development (SPA mode)
npm run dev

# Production build (includes SSR bundle)
npm run build

# Start production server
npm start
```

## Verification Tests

After building for production, verify SSR is working:

```bash
# 1. Build the application
npm run build

# 2. Start production server (on a different port if needed)
PORT=3001 npm start

# 3. Check HTML contains content (not just empty #root)
curl -s http://localhost:3001/ | head -n 60

# 4. Check FAQ has route-specific meta tags
curl -s http://localhost:3001/faq | grep -i "<title>"
curl -s http://localhost:3001/faq | grep -i "description"
curl -s http://localhost:3001/faq | grep -i "canonical"
curl -s http://localhost:3001/faq | grep -i "og:title"
```

### Expected Output

For `/faq`, you should see:
- `<title>FAQ | Game Dev Tycoon Advisor</title>`
- `<meta name="description" content="...">`
- `<link rel="canonical" href="https://game-dev-tycoon-advicer.com/faq">`
- `<meta property="og:title" content="FAQ | Game Dev Tycoon Advisor">`

## Hydration

The main entry (`main.tsx`) uses `hydrateRoot` when SSR content is present:

```tsx
if (container.hasChildNodes()) {
  hydrateRoot(container, <HelmetProvider><App /></HelmetProvider>);
} else {
  createRoot(container).render(<HelmetProvider><App /></HelmetProvider>);
}
```

This ensures:
- Production: Hydration of SSR content (no re-render)
- Development: Standard client-side rendering

## Troubleshooting

### Meta tags not in initial HTML
- Ensure you're testing production build (`npm run build && npm start`)
- Development mode doesn't include SSR

### Wrong route rendered
- Check `entry-server.tsx` is passing URL to wouter correctly
- Verify the request URL is being passed to `render(url)`

### Hydration warnings
- Ensure client and server render identical HTML
- Check for date/time differences between server and client
- Verify translations are loaded before render
