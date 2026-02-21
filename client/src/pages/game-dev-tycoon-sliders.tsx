import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { SeoHead } from "@/seo/SeoHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, SlidersHorizontal, Target } from "lucide-react";

type PhaseKey = "phase1" | "phase2" | "phase3";

export default function GameDevTycoonSlidersPage() {
  const { t } = useTranslation();

  const whyBullets = t("slidersExplained.why.items", { returnObjects: true }) as string[];
  const workflowSteps = t("slidersExplained.workflow.steps", { returnObjects: true }) as string[];
  const phases = ["phase1", "phase2", "phase3"] as PhaseKey[];

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SeoHead pageKey="slidersExplained" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <SlidersHorizontal className="h-8 w-8 text-primary" />
          {t("slidersExplained.h1")}
        </h1>
        <p className="text-muted-foreground">{t("slidersExplained.subtitle")}</p>
      </div>

      <p className="text-muted-foreground mb-8">{t("slidersExplained.seoIntro")}</p>

      <div className="space-y-8">
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t("slidersExplained.why.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {whyBullets.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("slidersExplained.h2")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {phases.map((phase, index) => (
              <Card key={phase}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="secondary">Phase {index + 1}</Badge>
                    {t(`slidersExplained.phases.${phase}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    {t(`slidersExplained.phases.${phase}.focus`)}
                  </p>
                  <div className="space-y-1">
                    {(t(`slidersExplained.phases.${phase}.tips`, { returnObjects: true }) as string[]).map(
                      (tip) => (
                        <div key={tip} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{t("slidersExplained.workflow.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {workflowSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-2">
                  <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 shrink-0">
                    {index + 1}
                  </Badge>
                  <span>{step}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-primary/5">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{t("slidersExplained.cta.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("slidersExplained.cta.description")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/sliders">{t("slidersExplained.cta.primary")}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/recommend/genre">{t("slidersExplained.cta.secondary")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
