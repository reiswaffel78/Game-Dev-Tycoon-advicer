# Graph Report - game-dev-tycoon-advicer  (2026-10-18)

## Corpus Check
- 140 files · ~279,564 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .xml 2, .css 1)

## Summary
- 1115 nodes · 2994 edges · 63 communities (43 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b1a996e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- slider-presets.tsx
- dependencies
- package.json
- schema.ts
- cn
- sidebar.tsx
- use-share-nudge.tsx
- planner.tsx
- react
- pagination.tsx
- devDependencies
- recommendation-engine.ts
- App.tsx
- IStorage
- command.tsx
- loadLocaleData
- SSR & SEO Implementation
- System Architecture
- compilerOptions
- menubar.tsx
- check-seo-head.ts
- vite.ts
- entry-server.tsx
- components.json
- DatabaseStorage
- i18n.ts
- carousel.tsx
- class-variance-authority
- UserChecklistItem
- index.ts
- Game Dev Tycoon Advisor – Projektstand
- chart.tsx
- check-planner-unlocked-topics-filter.ts
- Game Dev Tycoon Advisor
- theme-provider.tsx
- drawer.tsx
- navigation-menu.tsx
- Audience
- GenreDevWeight
- PlatformAudienceFit
- Source
- UserSaveState
- language-switcher.tsx
- select.tsx
- scripts
- SEO Strategy
- Genre
- Platform
- Snapshot
- Topic
- jsonld-locale.md
- queryClient.ts
- CLAUDE.md
- graphify
- overrides
- AGENTS.md
- .claude/CLAUDE.md
- @radix-ui/react-aspect-ratio
- drizzle-kit
- optionalDependencies
- tailwindcss
- post-merge.sh

## God Nodes (most connected - your core abstractions)
1. `cn()` - 227 edges
2. `react` - 64 edges
3. `Card` - 55 edges
4. `CardContent` - 55 edges
5. `Badge()` - 50 edges
6. `IStorage` - 48 edges
7. `DatabaseStorage` - 48 edges
8. `lucide-react` - 46 edges
9. `CardHeader` - 45 edges
10. `CardTitle` - 44 edges

## Surprising Connections (you probably didn't know these)
- `How to avoid duplicate declarations` --references--> `useLocale()`  [INFERRED]
  .agents/memory/jsonld-locale.md → client/src/lib/locale.tsx
- `Rule` --references--> `useLocale()`  [INFERRED]
  .agents/memory/jsonld-locale.md → client/src/lib/locale.tsx
- `Gelöste technische Herausforderungen` --references--> `serveStatic()`  [INFERRED]
  .handoff-prompt.md → server/static.ts
- `main()` --calls--> `generatePlannerRecommendations()`  [EXTRACTED]
  script/check-planner-unlocked-topics-filter.ts → server/recommendation-engine.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/ui/alert-dialog.tsx → client/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (63 total, 20 thin omitted)

### Community 0 - "slider-presets.tsx"
Cohesion: 0.07
Nodes (114): GenreRecommender, PlatformRecommender, TopicRecommender, NextStepCTA(), NextStepCTAProps, AccordionContent, AccordionItem, AccordionTrigger (+106 more)

### Community 1 - "dependencies"
Cohesion: 0.03
Nodes (68): dependencies, class-variance-authority, clsx, cmdk, connect-pg-simple, date-fns, drizzle-orm, drizzle-zod (+60 more)

### Community 2 - "package.json"
Cohesion: 0.04
Nodes (56): license, name, type, version, autoprefixer, bufferutil, clsx, connect-pg-simple (+48 more)

### Community 3 - "schema.ts"
Cohesion: 0.08
Nodes (45): drizzle-orm, drizzle-zod, pg, zod, db, pool, seedDatabase(), seedGuideData() (+37 more)

### Community 4 - "cn"
Cohesion: 0.08
Nodes (40): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator(), CardDescription (+32 more)

### Community 5 - "sidebar.tsx"
Cohesion: 0.09
Nodes (36): AppSidebar(), Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+28 more)

