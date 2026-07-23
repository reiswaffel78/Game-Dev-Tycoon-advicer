import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import NotFound from "@/pages/not-found";
import { Footer } from "@/components/footer";
import { ShareNudge } from "@/components/share-nudge";
import { ShareNudgeProvider } from "@/hooks/use-share-nudge";
import { useFirstVisitToday } from "@/hooks/use-first-visit-today";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const TopicRecommender = lazy(() => import("@/pages/topic-recommender"));
const GenreRecommender = lazy(() => import("@/pages/genre-recommender"));
const PlatformRecommender = lazy(() => import("@/pages/platform-recommender"));
const SliderPresets = lazy(() => import("@/pages/slider-presets"));
const GameDevTycoonGuide = lazy(() => import("@/pages/game-dev-tycoon-guide"));
const GameDevTycoonBestCombos = lazy(() => import("@/pages/game-dev-tycoon-best-combos"));
const GameDevTycoonSliders = lazy(() => import("@/pages/game-dev-tycoon-sliders"));
const GameDevTycoonResearchOrder = lazy(() => import("@/pages/game-dev-tycoon-research-order"));
const Planner = lazy(() => import("@/pages/planner"));
const Sources = lazy(() => import("@/pages/sources"));
const Research = lazy(() => import("@/pages/research"));
const Staff = lazy(() => import("@/pages/staff"));
const Timeline = lazy(() => import("@/pages/timeline"));
const Checklist = lazy(() => import("@/pages/checklist"));
const FAQ = lazy(() => import("@/pages/faq"));
const Handbuch = lazy(() => import("@/pages/handbuch"));
const AppGuide = lazy(() => import("@/pages/app-guide"));
const Privacy = lazy(() => import("@/pages/privacy"));

function RouteLoadingFallback() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/recommend/topic/:topicId" component={TopicRecommender} />
        <Route path="/recommend/topic" component={TopicRecommender} />
        <Route path="/recommend/genre/:genreId" component={GenreRecommender} />
        <Route path="/recommend/genre" component={GenreRecommender} />
        <Route path="/recommend/platform/:platformId" component={PlatformRecommender} />
        <Route path="/recommend/platform" component={PlatformRecommender} />
        <Route path="/sliders/:genreId" component={SliderPresets} />
        <Route path="/sliders" component={SliderPresets} />
        <Route path="/game-dev-tycoon-guide" component={GameDevTycoonGuide} />
        <Route path="/game-dev-tycoon-best-combos" component={GameDevTycoonBestCombos} />
        <Route path="/game-dev-tycoon-sliders" component={GameDevTycoonSliders} />
        <Route path="/game-dev-tycoon-research-order" component={GameDevTycoonResearchOrder} />
        <Route path="/planner" component={Planner} />
        <Route path="/research" component={Research} />
        <Route path="/staff" component={Staff} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/checklist" component={Checklist} />
        <Route path="/faq" component={FAQ} />
        <Route path="/handbuch" component={Handbuch} />
        <Route path="/app-guide" component={AppGuide} />
        <Route path="/sources" component={Sources} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;
  const isFirstVisitToday = useFirstVisitToday();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="gdt-advisor-theme">
      <TooltipProvider>
        <ShareNudgeProvider>
          <SidebarProvider style={sidebarStyle}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="flex items-center gap-1">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-auto flex flex-col">
                  <div className={`flex-1${isFirstVisitToday ? " animate-page-fade-in" : ""}`}>
                    <AppRoutes />
                  </div>
                  <Footer />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <ShareNudge />
          <Toaster />
        </ShareNudgeProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
