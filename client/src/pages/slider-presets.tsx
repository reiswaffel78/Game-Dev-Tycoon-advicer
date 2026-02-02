import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/seo";
import { translateGenre } from "@/lib/translate-data";
import { SlidersHorizontal, Search, Info, Zap, Cpu, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Genre, SliderPreset } from "@shared/schema";

const sliderNames = [
  "Engine",
  "Gameplay",
  "Story/Quests",
  "Dialogues",
  "Level Design",
  "AI",
  "World Design",
  "Graphics",
  "Sound",
];

const stageIcons = {
  1: Zap,
  2: Cpu,
  3: Sparkles,
};

function SliderBar({
  name,
  value,
  importance,
}: {
  name: string;
  value: number;
  importance: "high" | "medium" | "low";
}) {
  const colorClass =
    importance === "high"
      ? "bg-emerald-500"
      : importance === "medium"
        ? "bg-amber-500"
        : "bg-slate-400";

  const bgClass =
    importance === "high"
      ? "bg-emerald-500/20"
      : importance === "medium"
        ? "bg-amber-500/20"
        : "bg-muted";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{name}</span>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs ${
              importance === "high"
                ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                : importance === "medium"
                  ? "border-amber-500/50 text-amber-600 dark:text-amber-400"
                  : ""
            }`}
          >
            {importance}
          </Badge>
          <span className="font-mono text-sm font-semibold w-8 text-right">
            {value}
          </span>
        </div>
      </div>
      <div className={`h-3 rounded-full ${bgClass} overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function PresetCard({ preset }: { preset: SliderPreset }) {
  const StageIcon = stageIcons[preset.stage as keyof typeof stageIcons] || Zap;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <StageIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Stage {preset.stage}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Development Phase {preset.stage}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {preset.sliders.map((slider) => (
            <SliderBar
              key={slider.name}
              name={slider.name}
              value={slider.value}
              importance={slider.importance}
            />
          ))}
        </div>
        <div className="rounded-md bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {preset.explanation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SliderPresets() {
  const { t } = useTranslation();
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [search, setSearch] = useState("");

  const { data: genres, isLoading: genresLoading } = useQuery<Genre[]>({
    queryKey: ["/api/genres"],
  });

  const { data: presets, isLoading: presetsLoading } = useQuery<SliderPreset[]>(
    {
      queryKey: ["/api/sliders", selectedGenre?.id],
      enabled: !!selectedGenre,
    }
  );

  const filteredGenres = genres?.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <SEO 
        title={t("sliders.title")} 
        description={t("sliders.subtitle")}
        path="/sliders"
      />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="h-6 w-6 text-primary" />
          {t("sliders.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("sliders.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("recommender.selectGenre")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search genres..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-slider-genre-search"
              />
            </div>
            <ScrollArea className="h-[400px] -mx-3">
              {genresLoading ? (
                <div className="px-3 space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="px-3 space-y-1">
                  {filteredGenres?.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => setSelectedGenre(genre)}
                      className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                        selectedGenre?.id === genre.id
                          ? "bg-primary text-primary-foreground"
                          : "hover-elevate"
                      }`}
                      data-testid={`slider-genre-${genre.id}`}
                    >
                      <span className="font-medium">{translateGenre(t, genre.id, genre.name)}</span>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!selectedGenre ? (
            <Card>
              <CardContent className="py-16 text-center">
                <SlidersHorizontal className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("recommender.selectGenre")}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t("sliders.selectGenre")}
                </p>
              </CardContent>
            </Card>
          ) : presetsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-48 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : presets && presets.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  Slider Presets for "{selectedGenre.name}"
                </h2>
              </div>
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Stages</TabsTrigger>
                  <TabsTrigger value="1">Stage 1</TabsTrigger>
                  <TabsTrigger value="2">Stage 2</TabsTrigger>
                  <TabsTrigger value="3">Stage 3</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {presets.map((preset) => (
                      <PresetCard key={preset.stage} preset={preset} />
                    ))}
                  </div>
                </TabsContent>
                {[1, 2, 3].map((stage) => (
                  <TabsContent key={stage} value={String(stage)} className="mt-4">
                    {presets.find((p) => p.stage === stage) && (
                      <div className="max-w-md">
                        <PresetCard
                          preset={presets.find((p) => p.stage === stage)!}
                        />
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <SlidersHorizontal className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
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
