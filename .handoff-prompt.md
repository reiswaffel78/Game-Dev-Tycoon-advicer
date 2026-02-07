# Game Dev Tycoon Advisor – Projektstand

## Überblick

Produktionsreife Fullstack-Webanwendung, die Spielern von "Game Dev Tycoon" (inkl. Netflix-Edition) optimale Setup-Empfehlungen liefert: Topic-Genre-Kombinationen, Plattform-Empfehlungen, Slider-Presets, Fortschritts-Tracking und umfangreiche Spielanleitungen. Zweisprachig (EN/DE). Veröffentlicht unter: https://game-dev-tycoon-advicer.com

## Technischer Stack

- **Frontend**: React + TypeScript, Vite, Wouter (Routing), TanStack React Query, shadcn/ui, Tailwind CSS, react-i18next
- **Backend**: Express.js 5.x, Drizzle ORM, PostgreSQL (Neon-backed via Replit)
- **SSR**: Vollständiges Server-Side Rendering in Produktion mit react-helmet-async, Wouter SSR-Hook, ~48KB pre-rendered HTML
- **Build**: Vite (Client), esbuild (Server), SSR-Bundle über `script/build.ts`

## Projektstruktur

```
├── client/src/
│   ├── components/       # UI-Komponenten (shadcn/ui, NumericInput, SEO, ThemeProvider)
│   ├── pages/            # Seitenkomponenten
│   │   ├── dashboard.tsx       # Haupt-Dashboard mit Quick Stats
│   │   ├── planner.tsx         # Game Planner mit State Management
│   │   ├── research.tsx        # Forschungs-/Technologie-Guide
│   │   ├── staff.tsx           # Mitarbeiter-Management-Guide
│   │   ├── timeline.tsx        # Jahr-für-Jahr Walkthrough
│   │   ├── checklist.tsx       # Interaktiver Fortschritts-Tracker
│   │   ├── faq.tsx             # 16 FAQ-Einträge nach Kategorien
│   │   ├── handbuch.tsx        # Komplettes Spielhandbuch (6 Tabs)
│   │   ├── app-guide.tsx       # App-Nutzungsanleitung
│   │   ├── slider-presets.tsx  # Genre-Slider-Presets
│   │   └── topic-/genre-/platform-recommender.tsx
│   ├── hooks/            # Custom Hooks
│   ├── lib/              # Utilities (i18n, queryClient, translate-data)
│   ├── locales/          # en.json, de.json (vollständige Übersetzungen)
│   ├── entry-server.tsx  # SSR-Einstiegspunkt
│   └── main.tsx          # Client-Hydration
├── server/
│   ├── index.ts          # Express-Server mit SSR-Logik
│   ├── static.ts         # Statische Assets (async, muss vor Requests geladen sein)
│   ├── routes.ts         # API-Routen mit Zod-Validierung
│   ├── storage.ts        # Datenbank-Zugriffsschicht (IStorage Interface)
│   ├── recommendation-engine.ts  # Empfehlungslogik mit gewichteter Scoring-Formel
│   └── seed.ts           # Datenbank-Seeding
├── shared/schema.ts      # Drizzle-Schema + Zod-Insert-Schemas
└── migrations/           # Drizzle-Migrationen
```

## Datenmodell

- **Core Entities**: Topics, Genres, Platforms, Audiences
- **Relationship Tables**: Topic-Genre fits, Platform-Genre fits, Platform-Audience fits (Bewertung -3 bis +3)
- **Development Weights**: Slider-Presets pro Genre für Entwicklungsphasen (Engine, Gameplay, Story, etc.)
- **Source Tracking**: Datenquellen mit Trust-Levels für Konfliktauflösung
- **Snapshots**: Versionierte Daten-Snapshots für Daten-Provenienz
- **Datenquellen**: Steam Community Guides (Trust Level 1), Greenheart Forum (Trust Level 4)

## Empfehlungs-Engine

Gewichtete Scoring-Formel:
- Topic-Genre: 40%
- Platform-Genre: 25%
- Platform-Audience: 20%
- Unlock-Bonus: 10%
- Cost-Penalty: 5%
- Filter: Kombinationen mit Platform-Genre fit ≤ -2 werden ausgeschlossen
- Trust-gewichteter Merge bei widersprüchlichen Daten aus mehreren Quellen

## SSR-Architektur

- **Produktion**: `server/static.ts` lädt statische Assets async – muss vor Request-Handling abgeschlossen sein
- **Hydration**: `client/src/main.tsx` hydratiert das vom Server gerenderte HTML
- **SSR-Render**: `client/src/entry-server.tsx` rendert React-Komponenten zu HTML-String
- **Wouter SSR**: `staticLocationHook` für korrektes serverseitiges Routing
- **Helmet**: react-helmet-async für SSR-kompatible Meta-Tags (inkl. htmlAttributes, bodyAttributes)
- **SSR-sichere Komponenten**: ThemeProvider, i18n und sessionId-Generierung prüfen `typeof window` vor localStorage-Zugriff

## Internationalisierung (i18n)

- **Sprachen**: Englisch (Fallback) und Deutsch
- **Konfiguration**: `client/src/lib/i18n.ts` mit Browser-Language-Detection
- **Übersetzungsdateien**: `client/src/locales/en.json` und `client/src/locales/de.json`
- **Daten-Übersetzung**: `client/src/lib/translate-data.ts` für Entity-Namen (Genre, Topic, Platform, Audience)
- **Sprachspeicherung**: localStorage, SSR-safe mit Fallback auf Englisch

## Gelöste technische Herausforderungen

- **SSR Module Loading Race Condition**: `serveStatic` in `server/index.ts` muss async geladen und awaited werden, bevor Requests akzeptiert werden (nur Produktion)
- **SSR Hydration Mismatches**: localStorage-Zugriffe (Theme, SessionId, i18n) sind mit `typeof window !== 'undefined'`-Checks SSR-safe gemacht
- **NumericInput-Komponente**: Custom-Komponente mit lokalem String-State während Fokus, Normalisierung auf Zahlenwert bei Blur mit Fallback/Min-Validierung. Schema-seitig `z.preprocess` für sichere String-zu-Number-Konvertierung bei Formularübermittlung

## SEO

- Per-Page SEO-Komponente mit react-helmet-async
- Open Graph / Twitter Cards für Social Media Previews
- JSON-LD Structured Data (Schema.org)
- Sitemap (`client/public/sitemap.xml`)
- Robots.txt (`client/public/robots.txt`)
- Kanonische URLs pro Seite
- Dokumentation: `docs/ssr-seo.md`

## Build & Deployment

- **Development**: `npm run dev` – Vite Dev Server mit HMR, proxied durch Express
- **Production Build**: `npm run build` – Vite baut Client nach `dist/public`, esbuild bundelt Server nach `dist/index.cjs`, SSR-Bundle nach `dist/entry-server.js`
- **Datenbank-Sync**: `npm run db:push` (Drizzle Kit)
- **Deployment**: Über Replit Publishing, Domain: https://game-dev-tycoon-advicer.com

## Umgebungsvariablen

- `DATABASE_URL`: PostgreSQL-Verbindung (Replit-managed)
- `SESSION_SECRET`: Express-Session Secret

## Styling

- CRT-Retro Green/Amber Farbschema
- Dark Mode via ThemeProvider mit CSS-Klassen-Toggle
- Tailwind CSS mit CSS-Variablen für Theming
- shadcn/ui Komponentenbibliothek auf Radix UI Primitives
