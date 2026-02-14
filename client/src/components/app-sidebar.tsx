import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Gamepad2,
  LayoutDashboard,
  Tag,
  Layers,
  Monitor,
  SlidersHorizontal,
  CalendarClock,
  Database,
  FlaskConical,
  Users,
  Clock,
  ClipboardList,
  HelpCircle,
  BookOpen,
  Compass,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      title: t("nav.dashboard"),
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: t("nav.topicRecommender"),
      url: "/recommend/topic",
      icon: Tag,
    },
    {
      title: t("nav.genreRecommender"),
      url: "/recommend/genre",
      icon: Layers,
    },
    {
      title: t("nav.platformRecommender"),
      url: "/recommend/platform",
      icon: Monitor,
    },
  ];

  const toolsItems = [
    {
      title: t("nav.sliderPresets"),
      url: "/sliders",
      icon: SlidersHorizontal,
    },
    {
      title: t("nav.planner"),
      url: "/planner",
      icon: CalendarClock,
    },
    {
      title: t("nav.research"),
      url: "/research",
      icon: FlaskConical,
    },
    {
      title: t("nav.staff"),
      url: "/staff",
      icon: Users,
    },
    {
      title: t("nav.timeline"),
      url: "/timeline",
      icon: Clock,
    },
    {
      title: t("nav.checklist"),
      url: "/checklist",
      icon: ClipboardList,
    },
    {
      title: t("nav.faq"),
      url: "/faq",
      icon: HelpCircle,
    },
    {
      title: t("nav.handbuch"),
      url: "/handbuch",
      icon: BookOpen,
    },
    {
      title: t("nav.appGuide"),
      url: "/app-guide",
      icon: Compass,
    },
  ];

  const articleItems = [
    {
      title: t("nav.guide"),
      url: "/game-dev-tycoon-guide",
      icon: BookOpen,
    },
    {
      title: t("nav.bestCombos"),
      url: "/game-dev-tycoon-best-combos",
      icon: Sparkles,
    },
    {
      title: t("nav.slidersExplained"),
      url: "/game-dev-tycoon-sliders",
      icon: SlidersHorizontal,
    },
    {
      title: t("nav.researchOrder"),
      url: "/game-dev-tycoon-research-order",
      icon: FlaskConical,
    },
  ];

  const dataItems = [
    {
      title: t("nav.sources"),
      url: "/sources",
      icon: Database,
    },
    {
      title: t("nav.privacy"),
      url: "/privacy",
      icon: Shield,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Gamepad2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-sidebar-foreground">
              GDT Advisor
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              {t("dashboard.subtitle")}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {t("nav.tools")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.url.replace(/\//g, "-").slice(1) || "home"}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {t("nav.guides")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.url.replace(/\//g, "-").slice(1)}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {t("nav.articles")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {articleItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.url.replace(/\//g, "-").slice(1)}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {t("nav.data")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.url.replace(/\//g, "-").slice(1)}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-md bg-sidebar-accent/50 p-3">
          <p className="text-xs text-sidebar-foreground/70">
            {t("sources.subtitle")}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