### Community 6 - "use-share-nudge.tsx"
Cohesion: 0.10
Nodes (32): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+24 more)

### Community 7 - "planner.tsx"
Cohesion: 0.11
Nodes (28): Planner, Checkbox, FormControl, FormDescription, FormField(), FormFieldContext, FormFieldContextValue, FormItem (+20 more)

### Community 8 - "react"
Cohesion: 0.09
Nodes (18): Avatar, AvatarFallback, AvatarImage, HoverCardContent, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot (+10 more)

### Community 9 - "pagination.tsx"
Cohesion: 0.10
Nodes (22): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+14 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (24): devDependencies, autoprefixer, drizzle-kit, esbuild, postcss, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner, @replit/vite-plugin-runtime-error-modal (+16 more)

### Community 11 - "recommendation-engine.ts"
Cohesion: 0.20
Nodes (20): calculateCostPenalty(), calculateUnlockBonus(), createCitations(), createDefaultPreset(), generateExplanation(), generatePlannerRecommendations(), getEffectivePlannerTopics(), getImportance() (+12 more)

### Community 12 - "App.tsx"
Cohesion: 0.10
Nodes (20): AppGuide, AppRoutes(), Checklist, Dashboard, FAQ, GameDevTycoonBestCombos, GameDevTycoonGuide, GameDevTycoonResearchOrder (+12 more)

### Community 13 - "IStorage"
Cohesion: 0.11
Nodes (5): IStorage, InsertTopicGenreFit, ResearchItem, StaffTip, TopicGenreFit

### Community 14 - "command.tsx"
Cohesion: 0.13
Nodes (17): Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+9 more)

### Community 16 - "SSR & SEO Implementation"
Cohesion: 0.10
Nodes (19): Architecture, Build Commands, Development Mode, Entry Points, Expected Output, How SSR Works, Hydration, Hydration warnings (+11 more)

### Community 17 - "System Architecture"
Cohesion: 0.10
Nodes (19): Backend Architecture, Build System, Build Tools, Data Model, Database, External Dependencies, Frontend Architecture, Game Dev Tycoon Advisor (+11 more)

### Community 18 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, baseUrl, esModuleInterop, incremental, jsx, lib, module (+10 more)

### Community 19 - "menubar.tsx"
Cohesion: 0.11
Nodes (12): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+4 more)

### Community 20 - "check-seo-head.ts"
Cohesion: 0.11
Nodes (6): SUPPORTED_LOCALES, cases, __dirname, __filename, template, templatePath

### Community 21 - "vite.ts"
Cohesion: 0.13
Nodes (7): esbuild, @replit/vite-plugin-runtime-error-modal, vite, @vitejs/plugin-react, allowlist, setupVite(), viteLogger

### Community 22 - "entry-server.tsx"
Cohesion: 0.26
Nodes (12): App(), Footer(), ShareNudge(), ThemeProvider(), Button, SidebarProvider(), SidebarTrigger(), KNOWN_ROUTES (+4 more)

### Community 23 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 24 - "DatabaseStorage"
Cohesion: 0.18
Nodes (3): DatabaseStorage, InsertPlatformGenreFit, PlatformGenreFit

### Community 25 - "i18n.ts"
Cohesion: 0.21
Nodes (13): render(), createI18nInstance(), getInitialLanguage(), initClientI18n(), initI18n(), Window, extractLocaleFromPath(), isLocale() (+5 more)

### Community 26 - "carousel.tsx"
Cohesion: 0.17
Nodes (14): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+6 more)

### Community 27 - "class-variance-authority"
Cohesion: 0.20
Nodes (10): Alert, AlertDescription, AlertTitle, alertVariants, ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle (+2 more)

### Community 28 - "UserChecklistItem"
Cohesion: 0.15
Nodes (4): ChecklistItemWithMilestone, InsertUserChecklistItem, TimelineMilestone, UserChecklistItem

