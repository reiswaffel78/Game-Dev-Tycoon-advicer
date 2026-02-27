import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/seo/SeoHead";
import { Badge } from "@/components/ui/badge";
import { buildLocalizedPath, extractLocaleFromPath } from "@/lib/locale";
import {
  Compass,
  LayoutDashboard,
  Tag,
  Layers,
  Monitor,
  SlidersHorizontal,
  CalendarClock,
  FlaskConical,
  Users,
  Clock,
  ClipboardList,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Lightbulb,
  Target,
  Star,
} from "lucide-react";

type FeatureKey = "dashboard" | "topicRecommender" | "genreRecommender" | "platformRecommender" | "sliderPresets" | "planner" | "research" | "staff" | "timeline" | "checklist" | "faq" | "manual";

const featureConfig: { icon: typeof LayoutDashboard; key: FeatureKey; path: string; ctaId: string }[] = [
  { icon: LayoutDashboard, key: "dashboard",           path: "/",                   ctaId: "app_guide_to_dashboard" },
  { icon: Tag,            key: "topicRecommender",    path: "/recommend/topic",    ctaId: "app_guide_to_topic" },
  { icon: Layers,         key: "genreRecommender",    path: "/recommend/genre",    ctaId: "app_guide_to_genre" },
  { icon: Monitor,        key: "platformRecommender", path: "/recommend/platform", ctaId: "app_guide_to_platform" },
  { icon: SlidersHorizontal, key: "sliderPresets",   path: "/sliders",            ctaId: "app_guide_to_sliders" },
  { icon: CalendarClock,  key: "planner",             path: "/planner",            ctaId: "app_guide_to_planner" },
  { icon: FlaskConical,   key: "research",            path: "/research",           ctaId: "app_guide_to_research" },
  { icon: Users,          key: "staff",               path: "/staff",              ctaId: "app_guide_to_staff" },
  { icon: Clock,          key: "timeline",            path: "/timeline",           ctaId: "app_guide_to_timeline" },
  { icon: ClipboardList,  key: "checklist",           path: "/checklist",          ctaId: "app_guide_to_checklist" },
  { icon: HelpCircle,     key: "faq",                 path: "/faq",                ctaId: "app_guide_to_faq" },
  { icon: BookOpen,       key: "manual",              path: "/handbuch",           ctaId: "app_guide_to_handbuch" },
];

const workflowCtas: { key: string; path: string; ctaId: string }[] = [
  { key: "planGame",       path: "/recommend/genre", ctaId: "app_guide_workflow_plan" },
  { key: "findSliders",    path: "/sliders",         ctaId: "app_guide_workflow_sliders" },
  { key: "trackProgress",  path: "/checklist",       ctaId: "app_guide_workflow_progress" },
];

export default function AppGuidePage() {
  const { t } = useTranslation();
  const [pathname] = useLocation();
  const { locale } = extractLocaleFromPath(pathname);

  const workflows = workflowCtas.map((wf) => ({
    title: t(`appGuide.workflow.${wf.key}`),
    icon: wf.key === "planGame" ? Target : wf.key === "findSliders" ? SlidersHorizontal : ClipboardList,
    steps: t(`appGuide.workflow.${wf.key}Steps`, { returnObjects: true }) as string[],
    ctaPath: wf.path,
    ctaId: wf.ctaId,
  }));

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SeoHead pageKey="appGuide" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Compass className="h-8 w-8 text-primary" />
          {t("appGuide.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("appGuide.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            {t("appGuide.workflows")}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t("appGuide.workflowsDesc")}
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            {workflows.map((workflow) => (
              <Card key={workflow.title} data-testid={`workflow-card-${workflow.title.toLowerCase().replace(/\s+/g, '-')}`} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <workflow.icon className="h-5 w-5 text-primary" />
                    {workflow.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <ol className="space-y-2 flex-1">
                    {workflow.steps.map((step, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Button asChild size="sm" className="w-full" data-cta-id={workflow.ctaId}>
                    <Link href={buildLocalizedPath(workflow.ctaPath, locale)}>
                      {t("appGuide.startWorkflow")}
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" />
            {t("appGuide.features")}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t("appGuide.featuresDesc")}
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {featureConfig.map((feature) => {
              const tips = t(`appGuide.featureTips.${feature.key}`, { returnObjects: true }) as string[];
              const localizedHref = buildLocalizedPath(feature.path, locale);
              return (
                <Card key={feature.path} data-testid={`feature-card-${feature.key}`} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-primary" />
                      {t(`nav.${feature.key === "manual" ? "handbuch" : feature.key}`)}
                      <Badge variant="secondary" className="ml-auto text-xs font-normal">
                        {feature.path}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 gap-3">
                    <p className="text-sm text-muted-foreground flex-1">
                      {t(`appGuide.featureDesc.${feature.key}`)}
                    </p>
                    <div className="space-y-1">
                      {tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full mt-1" data-cta-id={feature.ctaId}>
                      <Link href={localizedHref}>
                        {t("appGuide.openTool")}
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                {t("appGuide.proTips")}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("appGuide.proTip1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("appGuide.proTip2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("appGuide.proTip3")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("appGuide.proTip4")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
