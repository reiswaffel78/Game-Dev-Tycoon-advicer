import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { SeoHead } from "@/seo/SeoHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  FlaskConical,
  Home,
  Target,
} from "lucide-react";

type PhaseKey = "garage" | "office" | "rdLab";

const phaseIcons: Record<PhaseKey, typeof Home> = {
  garage: Home,
  office: Building2,
  rdLab: FlaskConical,
};

export default function GameDevTycoonGuidePage() {
  const { t } = useTranslation();

  const checklist = t("guide.quickChecklist", { returnObjects: true }) as string[];
  const pitfalls = t("guide.pitfalls.items", { returnObjects: true }) as string[];
  const phases = [
    {
      key: "garage",
      steps: t("guide.phases.garage.steps", { returnObjects: true }) as string[],
    },
    {
      key: "office",
      steps: t("guide.phases.office.steps", { returnObjects: true }) as string[],
    },
    {
      key: "rdLab",
      steps: t("guide.phases.rdLab.steps", { returnObjects: true }) as string[],
    },
  ] satisfies Array<{ key: PhaseKey; steps: string[] }>;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SeoHead pageKey="guide" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          {t("guide.h1")}
        </h1>
        <p className="text-muted-foreground">{t("guide.subtitle")}</p>
        <p className="text-muted-foreground text-sm mt-4">{t("guide.seoIntro")}</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            {t("guide.h2")}
          </h2>
          <Card>
            <CardContent className="p-6 space-y-3">
              {checklist.map((item, index) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 shrink-0">
                    {index + 1}
                  </Badge>
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-amber-500" />
            {t("guide.phasesTitle")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {phases.map((phase) => {
              const Icon = phaseIcons[phase.key];
              return (
                <Card key={phase.key} data-testid={`guide-phase-${phase.key}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {t(`guide.phases.${phase.key}.title`)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t(`guide.phases.${phase.key}.subtitle`)}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {phase.steps.map((step) => (
                      <div key={step} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("guide.pitfalls.title")}</h2>
          <Card className="bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="p-6 space-y-2 text-sm">
              {pitfalls.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-primary/5">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{t("guide.cta.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("guide.cta.description")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/recommend/genre">{t("guide.cta.primary")}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/sliders">{t("guide.cta.secondary")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