### Community 29 - "index.ts"
Cohesion: 0.18
Nodes (11): Gelöste technische Herausforderungen, express, app, http, httpServer, IncomingMessage, log(), normalizeLocalizedUrl() (+3 more)

### Community 30 - "Game Dev Tycoon Advisor – Projektstand"
Cohesion: 0.15
Nodes (12): Build & Deployment, Datenmodell, Empfehlungs-Engine, Game Dev Tycoon Advisor – Projektstand, Internationalisierung (i18n), Projektstruktur, SEO, SSR-Architektur (+4 more)

### Community 31 - "chart.tsx"
Cohesion: 0.24
Nodes (11): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+3 more)

### Community 32 - "check-planner-unlocked-topics-filter.ts"
Cohesion: 0.20
Nodes (10): audiences, genres, main(), platformAudienceFits, platformGenreFits, platforms, signature(), topicGenreFits (+2 more)

### Community 33 - "Game Dev Tycoon Advisor"
Cohesion: 0.20
Nodes (9): Available in 19 Languages, Disclaimer, Game Dev Tycoon Advisor, Getting Started, License, Project Structure, Screenshots, Tech Stack (+1 more)

### Community 34 - "theme-provider.tsx"
Cohesion: 0.28
Nodes (7): initialState, Theme, ThemeProviderContext, ThemeProviderProps, ThemeProviderState, useTheme(), ThemeToggle()

### Community 35 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle, vaul

### Community 36 - "navigation-menu.tsx"
Cohesion: 0.28
Nodes (8): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport, @radix-ui/react-navigation-menu

### Community 42 - "language-switcher.tsx"
Cohesion: 0.43
Nodes (4): LanguageSwitcher(), DropdownMenuContent, DropdownMenuItem, ensureLocaleLoaded()

### Community 43 - "select.tsx"
Cohesion: 0.38
Nodes (6): SelectContent, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, @radix-ui/react-select

### Community 44 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, check, check:planner-filter, db:push, dev, start

### Community 45 - "SEO Strategy"
Cohesion: 0.29
Nodes (6): Dismissed categories, In scope, Out of scope, Primary keywords, SEO Strategy, Target audience

### Community 50 - "jsonld-locale.md"
Cohesion: 0.33
Nodes (4): Dependency array, How to avoid duplicate declarations, Rule, Why

### Community 51 - "queryClient.ts"
Cohesion: 0.50
Nodes (4): getQueryFn(), queryClient, throwIfResNotOk(), UnauthorizedBehavior

### Community 54 - "overrides"
Cohesion: 0.67
Nodes (3): @esbuild-kit/esm-loader, overrides, drizzle-kit

## Knowledge Gaps
- **33 isolated node(s):** `graphify-mcp`, `@jridgewell/trace-mapping`, `connect-pg-simple`, `date-fns`, `express-session` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 406 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `slider-presets.tsx`, `drawer.tsx`, `navigation-menu.tsx`, `sidebar.tsx`, `use-share-nudge.tsx`, `planner.tsx`, `react`, `pagination.tsx`, `language-switcher.tsx`, `select.tsx`, `command.tsx`, `menubar.tsx`, `entry-server.tsx`, `carousel.tsx`, `class-variance-authority`, `chart.tsx`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **What connects `graphify-mcp`, `@jridgewell/trace-mapping`, `connect-pg-simple` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `slider-presets.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07012987012987013 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.029411764705882353 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `slider-presets.tsx`, `theme-provider.tsx`, `drawer.tsx`, `cn`, `navigation-menu.tsx`, `sidebar.tsx`, `planner.tsx`, `use-share-nudge.tsx`, `pagination.tsx`, `package.json`, `select.tsx`, `App.tsx`, `command.tsx`, `menubar.tsx`, `entry-server.tsx`, `carousel.tsx`, `class-variance-authority`, `chart.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.03508771929824561 - nodes in this community are weakly interconnected._