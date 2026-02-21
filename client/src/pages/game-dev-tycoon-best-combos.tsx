import { useMemo } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { SeoHead } from "@/seo/SeoHead";
import { BASE_URL } from "@/seo/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Star, Target } from "lucide-react";

export default function GameDevTycoonBestCombosPage() {
  const { t } = useTranslation();

  const fitBullets = t("bestCombos.fit.bullets", { returnObjects: true }) as string[];
  const starterCombos = t("bestCombos.starterCombos.items", { returnObjects: true }) as string[];
  const avoidBullets = t("bestCombos.avoid.items", { returnObjects: true }) as string[];

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SeoHead pageKey="bestCombos" jsonLdExtra={useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: t("bestCombos.title"),
        description: t("bestCombos.subtitle"),
        url: `${BASE_URL}/game-dev-tycoon-best-combos`,
        inLanguage: t("lang", { defaultValue: "en" }),
        keywords: ["Game Dev Tycoon", "best combinations", "topic genre fit", "game development", "combo guide"],
        creator: {
          "@type": "Organization",
          name: "Game Dev Tycoon Advisor",
          url: BASE_URL,
        },
        license: "https://creativecommons.org/licenses/by-sa/4.0/",
      }), [t])} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
          {t("bestCombos.h1")}
        </h1>
        <p className="text-muted-foreground">{t("bestCombos.subtitle")}</p>
      </div>

      <p className="text-muted-foreground mb-8">{t("bestCombos.seoIntro")}</p>

      <div className="space-y-8">
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t("bestCombos.fit.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{t("bestCombos.fit.description")}</p>
              <ul className="space-y-2">
                {fitBullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" />
            {t("bestCombos.h2")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {starterCombos.map((combo, index) => (
              <Card key={combo}>
                <CardContent className="p-4 flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    #{index + 1}
                  </Badge>
                  <span className="text-sm">{combo}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{t("bestCombos.avoid.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {avoidBullets.map((item) => (
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
                <h3 className="text-lg font-semibold">{t("bestCombos.cta.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("bestCombos.cta.description")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/recommend/genre">{t("bestCombos.cta.primary")}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/sliders">{t("bestCombos.cta.secondary")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
