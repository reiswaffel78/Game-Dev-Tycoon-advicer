# Game Dev Tycoon Advisor

## Overview

A production-ready web application that provides optimal setup recommendations for the game "Game Dev Tycoon" (including Netflix edition). The app helps players find the best topic-genre combinations, platform recommendations, and slider presets based on community-sourced data with trust-weighted conflict resolution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Framework**: Express.js 5.x running on Node.js
- **API Design**: RESTful JSON APIs under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod schemas generated from Drizzle schema using drizzle-zod
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage

### Data Model
The application models Game Dev Tycoon gameplay data:
- **Core Entities**: Topics, Genres, Platforms, Audiences
- **Relationship Tables**: Topic-Genre fits, Platform-Genre fits, Platform-Audience fits (scored -3 to +3)
- **Development Weights**: Per-genre slider presets for development stages (Engine, Gameplay, Story, etc.)
- **Source Tracking**: Data sources with trust levels for conflict resolution
- **Snapshots**: Versioned data snapshots for data provenance

### Recommendation Engine
- Calculates optimal setups using weighted scoring formula
- Weights: Topic-Genre (40%), Platform-Genre (25%), Platform-Audience (20%), Unlock bonus (10%), Cost penalty (5%)
- Filters exclude poor-fit combinations (Platform-Genre fit ≤ -2)
- Trust-weighted merge for conflicting data from multiple sources

### Build System
- Development: Vite dev server with HMR, proxied through Express
- Production: Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Database migrations via `drizzle-kit push`

### Project Structure
```
├── client/src/          # React frontend application
│   ├── components/      # UI components (shadcn/ui)
│   ├── pages/          # Route page components
│   │   ├── dashboard.tsx      # Main dashboard with quick stats
│   │   ├── research.tsx       # Research/technology guide
│   │   ├── staff.tsx          # Staff management guide
│   │   ├── timeline.tsx       # Year-by-year walkthrough
│   │   ├── checklist.tsx      # Interactive progress tracker
│   │   ├── planner.tsx        # Game planner with state management
│   │   ├── slider-presets.tsx # Genre slider presets
│   │   └── topic-/genre-/platform-recommender.tsx
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions and query client
├── server/             # Express backend
│   ├── routes.ts       # API route definitions with Zod validation
│   ├── storage.ts      # Database access layer
│   ├── recommendation-engine.ts  # Core recommendation logic
│   └── seed.ts         # Database seeding
├── shared/             # Shared TypeScript types and schema
│   └── schema.ts       # Drizzle database schema
└── migrations/         # Drizzle database migrations
```

### Recent Additions (Companion Guide Features)
- **Research Guide**: Technologies with unlock year, costs, research points, prerequisites, and strategy tips
- **Staff Management Guide**: Phase-based tips for garage, first office, second office, R&D lab, hardware lab
- **Timeline Walkthrough**: Year-by-year milestones, platform releases, office unlocks, and action advice
- **Interactive Checklist**: Track progress through the game with custom tasks and milestone tracking
- **FAQ Page**: 16 frequently asked questions organized by categories (Grundlagen, Slider, Mitarbeiter, Forschung, Plattformen, Strategie, Fortgeschritten)
- **Handbuch Page**: Complete game manual with 6 tabbed sections covering all game mechanics

### SEO Implementation
- **Per-page SEO**: SEO component (`client/src/components/seo.tsx`) dynamically updates page titles and meta descriptions
- **Open Graph/Twitter Cards**: Social media preview tags for better sharing
- **JSON-LD Structured Data**: Schema.org markup for search engines
- **Sitemap**: `client/public/sitemap.xml` with all page URLs
- **Robots.txt**: `client/public/robots.txt` allowing all crawlers
- **German Language**: All content in German for German market discoverability

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database access with automatic schema synchronization

### UI Component Libraries
- **Radix UI**: Unstyled accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-styled component collection built on Radix
- **Lucide React**: Icon library

### Build Tools
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **TypeScript**: Full type coverage across client, server, and shared code

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling (dev only)
- **@replit/vite-plugin-dev-banner**: Development banner (dev only)