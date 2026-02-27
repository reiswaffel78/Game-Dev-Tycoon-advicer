import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { buildLocalizedPath, extractLocaleFromPath } from "@/lib/locale";
import { SeoHead } from "@/seo/SeoHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FlaskConical, Lightbulb, ListChecks } from "lucide-react";

type EraKey = "early" | "mid" | "late";

export default function GameDevTycoonResearchOrderPage() {
  const { t } = useTranslation();
  const [pathname] = useLocation();
  const { locale } = extractLocaleFromPath(pathname);
  const researchPath = buildLocalizedPath("/research", locale);
  const timelinePath = buildLocalizedPath("/timeline", locale);

  const priorities = t("researchOrder.priorities.items", { returnObjects: true }) as string[];
  const mistakes = t("researchOrder.mistakes.items", { returnObjects: true }) as string[];
  const eras = ["early", "mid", "late"] as EraKey[];

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SeoHead pageKey="researchOrder" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <FlaskConical className="h-8 w-8 text-primary" />
          {t("researchOrder.h1")}
        </h1>
        <p className="text-muted-foreground">{t("researchOrder.subtitle")}</p>
      </div>

      <p className="text-muted-foreground mb-8">{t("researchOrder.seoIntro")}</p>

      <div className="space-y-8">
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                {t("researchOrder.priorities.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {priorities.map((item, index) => (
                <div key={item} className="flex items-start gap-2">
                  <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 shrink-0">
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
            <Lightbulb className="h-6 w-6 text-amber-500" />
            {t("researchOrder.h2")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {eras.map((era) => (
              <Card key={era}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t(`researchOrder.eras.${era}.title`)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {(t(`researchOrder.eras.${era}.items`, { returnObjects: true }) as string[]).map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{t("researchOrder.mistakes.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {mistakes.map((item) => (
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
                <h3 className="text-lg font-semibold">{t("researchOrder.cta.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("researchOrder.cta.description")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild data-cta-id="research_order_to_research">
                  <Link href={researchPath}>{t("researchOrder.cta.primary")}</Link>
                </Button>
                <Button variant="outline" asChild data-cta-id="research_order_to_timeline">
                  <Link href={timelinePath}>{t("researchOrder.cta.secondary")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
