import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/seo";
import { translateGenre, translateTopic, translateAudience, translatePlatform } from "@/lib/translate-data";
import {
  Monitor,
  Search,
  Trophy,
  ChevronDown,
  ExternalLink,
  Info,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Platform, RecommendationResult } from "@shared/schema";

function FitIndicator({ value, label }: { value: number; label: string }) {
  const normalizedValue = ((value + 3) / 6) * 100;
  const color =
    value >= 2
      ? "bg-emerald-500"
      : value >= 0
        ? "bg-amber-500"
        : "bg-red-500";

  const fitLabels: Record<number, string> = {
    3: "+++",
    2: "++",
    1: "+",
    0: "0",
    "-1": "-",
    "-2": "--",
    "-3": "---",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">
          {fitLabels[value] ?? value}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({
  result,
  rank,
}: {
  result: RecommendationResult;
  rank: number;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const medalColors: Record<number, string> = {
    1: "from-primary to-primary/80",
    2: "from-primary/80 to-primary/60",
    3: "from-primary/60 to-primary/40",
  };

  const topicName = translateTopic(t, result.topic.id, result.topic.name);
  const genreName = translateGenre(t, result.genre.id, result.genre.name);
  const audienceName = translateAudience(t, result.audience.id, result.audience.name);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${medalColors[rank] ?? "from-primary to-primary/80"} text-white font-bold shadow-lg`}
          >
            {rank}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg">{topicName}</CardTitle>
              <span className="text-muted-foreground">+</span>
              <CardTitle className="text-lg">{genreName}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {audienceName}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Score: <span className="font-semibold text-foreground">{result.scores.total.toFixed(2)}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">
              {result.scores.total > 0 ? "+" : ""}
              {result.scores.total.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Total Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <FitIndicator
            value={result.scores.topicGenreFit}
            label="Topic + Genre Fit"
          />
          <FitIndicator
            value={result.scores.platformGenreFit}
            label="Platform + Genre Fit"
          />
          <FitIndicator
            value={result.scores.platformAudienceFit}
            label="Platform + Audience Fit"
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cost Penalty</span>
              <span className={`font-mono font-medium ${result.scores.costPenalty < 0 ? "text-destructive" : "text-accent"}`}>
                {result.scores.costPenalty < 0 ? "" : "+"}{result.scores.costPenalty.toFixed(1)}
              </span>
            </div>
            <Progress
              value={Math.max(0, (1 - Math.abs(result.scores.costPenalty)) * 100)}
              className={`h-2 ${result.scores.costPenalty < 0 ? "[&>div]:bg-destructive" : "[&>div]:bg-accent"}`}
            />
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Citations ({result.citations.length})
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="rounded-md border bg-muted/30 p-3 space-y-2">
              {result.citations.map((citation, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <Info className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium">{citation.component}:</span>{" "}
                    <span className="text-muted-foreground">
                      {citation.sourceNames.join(", ")}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {(citation.confidence * 100).toFixed(0)}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        Confidence level based on source agreement
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

function PlatformCard({
  platform,
  isSelected,
  onClick,
}: {
  platform: Platform;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-md transition-colors ${
        isSelected ? "bg-primary text-primary-foreground" : "hover-elevate"
      }`}
      data-testid={`platform-${platform.id}`}
    >
      <div className="font-medium">{translatePlatform(t, platform.id, platform.name)}</div>
      {platform.company && (
        <div
          className={`text-xs mt-0.5 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
        >
          {platform.company}
        </div>
      )}
      <div className="flex items-center gap-3 mt-2 text-xs">
        {platform.releaseYear && (
          <span
            className={`flex items-center gap-1 ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}
          >
            <Calendar className="h-3 w-3" />
            {platform.releaseYear}
          </span>
        )}
        {platform.licenseCost && (
          <span
            className={`flex items-center gap-1 ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}
          >
            <DollarSign className="h-3 w-3" />
            {platform.licenseCost.toLocaleString()}
          </span>
        )}
      </div>
    </button>
  );
}

export default function PlatformRecommender() {
  const { t } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [search, setSearch] = useState("");

  const { data: platforms, isLoading: platformsLoading } = useQuery<Platform[]>(
    {
      queryKey: ["/api/platforms"],
    }
  );

  const { data: recommendations, isLoading: recsLoading } = useQuery<
    RecommendationResult[]
  >({
    queryKey: ["/api/recommend/platform", selectedPlatform?.id],
    enabled: !!selectedPlatform,
  });

  const filteredPlatforms = platforms?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <SEO 
        title={t("nav.platformRecommender")} 
        description={t("dashboard.getStartedDesc")}
        path="/recommend/platform"
      />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Monitor className="h-6 w-6 text-primary" />
          {t("nav.platformRecommender")}
        </h1>
        <p className="text-muted-foreground">
          {t("dashboard.getStartedDesc")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("recommender.selectPlatform")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search platforms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-platform-search"
              />
            </div>
            <ScrollArea className="h-[400px] -mx-3">
              {platformsLoading ? (
                <div className="px-3 space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="px-3 space-y-1">
                  {filteredPlatforms?.map((platform) => (
                    <PlatformCard
                      key={platform.id}
                      platform={platform}
                      isSelected={selectedPlatform?.id === platform.id}
                      onClick={() => setSelectedPlatform(platform)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!selectedPlatform ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Trophy className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("recommender.selectPlatform")}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t("dashboard.getStartedDesc")}
                </p>
              </CardContent>
            </Card>
          ) : recsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  Top Recommendations for "{selectedPlatform.name}"
                </h2>
                <Badge>{recommendations.length} results</Badge>
              </div>
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} result={rec} rank={i + 1} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Monitor className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("recommender.noResults")}</h3>
                <p className="text-muted-foreground">
                  {t("recommender.adjustFilters")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
