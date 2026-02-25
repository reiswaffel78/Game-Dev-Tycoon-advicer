import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SeoHead } from "@/seo/SeoHead";
import { BASE_URL } from "@/seo/seo";
import { translateGenre } from "@/lib/translate-data";
import type { TFunction } from "i18next";
import { SlidersHorizontal, Search, Info, Zap, Cpu, Sparkles, Layers, X, ArrowRightLeft, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Genre, SliderPreset } from "@shared/schema";

const stageIcons = {
  1: Zap,
  2: Cpu,
  3: Sparkles,
};

const sliderNameKeys: Record<string, string> = {
  "Engine": "sliders.engine",
  "Gameplay": "sliders.gameplay",
  "Story/Quests": "sliders.storyQuests",
  "Dialogues": "sliders.dialogues",
  "Level Design": "sliders.levelDesign",
  "AI": "sliders.ai",
  "World Design": "sliders.worldDesign",
  "Graphics": "sliders.graphics",
  "Sound": "sliders.sound",
};

function SliderBar({
  name,
  value,
  importance,
  t,
}: {
  name: string;
  value: number;
  importance: "high" | "medium" | "low";
  t: (key: string) => string;
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
        <span className="text-sm font-medium">{sliderNameKeys[name] ? t(sliderNameKeys[name]) : name}</span>
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
            {t(`common.${importance}`)}
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

function PresetCard({ preset, genreId, t }: { preset: SliderPreset; genreId: string; t: (key: string, opts?: Record<string, unknown>) => string }) {
  const StageIcon = stageIcons[preset.stage as keyof typeof stageIcons] || Zap;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <StageIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{t("recommender.stage", { number: preset.stage })}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {t("sliders.phase" + preset.stage)}
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
              t={t}
            />
          ))}
        </div>
        <div className="rounded-md bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t(`sliders.explanations.${genreId}.stage${preset.stage}`, { defaultValue: preset.explanation })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GenreSelector({
  genres,
  selectedGenre,
  onSelect,
  search,
  onSearchChange,
  label,
  excludeGenreId,
  t,
  testIdPrefix,
}: {
  genres: Genre[];
  selectedGenre: Genre | null;
  onSelect: (genre: Genre) => void;
  search: string;
  onSearchChange: (value: string) => void;
  label: string;
  excludeGenreId?: string;
  t: TFunction;
  testIdPrefix: string;
}) {
  const filteredGenres = genres
    .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    .filter((g) => !excludeGenreId || g.id !== excludeGenreId);

  return (
    <Card className="h-fit">
      <CardHeader className="px-6 py-3">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-0 pb-0 space-y-1.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("recommender.searchGenres")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            data-testid={`input-${testIdPrefix}-search`}
          />
        </div>
        <ScrollArea className="max-h-[400px] -mx-3">
          <div className="px-3 space-y-0.5 pb-0.5">
            {filteredGenres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => onSelect(genre)}
                className={`w-full text-left px-3 py-1.5 rounded-md transition-colors ${
                  selectedGenre?.id === genre.id
                    ? "bg-primary text-primary-foreground"
                    : "hover-elevate"
                }`}
                data-testid={`${testIdPrefix}-genre-${genre.id}`}
              >
                <span className="font-medium">{translateGenre(t, genre.id, genre.name)}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default function SliderPresets() {
  const { t } = useTranslation();
  const [multiGenreMode, setMultiGenreMode] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [secondaryGenre, setSecondaryGenre] = useState<Genre | null>(null);
  const [search, setSearch] = useState("");
  const [secondarySearch, setSecondarySearch] = useState("");

  const { data: genres, isLoading: genresLoading } = useQuery<Genre[]>({
    queryKey: ["/api/genres"],
  });

  const { data: singlePresets, isLoading: singlePresetsLoading } = useQuery<SliderPreset[]>({
    queryKey: ["/api/sliders", selectedGenre?.id],
    enabled: !!selectedGenre && !multiGenreMode,
  });

  const { data: multiPresets, isLoading: multiPresetsLoading } = useQuery<SliderPreset[]>({
    queryKey: ["/api/sliders/multi", selectedGenre?.id, secondaryGenre?.id],
    enabled: !!selectedGenre && !!secondaryGenre && multiGenreMode,
  });

  const presets = multiGenreMode ? multiPresets : singlePresets;
  const presetsLoading = multiGenreMode ? multiPresetsLoading : singlePresetsLoading;
  const hasSelection = multiGenreMode
    ? !!selectedGenre && !!secondaryGenre
    : !!selectedGenre;

  const handleToggleMultiGenre = () => {
    if (multiGenreMode) {
      setSecondaryGenre(null);
      setSecondarySearch("");
    }
    setMultiGenreMode(!multiGenreMode);
  };

  const handleSwapGenres = () => {
    if (selectedGenre && secondaryGenre) {
      const temp = selectedGenre;
      setSelectedGenre(secondaryGenre);
      setSecondaryGenre(temp);
    }
  };

  const presetsTitle = multiGenreMode && selectedGenre && secondaryGenre
    ? t("sliders.multiGenrePresetsFor", {
        primary: translateGenre(t, selectedGenre.id, selectedGenre.name),
        secondary: translateGenre(t, secondaryGenre.id, secondaryGenre.name),
      })
    : selectedGenre
      ? t("recommender.sliderPresetsFor", { name: translateGenre(t, selectedGenre.id, selectedGenre.name) })
      : "";

  const displayGenreId = multiGenreMode && selectedGenre && secondaryGenre
    ? `${selectedGenre.id}-${secondaryGenre.id}`
    : selectedGenre?.id || "";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <SeoHead pageKey="sliders" jsonLdExtra={useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: t("sliders.title"),
        description: t("sliders.subtitle"),
        url: `${BASE_URL}/sliders`,
        inLanguage: t("lang", { defaultValue: "en" }),
        keywords: ["Game Dev Tycoon", "slider presets", "development focus", "genre settings", "game development sliders"],
        creator: {
          "@type": "Organization",
          name: "Game Dev Tycoon Advisor",
          url: BASE_URL,
        },
        variableMeasured: [
          "Engine", "Gameplay", "Story/Quests", "Dialogues", "Level Design",
          "AI", "World Design", "Graphics", "Sound",
        ],
        license: "https://creativecommons.org/licenses/by-sa/4.0/",
      }), [t])} />
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            {t("sliders.h1")}
          </h1>
          <Button
            variant={multiGenreMode ? "default" : "outline"}
            size="sm"
            onClick={handleToggleMultiGenre}
            className="gap-2"
            data-testid="button-toggle-multi-genre"
          >
            <Layers className="h-4 w-4" />
            {t("sliders.multiGenre")}
          </Button>
        </div>
        <p className="text-muted-foreground">
          {multiGenreMode ? t("sliders.multiGenreSubtitle") : t("sliders.subtitle")}
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t("sliders.h2")}</h2>
        <p className="text-sm text-muted-foreground">{t("sliders.seoIntro")}</p>
      </div>

      <Card className="border-primary/20 bg-primary/5" data-testid="card-sliders-explained-link">
        <CardContent className="py-4 px-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold">{t("sliders.explainedBox.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("sliders.explainedBox.text")}</p>
              <Link href="/game-dev-tycoon-sliders" className="inline-flex items-center text-sm font-medium text-primary hover:underline" data-testid="link-sliders-explained">
                {t("sliders.explainedBox.linkText")}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {multiGenreMode && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-3 px-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                {t("sliders.multiGenreInfo")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {multiGenreMode ? (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {genresLoading ? (
              <Card className="h-fit">
                <CardContent className="p-6 space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </CardContent>
              </Card>
            ) : genres ? (
              <>
                <GenreSelector
                  genres={genres}
                  selectedGenre={selectedGenre}
                  onSelect={setSelectedGenre}
                  search={search}
                  onSearchChange={setSearch}
                  label={t("sliders.primaryGenre")}
                  excludeGenreId={secondaryGenre?.id}
                  t={t}
                  testIdPrefix="primary"
                />
                <div className="space-y-2">
                  <GenreSelector
                    genres={genres}
                    selectedGenre={secondaryGenre}
                    onSelect={setSecondaryGenre}
                    search={secondarySearch}
                    onSearchChange={setSecondarySearch}
                    label={t("sliders.secondaryGenre")}
                    excludeGenreId={selectedGenre?.id}
                    t={t}
                    testIdPrefix="secondary"
                  />
                  {selectedGenre && secondaryGenre && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSwapGenres}
                      className="w-full gap-2"
                      data-testid="button-swap-genres"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      {t("sliders.swapGenres")}
                    </Button>
                  )}
                </div>
              </>
            ) : null}
          </div>

          <div className="space-y-4">
            {!hasSelection ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <SlidersHorizontal className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {t("sliders.selectBothGenres")}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t("sliders.selectBothGenresDesc")}
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold" data-testid="text-presets-title">
                    {presetsTitle}
                  </h2>
                </div>
                {selectedGenre && secondaryGenre && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="default" className="gap-1" data-testid="badge-primary-genre">
                      {t("sliders.primaryLabel")}: {translateGenre(t, selectedGenre.id, selectedGenre.name)}
                      <span className="text-xs opacity-75">(×2)</span>
                    </Badge>
                    <span className="text-muted-foreground">+</span>
                    <Badge variant="secondary" className="gap-1" data-testid="badge-secondary-genre">
                      {t("sliders.secondaryLabel")}: {translateGenre(t, secondaryGenre.id, secondaryGenre.name)}
                      <span className="text-xs opacity-75">(×1)</span>
                    </Badge>
                  </div>
                )}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList>
                    <TabsTrigger value="all">{t("recommender.allStages")}</TabsTrigger>
                    <TabsTrigger value="1">{t("recommender.stage", { number: 1 })}</TabsTrigger>
                    <TabsTrigger value="2">{t("recommender.stage", { number: 2 })}</TabsTrigger>
                    <TabsTrigger value="3">{t("recommender.stage", { number: 3 })}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      {presets.map((preset) => (
                        <PresetCard key={preset.stage} preset={preset} genreId={displayGenreId} t={t} />
                      ))}
                    </div>
                  </TabsContent>
                  {[1, 2, 3].map((stage) => (
                    <TabsContent key={stage} value={String(stage)} className="mt-4">
                      {presets.find((p) => p.stage === stage) && (
                        <div className="max-w-md">
                          <PresetCard
                            preset={presets.find((p) => p.stage === stage)!}
                            genreId={displayGenreId}
                            t={t}
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
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          {genresLoading ? (
            <Card className="h-fit">
              <CardContent className="p-6 space-y-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>
          ) : genres ? (
            <GenreSelector
              genres={genres}
              selectedGenre={selectedGenre}
              onSelect={setSelectedGenre}
              search={search}
              onSearchChange={setSearch}
              label={t("recommender.selectGenre")}
              t={t}
              testIdPrefix="slider"
            />
          ) : null}

          <div className="space-y-4 min-w-0">
            {!hasSelection ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <SlidersHorizontal className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {t("recommender.selectGenre")}
                  </h3>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold" data-testid="text-presets-title">
                    {presetsTitle}
                  </h2>
                </div>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList>
                    <TabsTrigger value="all">{t("recommender.allStages")}</TabsTrigger>
                    <TabsTrigger value="1">{t("recommender.stage", { number: 1 })}</TabsTrigger>
                    <TabsTrigger value="2">{t("recommender.stage", { number: 2 })}</TabsTrigger>
                    <TabsTrigger value="3">{t("recommender.stage", { number: 3 })}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      {presets.map((preset) => (
                        <PresetCard key={preset.stage} preset={preset} genreId={displayGenreId} t={t} />
                      ))}
                    </div>
                  </TabsContent>
                  {[1, 2, 3].map((stage) => (
                    <TabsContent key={stage} value={String(stage)} className="mt-4">
                      {presets.find((p) => p.stage === stage) && (
                        <div className="max-w-md">
                          <PresetCard
                            preset={presets.find((p) => p.stage === stage)!}
                            genreId={displayGenreId}
                            t={t}
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
      )}
    </div>
  );
}
