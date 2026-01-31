import { Link, useLocation } from "wouter";
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

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "By Topic",
    url: "/recommend/topic",
    icon: Tag,
  },
  {
    title: "By Genre",
    url: "/recommend/genre",
    icon: Layers,
  },
  {
    title: "By Platform",
    url: "/recommend/platform",
    icon: Monitor,
  },
];

const toolsItems = [
  {
    title: "Slider Presets",
    url: "/sliders",
    icon: SlidersHorizontal,
  },
  {
    title: "Game Planner",
    url: "/planner",
    icon: CalendarClock,
  },
  {
    title: "Research Guide",
    url: "/research",
    icon: FlaskConical,
  },
  {
    title: "Staff Guide",
    url: "/staff",
    icon: Users,
  },
  {
    title: "Timeline",
    url: "/timeline",
    icon: Clock,
  },
  {
    title: "Checklist",
    url: "/checklist",
    icon: ClipboardList,
  },
  {
    title: "FAQ",
    url: "/faq",
    icon: HelpCircle,
  },
  {
    title: "Handbuch",
    url: "/handbuch",
    icon: BookOpen,
  },
];

const dataItems = [
  {
    title: "Data Sources",
    url: "/sources",
    icon: Database,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

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
              Optimal Setup Guide
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Recommendations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
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
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
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
            Data
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
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
            Data sourced from community wikis and forums with citations.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
