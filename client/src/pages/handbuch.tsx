import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoHead } from "@/seo/SeoHead";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NextStepCTA } from "@/components/next-step-cta";
import {
  BookOpen,
  Gamepad2,
  TrendingUp,
  Users,
  Building2,
  Lightbulb,
  Target,
  Zap,
  Star,
  AlertTriangle,
} from "lucide-react";

const VALID_TABS = ["basics", "development", "scoring", "team", "research", "advanced"];

export default function HandbuchPage() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (VALID_TABS.includes(hash)) return hash;
    }
    return "basics";
  });

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <SeoHead pageKey="handbuch" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          {t("manual.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("manual.subtitle")}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="basics" className="flex items-center gap-1" data-testid="tab-basics">
            <Gamepad2 className="h-4 w-4" />
            {t("manual.tabs.basics")}
          </TabsTrigger>
          <TabsTrigger value="development" className="flex items-center gap-1" data-testid="tab-development">
            <Zap className="h-4 w-4" />
            {t("manual.tabs.development")}
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center gap-1" data-testid="tab-scoring">
            <Star className="h-4 w-4" />
            {t("manual.tabs.scoring")}
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-1" data-testid="tab-team">
            <Users className="h-4 w-4" />
            {t("manual.tabs.team")}
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-1" data-testid="tab-research">
            <Lightbulb className="h-4 w-4" />
            {t("manual.tabs.research")}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1" data-testid="tab-advanced">
            <Target className="h-4 w-4" />
            {t("manual.tabs.advanced")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                {t("manual.basics.welcome")}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>{t("manual.basics.intro")}</p>
              
              <h3 className="flex items-center gap-2 mt-6">
                <Building2 className="h-4 w-4" />
                {t("manual.basics.phases")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 not-prose mt-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{t("manual.basics.phase1Title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("manual.basics.phase1Desc")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{t("manual.basics.phase2Title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("manual.basics.phase2Desc")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{t("manual.basics.phase3Title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("manual.basics.phase3Desc")}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{t("manual.basics.phase4Title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("manual.basics.phase4Desc")}</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="flex items-center gap-2 mt-6">
                <Target className="h-4 w-4" />
                {t("manual.basics.goals")}
              </h3>
              <ul>
                <li>{t("manual.basics.goal1")}</li>
                <li>{t("manual.basics.goal2")}</li>
                <li>{t("manual.basics.goal3")}</li>
                <li>{t("manual.basics.goal4")}</li>
                <li>{t("manual.basics.goal5")}</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t("manual.development.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h3>{t("manual.development.phases")}</h3>
              <p>{t("manual.development.phasesIntro")}</p>
              
              <div className="not-prose grid gap-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-blue-600">{t("manual.development.phase1Badge")}</Badge>
                      {t("manual.development.phase1Title")}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">{t("manual.development.phase1Desc")}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{t("manual.development.sliderEngine")}</Badge>
                      <Badge variant="outline">{t("manual.development.sliderGameplay")}</Badge>
                      <Badge variant="outline">{t("manual.development.sliderStory")}</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-green-600">{t("manual.development.phase2Badge")}</Badge>
                      {t("manual.development.phase2Title")}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">{t("manual.development.phase2Desc")}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{t("manual.development.sliderDialogues")}</Badge>
                      <Badge variant="outline">{t("manual.development.sliderLevelDesign")}</Badge>
                      <Badge variant="outline">{t("manual.development.sliderAI")}</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge className="bg-purple-600">{t("manual.development.phase3Badge")}</Badge>
                      {t("manual.development.phase3Title")}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">{t("manual.development.phase3Desc")}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{t("manual.development.sliderWorldDesign")}</Badge>
                      <Badge variant="outline">{t("manual.development.sliderGraphics")}</Badge>
                      <Badge variant="outline">{t("manual.development.sliderSound")}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6">{t("manual.development.combos")}</h3>
              <p>{t("manual.development.combosDesc1")}</p>
              <p>{t("manual.development.combosDesc2")}</p>

              <div className="not-prose mt-4">
                <Card className="bg-amber-500/10 border-amber-500/30">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">{t("manual.development.warning")}</h4>
                      <p className="text-sm text-muted-foreground">{t("manual.development.warningDesc")}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                {t("manual.scoring.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>{t("manual.scoring.intro")}</p>

              <div className="not-prose grid gap-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{t("manual.scoring.topicGenre")}</h4>
                      <Badge>{t("manual.scoring.topicGenreWeight")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("manual.scoring.topicGenreDesc")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{t("manual.scoring.sliders")}</h4>
                      <Badge>{t("manual.scoring.slidersWeight")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("manual.scoring.slidersDesc")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{t("manual.scoring.platform")}</h4>
                      <Badge>{t("manual.scoring.platformWeight")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("manual.scoring.platformDesc")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{t("manual.scoring.tech")}</h4>
                      <Badge>{t("manual.scoring.techWeight")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("manual.scoring.techDesc")}</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="mt-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t("manual.scoring.tipsTitle")}
              </h3>
              <ul>
                <li>{t("manual.scoring.tip1")}</li>
                <li>{t("manual.scoring.tip2")}</li>
                <li>{t("manual.scoring.tip3")}</li>
                <li>{t("manual.scoring.tip4")}</li>
                <li>{t("manual.scoring.tip5")}</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" id="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {t("manual.team.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>{t("manual.team.intro")}</p>

              <div className="not-prose grid gap-4 mt-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">{t("manual.team.hiring")}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>{t("manual.team.hiringTip1")}</li>
                      <li>{t("manual.team.hiringTip2")}</li>
                      <li>{t("manual.team.hiringTip3")}</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">{t("manual.team.training")}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>{t("manual.team.trainingTip1")}</li>
                      <li>{t("manual.team.trainingTip2")}</li>
                      <li>{t("manual.team.trainingTip3")}</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">{t("manual.team.roles")}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>{t("manual.team.rolesTip1")}</li>
                      <li>{t("manual.team.rolesTip2")}</li>
                      <li>{t("manual.team.rolesTip3")}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          <NextStepCTA
            href="/staff"
            titleKey="nextStep.handbookToStaff.title"
            bodyKey="nextStep.handbookToStaff.body"
            dataCdaId="handbook_to_staff"
          />
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                {t("manual.research.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>{t("manual.research.intro")}</p>

              <div className="not-prose grid gap-4 mt-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">{t("manual.research.priority")}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>{t("manual.research.priority1")}</li>
                      <li>{t("manual.research.priority2")}</li>
                      <li>{t("manual.research.priority3")}</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">{t("manual.research.timing")}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>{t("manual.research.timingTip1")}</li>
                      <li>{t("manual.research.timingTip2")}</li>
                      <li>{t("manual.research.timingTip3")}</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">{t("manual.research.rdLab")}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>{t("manual.research.rdLabTip1")}</li>
                      <li>{t("manual.research.rdLabTip2")}</li>
                      <li>{t("manual.research.rdLabTip3")}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t("manual.advanced.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <div className="not-prose grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      {t("manual.advanced.engines")}
                    </h4>
                    <p className="text-sm text-muted-foreground">{t("manual.advanced.enginesDesc")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {t("manual.advanced.sequels")}
                    </h4>
                    <p className="text-sm text-muted-foreground">{t("manual.advanced.sequelsDesc")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      {t("manual.advanced.aaa")}
                    </h4>
                    <p className="text-sm text-muted-foreground">{t("manual.advanced.aaaDesc")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      {t("manual.advanced.hardware")}
                    </h4>
                    <p className="text-sm text-muted-foreground">{t("manual.advanced.hardwareDesc")}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
