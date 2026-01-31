import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Tag,
  Search,
  Trophy,
  ChevronDown,
  ExternalLink,
  Info,
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
import type { Topic, RecommendationResult } from "@shared/schema";

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
  const [isOpen, setIsOpen] = useState(false);

  const medalColors: Record<number, string> = {
    1: "from-primary to-primary/80",
    2: "from-primary/80 to-primary/60",
    3: "from-primary/60 to-primary/40",
  };

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
              <CardTitle className="text-lg">{result.genre.name}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {result.platform.name}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {result.audience.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.platform.company && `${result.platform.company} • `}
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
              data-testid={`btn-citations-${rank}`}
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

export default function TopicRecommender() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [search, setSearch] = useState("");

  const { data: topics, isLoading: topicsLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: recommendations, isLoading: recsLoading } = useQuery<
    RecommendationResult[]
  >({
    queryKey: ["/api/recommend/topic", selectedTopic?.id],
    enabled: !!selectedTopic,
  });

  const filteredTopics = topics?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Tag className="h-6 w-6 text-primary" />
          Recommend by Topic
        </h1>
        <p className="text-muted-foreground">
          Select a topic to find the best genre, platform, and audience
          combinations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-topic-search"
              />
            </div>
            <ScrollArea className="h-[400px] -mx-3">
              {topicsLoading ? (
                <div className="px-3 space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="px-3 space-y-1">
                  {filteredTopics?.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`w-full text-left px-3 py-2.5 rounded-md transition-colors flex items-center justify-between gap-2 ${
                        selectedTopic?.id === topic.id
                          ? "bg-primary text-primary-foreground"
                          : "hover-elevate"
                      }`}
                      data-testid={`topic-${topic.id}`}
                    >
                      <span className="font-medium truncate">{topic.name}</span>
                      {topic.category && (
                        <Badge
                          variant={
                            selectedTopic?.id === topic.id
                              ? "secondary"
                              : "outline"
                          }
                          className="shrink-0 text-xs"
                        >
                          {topic.category}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!selectedTopic ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Trophy className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Topic</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose a topic from the list to see the top 3 recommended
                  genre and platform combinations with detailed score breakdowns
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
                  Top Recommendations for "{selectedTopic.name}"
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
                <Tag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recommendations</h3>
                <p className="text-muted-foreground">
                  No compatible combinations found for this topic.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
