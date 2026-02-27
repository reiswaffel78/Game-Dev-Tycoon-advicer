import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import TopicRecommender from "@/pages/topic-recommender";
import GenreRecommender from "@/pages/genre-recommender";
import PlatformRecommender from "@/pages/platform-recommender";
import SliderPresets from "@/pages/slider-presets";
import GameDevTycoonGuide from "@/pages/game-dev-tycoon-guide";
import GameDevTycoonBestCombos from "@/pages/game-dev-tycoon-best-combos";
import GameDevTycoonSliders from "@/pages/game-dev-tycoon-sliders";
import GameDevTycoonResearchOrder from "@/pages/game-dev-tycoon-research-order";
import Planner from "@/pages/planner";
import Sources from "@/pages/sources";
import Research from "@/pages/research";
import Staff from "@/pages/staff";
import Timeline from "@/pages/timeline";
import Checklist from "@/pages/checklist";
import FAQ from "@/pages/faq";
import Handbuch from "@/pages/handbuch";
import AppGuide from "@/pages/app-guide";
import Privacy from "@/pages/privacy";
import { Footer } from "@/components/footer";
import { ShareNudge } from "@/components/share-nudge";
import { ShareNudgeProvider } from "@/hooks/use-share-nudge";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/recommend/topic" component={TopicRecommender} />
      <Route path="/recommend/genre" component={GenreRecommender} />
      <Route path="/recommend/platform" component={PlatformRecommender} />
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
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="gdt-advisor-theme">
      <QueryClientProvider client={queryClient}>
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
                    <div className="flex-1">
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
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
