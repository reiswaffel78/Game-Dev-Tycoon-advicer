import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Tag,
  Layers,
  Monitor,
  SlidersHorizontal,
  CalendarClock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Gamepad2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/seo";
import type { Topic, Genre, Platform } from "@shared/schema";

interface StatsData {
  topics: number;
  genres: number;
  platforms: number;
  lastUpdate: string;
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  gradient,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-all hover-elevate">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${gradient}`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold flex items-center gap-2">
                {title}
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();

  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  const { data: topCombos, isLoading: combosLoading } = useQuery<
    { topic: Topic; genre: Genre; score: number }[]
  >({
    queryKey: ["/api/top-combos"],
  });

  return (
    <>
      <SEO
        title={t("dashboard.title")}
        description={t("dashboard.subtitle")}
      />
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Gamepad2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("dashboard.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("dashboard.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title={t("dashboard.topics")}
                value={stats?.topics ?? 0}
                icon={Tag}
              />
              <StatsCard
                title={t("dashboard.genres")}
                value={stats?.genres ?? 0}
                icon={Layers}
              />
              <StatsCard
                title={t("dashboard.platforms")}
                value={stats?.platforms ?? 0}
                icon={Monitor}
              />
              <StatsCard
                title={t("dashboard.lastUpdate")}
                value={stats?.lastUpdate ?? "N/A"}
                icon={TrendingUp}
              />
            </>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t("dashboard.getStarted")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title={t("nav.topicRecommender")}
              description={t("dashboard.getStartedDesc")}
              icon={Tag}
              href="/recommend/topic"
              gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            />
            <QuickActionCard
              title={t("nav.genreRecommender")}
              description={t("dashboard.getStartedDesc")}
              icon={Layers}
              href="/recommend/genre"
              gradient="bg-gradient-to-br from-teal-500 to-emerald-600"
            />
            <QuickActionCard
              title={t("nav.platformRecommender")}
              description={t("dashboard.getStartedDesc")}
              icon={Monitor}
              href="/recommend/platform"
              gradient="bg-gradient-to-br from-orange-500 to-amber-600"
            />
            <QuickActionCard
              title={t("nav.sliderPresets")}
              description={t("sliders.subtitle")}
              icon={SlidersHorizontal}
              href="/sliders"
              gradient="bg-gradient-to-br from-pink-500 to-rose-600"
            />
            <QuickActionCard
              title={t("nav.planner")}
              description={t("planner.subtitle")}
              icon={CalendarClock}
              href="/planner"
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("dashboard.topCombos")}</h2>
          <Card>
            <CardContent className="p-0">
              {combosLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-5 w-12 ml-auto" />
                    </div>
                  ))}
                </div>
              ) : topCombos && topCombos.length > 0 ? (
                <div className="divide-y divide-border">
                  {topCombos.map((combo, index) => (
                    <div
                      key={`${combo.topic.id}-${combo.genre.id}`}
                      className="flex items-center gap-4 p-4 hover-elevate"
                      data-testid={`combo-row-${index}`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{combo.topic.name}</span>
                          <span className="text-muted-foreground">+</span>
                          <span className="font-medium">{combo.genre.name}</span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {combo.score > 0 ? "+" : ""}
                        {combo.score}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Gamepad2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>{t("recommender.noResults")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
