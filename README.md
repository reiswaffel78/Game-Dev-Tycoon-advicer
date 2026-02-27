# Game Dev Tycoon Advisor

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gamedevtycoonadvisor.com-brightgreen)](https://gamedevtycoonadvisor.com)
[![Languages](https://img.shields.io/badge/Languages-19-blue)](#available-in-19-languages)
[![TypeScript](https://img.shields.io/badge/TypeScript-React-3178c6)](https://www.typescriptlang.org/)

A free, community-driven companion tool for **Game Dev Tycoon** (including the Netflix edition). Find the best topic-genre combinations, get optimal slider presets, plan your releases, and maximize your review scores.

**[Try it live at gamedevtycoonadvisor.com](https://gamedevtycoonadvisor.com)**

---

## What This Tool Does

- **Topic-Genre-Platform Recommender** -- Find the best combinations for any topic, genre, or platform with scored fit indicators
- **Slider Presets** -- Optimal development focus settings for every genre across all three phases, including multi-genre support
- **Sliders Explained** -- Deep-dive article on how sliders work, Design vs Tech points, and phase weights
- **Game Planner** -- Enter your current save state (year, cash, fans) and get a personalized release and research plan
- **Interactive Checklist** -- Track your progress through the game with custom tasks and milestone tracking
- **Best Combos Reference** -- Quick reference sheet for the most profitable topic-genre combinations
- **Research Order Guide** -- Optimal sequence for unlocking new technologies
- **Research Database** -- Full tech tree with costs, unlock years, and prerequisites
- **Staff Management Guide** -- Phase-based tips from garage to R&D lab
- **Year-by-Year Timeline** -- Platform releases, office unlocks, and action advice for every game year
- **FAQ** -- Answers to the most common gameplay questions
- **Full Game Manual** -- Complete guide covering all game mechanics in detail

## Available in 19 Languages

| | Language | | Language | | Language |
|---|---|---|---|---|---|
| :gb: | English | :kr: | Korean | :netherlands: | Dutch |
| :de: | German | :jp: | Japanese | :saudi_arabia: | Arabic |
| :fr: | French | :cn: | Chinese | :greece: | Greek |
| :it: | Italian | :india: | Hindi | :hungary: | Hungarian |
| :es: | Spanish | :tr: | Turkish | :poland: | Polish |
| | | :brazil: | Portuguese | :sweden: | Swedish |
| | | :ru: | Russian | :czech_republic: | Czech |

## Screenshots


<img width="1871" height="845" alt="Screenshot 2026-02-27 09 00 09" src="https://github.com/user-attachments/assets/2bc69842-a4cf-4295-97e3-94dd7d1e53c2" />

<img width="1868" height="807" alt="Screenshot 2026-02-27 09 26 06" src="https://github.com/user-attachments/assets/cb1fa97a-3380-46cf-bbbf-d6a2c03cf914" />

<img width="1859" height="835" alt="Screenshot 2026-02-27 09 26 32" src="https://github.com/user-attachments/assets/82c96e9d-1f23-4b19-af8c-b9c104fade8a" />

<img width="1865" height="816" alt="Screenshot 2026-02-27 09 26 42" src="https://github.com/user-attachments/assets/97f09465-b60a-4118-b307-60262d9d1b4a" />

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, shadcn/ui (Radix UI) |
| State | TanStack React Query |
| Routing | wouter |
| i18n | react-i18next (19 languages) |
| Backend | Express 5, Node.js |
| Database | PostgreSQL with Drizzle ORM |
| SSR | Server-Side Rendering for SEO (react-helmet-async) |
| Build | Vite, esbuild |

## Getting Started

```bash
# Install dependencies
npm install

# Set up the database
# Requires a PostgreSQL database. Set DATABASE_URL in your environment.
npx drizzle-kit push

# Start development server
npm run dev
```

The app runs on `http://localhost:5000` in development.

## Project Structure

```
client/src/          React frontend
  components/        UI components (shadcn/ui)
  pages/             Route page components
  locales/           Translation files (19 languages)
  seo/               SEO head tags and structured data
server/              Express backend
  routes.ts          API endpoints
  storage.ts         Database access layer
  recommendation-engine.ts  Scoring and ranking logic
shared/              Shared TypeScript types
  schema.ts          Drizzle database schema
```

## Disclaimer

This project is **not affiliated with, endorsed by, or connected to Greenheart Games**. Game Dev Tycoon is a trademark of Greenheart Games Pty. Ltd. This is an independent fan-made tool built with community-sourced data.

## License

This project is provided as-is for educational and entertainment purposes. All game data and mechanics belong to their respective owners.
