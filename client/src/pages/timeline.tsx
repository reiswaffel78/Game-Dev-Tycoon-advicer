import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Clock, Search, Calendar, Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeoHead } from "@/seo/SeoHead";
import { BASE_URL } from "@/seo/seo";
import type { TimelineMilestone } from "@shared/schema";

const getEventTypeConfig = (t: TFunction): Record<string, { label: string; color: string; bgColor: string }> => ({
  platform_release: { 
    label: t("timeline.eventTypes.platformRelease"), 
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500"
  },
  platform_retire: { 
    label: t("timeline.eventTypes.platformRetire"), 
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-500"
  },
  tip: { 
    label: t("timeline.eventTypes.tip"), 
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500"
  },
  office_available: { 
    label: t("timeline.eventTypes.officeAvailable"), 
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500"
  },
  feature_unlock: { 
    label: t("timeline.eventTypes.featureUnlock"), 
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500"
  },
});

const importanceColors: Record<string, string> = {
  critical: "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/50",
  high: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/50",
  medium: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/50",
  low: "bg-muted text-muted-foreground",
};

function MilestoneCard({ milestone, t }: { milestone: TimelineMilestone; t: TFunction }) {
  const eventTypeConfig = getEventTypeConfig(t);
  const config = eventTypeConfig[milestone.eventType] || eventTypeConfig.tip;
  
  const titleKey = `timeline.items.${milestone.id}.title`;
  const descKey = `timeline.items.${milestone.id}.description`;
  const actionKey = `timeline.items.${milestone.id}.action`;
  
  const milestoneTitle = t(titleKey) !== titleKey ? t(titleKey) : milestone.title;
  const milestoneDesc = t(descKey) !== descKey ? t(descKey) : (milestone.description || "");
  const milestoneAction = t(actionKey) !== actionKey ? t(actionKey) : (milestone.actionAdvice || "");
  
  const getImportanceLabel = (importance: string) => {
    const labels: Record<string, string> = {
      critical: t("timeline.critical"),
      high: t("timeline.high"),
      medium: t("timeline.medium"),
      low: t("timeline.low"),
    };
    return labels[importance] || importance;
  };
  
  return (
    <div className="flex gap-4" data-testid={`milestone-${milestone.id}`}>
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${config.bgColor}`} />
        <div className="w-0.5 flex-1 bg-border" />
      </div>
      
      <Card className="flex-1 mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={config.color}>
                  {config.label}
                </Badge>
                {milestone.importance && (
                  <Badge className={importanceColors[milestone.importance] || importanceColors.medium}>
                    {getImportanceLabel(milestone.importance)}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base">{milestoneTitle}</CardTitle>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {t("common.yearPrefix")}{milestone.year}
                {milestone.month ? ` ${t("common.monthPrefix")}${milestone.month}` : ""}
                {milestone.week ? ` ${t("common.weekPrefix")}${milestone.week}` : ""}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {milestoneDesc && (
            <p className="text-sm text-muted-foreground">{milestoneDesc}</p>
          )}
          
          {milestoneAction && (
            <div className="flex items-start gap-2 rounded-md bg-primary/5 p-3 border border-primary/10">
              <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">{t("timeline.action")}: </span>
                {milestoneAction}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Timeline() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [importanceFilter, setImportanceFilter] = useState("all");

  const { data: milestones, isLoading } = useQuery<TimelineMilestone[]>({
    queryKey: ["/api/timeline"],
  });

  const filteredMilestones = milestones?.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase());
    const matchesEvent = eventFilter === "all" || m.eventType === eventFilter;
    const matchesImportance = importanceFilter === "all" || m.importance === importanceFilter;
    return matchesSearch && matchesEvent && matchesImportance;
  });

  const groupedByYear = filteredMilestones?.reduce((acc, m) => {
    const year = m.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {} as Record<number, TimelineMilestone[]>);

  const sortedYears = groupedByYear ? Object.keys(groupedByYear).map(Number).sort((a, b) => a - b) : [];

  const eventTypeConfig = getEventTypeConfig(t);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <SeoHead pageKey="timeline" jsonLdExtra={useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: t("timeline.title"),
        description: t("timeline.subtitle"),
        url: `${BASE_URL}/timeline`,
        inLanguage: t("lang", { defaultValue: "en" }),
        totalTime: "PT45M",
        step: (t("schema.timeline.steps", { returnObjects: true }) as string[]).map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: (t("schema.timeline.stepNames", { returnObjects: true }) as string[])[i],
          text,
        })),
      }), [t])} />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          {t("timeline.h1")}
        </h1>
        <p className="text-muted-foreground">
          {t("timeline.subtitle")}
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t("timeline.h2")}</h2>
        <p className="text-muted-foreground text-sm">{t("timeline.seoIntro")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("timeline.searchTimeline")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-timeline-search"
          />
        </div>
        
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-event-filter">
            <SelectValue placeholder={t("timeline.eventType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("timeline.allEvents")}</SelectItem>
            {Object.entries(eventTypeConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={importanceFilter} onValueChange={setImportanceFilter}>
          <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-importance-filter">
            <SelectValue placeholder={t("timeline.importance")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("timeline.allLevels")}</SelectItem>
            <SelectItem value="critical">{t("timeline.critical")}</SelectItem>
            <SelectItem value="high">{t("timeline.high")}</SelectItem>
            <SelectItem value="medium">{t("timeline.medium")}</SelectItem>
            <SelectItem value="low">{t("timeline.low")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-3 h-3 rounded-full shrink-0" />
              <Card className="flex-1">
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : filteredMilestones && filteredMilestones.length > 0 ? (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year} className="space-y-2">
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-16 h-8 rounded-md bg-primary text-primary-foreground font-bold text-sm">
                    {t("common.yearPrefix")}{year}
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <Badge variant="outline">{groupedByYear?.[year].length} {t("timeline.events")}</Badge>
                </div>
              </div>
              
              <div className="pl-2">
                {groupedByYear?.[year]
                  .sort((a, b) => {
                    const monthA = a.month || 1;
                    const monthB = b.month || 1;
                    const weekA = a.week || 1;
                    const weekB = b.week || 1;
                    return monthA !== monthB ? monthA - monthB : weekA - weekB;
                  })
                  .map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} t={t} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("timeline.noMilestonesFound")}</h3>
            <p className="text-muted-foreground">
              {search || eventFilter !== "all" || importanceFilter !== "all"
                ? t("recommender.adjustFilters")
                : t("timeline.noTimelineEvents")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
