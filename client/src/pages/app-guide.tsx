import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
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

const featureConfig = [
  { icon: LayoutDashboard, key: "dashboard" as FeatureKey, path: "/" },
  { icon: Tag, key: "topicRecommender" as FeatureKey, path: "/recommend/topic" },
  { icon: Layers, key: "genreRecommender" as FeatureKey, path: "/recommend/genre" },
  { icon: Monitor, key: "platformRecommender" as FeatureKey, path: "/recommend/platform" },
  { icon: SlidersHorizontal, key: "sliderPresets" as FeatureKey, path: "/sliders" },
  { icon: CalendarClock, key: "planner" as FeatureKey, path: "/planner" },
  { icon: FlaskConical, key: "research" as FeatureKey, path: "/research" },
  { icon: Users, key: "staff" as FeatureKey, path: "/staff" },
  { icon: Clock, key: "timeline" as FeatureKey, path: "/timeline" },
  { icon: ClipboardList, key: "checklist" as FeatureKey, path: "/checklist" },
  { icon: HelpCircle, key: "faq" as FeatureKey, path: "/faq" },
  { icon: BookOpen, key: "manual" as FeatureKey, path: "/handbuch" },
];

export default function AppGuidePage() {
  const { t } = useTranslation();

  const workflows = [
    {
      title: t("appGuide.workflow.planGame"),
      icon: Target,
      steps: t("appGuide.workflow.planGameSteps", { returnObjects: true }) as string[],
    },
    {
      title: t("appGuide.workflow.findSliders"),
      icon: SlidersHorizontal,
      steps: t("appGuide.workflow.findSlidersSteps", { returnObjects: true }) as string[],
    },
    {
      title: t("appGuide.workflow.trackProgress"),
      icon: ClipboardList,
      steps: t("appGuide.workflow.trackProgressSteps", { returnObjects: true }) as string[],
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SEO 
        title={t("appGuide.title")} 
        description={t("appGuide.subtitle")}
      />
      
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
              <Card key={workflow.title} data-testid={`workflow-card-${workflow.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <workflow.icon className="h-5 w-5 text-primary" />
                    {workflow.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {workflow.steps.map((step, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
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
              return (
                <Card key={feature.path} data-testid={`feature-card-${feature.key}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-primary" />
                      {t(`nav.${feature.key === "manual" ? "handbuch" : feature.key}`)}
                      <Badge variant="secondary" className="ml-auto text-xs font-normal">
                        {feature.path}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
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
